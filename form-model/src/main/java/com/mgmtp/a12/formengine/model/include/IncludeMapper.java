/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
package com.mgmtp.a12.formengine.model.include;

import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.ButtonType;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.ExpressionCellType;
import com.mgmtp.a12.formengine.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.HeaderFooterType;
import com.mgmtp.a12.formengine.model.types.Id;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.types.TextCellType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class IncludeMapper {

	public static class IncludeMappingResult {
		public List<ScreenElementType> elements;
		public List<GroupConfigurationEntryType> groupEntries;
		public List<FieldConfigurationEntryType> fieldEntries;

		private IncludeMappingResult(
			final List<ScreenElementType> elements,
			final List<GroupConfigurationEntryType> groupEntries,
			final List<FieldConfigurationEntryType> fieldEntries
		) {
			this.elements = elements;
			this.groupEntries = groupEntries;
			this.fieldEntries = fieldEntries;
		}

		public static IncludeMappingResult emptyMapping() {
			return new IncludeMappingResult(Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
		}
	}

	private final DocumentModelAccess hostDmAccess;
	private final FormModelResolver modelResolver;

	public IncludeMapper(
		final DocumentModelAccess hostDmAccess,
		final FormModelResolver modelResolver
	) {
		Objects.requireNonNull(modelResolver);
		this.hostDmAccess = hostDmAccess;
		this.modelResolver = modelResolver;
	}

	public IncludeMappingResult expand(final ScreenElementType includeElement) {
		Objects.requireNonNull(includeElement);

		if (includeElement.getIncludeId() == null
			|| includeElement.getFormModelRef() == null
			|| includeElement.getHostDocumentModelPath() == null) {
			return new IncludeMappingResult(Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
		}

		final var modelReference = includeElement.getFormModelRef();

		final var formModelResult = modelResolver.resolveFormModel(modelReference);

		final var screenToInsert = formModelResult.formModel.getContent().getScreens().get(0);
		if (screenToInsert == null) {
			throw new RuntimeException(String.format(
				"Include form model '%s' does not contain a screen",
				modelReference
			));
		}
		final var referenceMapping = prepareIncludedElements(
			includeElement,
			screenToInsert,
			formModelResult.documentModelAccess
		);

		final var fieldConfigEntries = selectFieldConfigEntries(formModelResult.formModel, referenceMapping);
		final var groupConfigEntries = selectGroupConfigEntries(formModelResult.formModel, referenceMapping);

		return new IncludeMappingResult(
			new ArrayList<>(screenToInsert.getScreenElements()),
			groupConfigEntries,
			fieldConfigEntries
		);
	}

	private Map<String, String> prepareIncludedElements(
		final ScreenElementType includeElement,
		final ScreenType screenToInsert,
		final DocumentModelAccess documentModelAccess
	) {
		adaptModelElementIds(includeElement, screenToInsert);

		final Map<String, String> referenceMapping =
			updateDocumentModelReferences(
				screenToInsert,
				documentModelAccess,
				includeElement.getHostDocumentModelPath()
			);

		screenToInsert.getScreenElements().forEach(element -> {
			if (screenToInsert.getScreenElements().size() == 1) {
				element.setName(includeElement.getName());
			} else {
				// If there is more than one screen element to insert, we cannot just use the include elements name for
				// those elements since this would result in duplicate names among the sibling elements.
				// Thus, we use the include element's includeId as a prefix and add the replacement elements name to it.
				element.setName(includeElement.getIncludeId() + "-" + element.getName());
			}
			element.setIncludeId(includeElement.getIncludeId());
			element.setFormModelRef(includeElement.getFormModelRef());
			element.setHostDocumentModelPath(includeElement.getHostDocumentModelPath());
		});

		return referenceMapping;
	}


	private List<GroupConfigurationEntryType> selectGroupConfigEntries(
		final FormModel formModel,
		final Map<String, String> referenceMapping
	) {
		return formModel.getContent()
						.getGroupConfiguration()
						.getGroup()
						.stream()
						.filter(groupEntry -> referenceMapping.containsKey(groupEntry.getGroupRef()))
						.map(groupEntry -> groupEntry.withGroupRef(referenceMapping.get(groupEntry.getGroupRef())))
						.collect(Collectors.toList());
	}

	private List<FieldConfigurationEntryType> selectFieldConfigEntries(
		final FormModel formModel,
		final Map<String, String> referenceMapping
	) {
		return formModel.getContent()
						.getFieldConfiguration()
						.getField()
						.stream()
						.filter(fieldEntry -> referenceMapping.containsKey(fieldEntry.getElementRef()))
						.map(fieldEntry -> fieldEntry.withElementRef(referenceMapping.get(fieldEntry.getElementRef())))
						.collect(Collectors.toList());
	}

	private Map<String, String> updateDocumentModelReferences(
		final ScreenType screenToInsert,
		final DocumentModelAccess modelAccess,
		final String documentModelPath
	) {
		final var referenceMapping = new LinkedHashMap<String, String>();

		new ModelWalker(new ModelVisitor() {

			private void updateMapping(final String originalReference) {
				var originalElementPath =
					modelAccess.getElementPath(originalReference)
							   .orElseThrow(() -> new RuntimeException(String.format(
								   "Cannot find document model element with id: '%s'",
								   originalReference
							   )));

				// This is just a hack to allow defining the name of the include group within the
				// document model path in the UI Designers include settings. Needs to be done properly.
				var shortenedOrigElemPath = (documentModelPath.equals("/") || documentModelPath.equals(""))
											? originalElementPath
											: (originalElementPath.chars().filter(ch -> ch == '/').count() > 1)
											  ? originalElementPath.substring(originalElementPath.indexOf("/", 1))
											  : "";

				var mappedElementPath = documentModelPath + shortenedOrigElemPath;

				var mappedElement = hostDmAccess.findElementByPath(mappedElementPath)
												.orElseThrow(() -> new RuntimeException(String.format(
													"Cannot find mapped document model element with path '%s'",
													mappedElementPath
												)));

				referenceMapping.put(originalReference, mappedElement.getId());
			}

			@Override
			public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
				var groupRef = repeat.getGroupRef();
				updateMapping(groupRef);
				repeat.setGroupRef(referenceMapping.get(groupRef));
				return true;
			}

			@Override
			public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
				var groupRef = repeat.getGroupRef();
				updateMapping(groupRef);
				repeat.setGroupRef(referenceMapping.get(groupRef));
				return true;
			}

			@Override
			public boolean visitInlineRepeat(final InlineRepeatType repeat) {
				var groupRef = repeat.getGroupRef();
				updateMapping(groupRef);
				repeat.setGroupRef(referenceMapping.get(groupRef));
				return true;
			}

			@Override
			public boolean visitControl(final ControlType control) {
				var elementRef = control.getElementRef();
				updateMapping(elementRef);
				control.setElementRef(referenceMapping.get(elementRef));
				return true;
			}

			@Override
			public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {
				if (repeatColumn instanceof FieldBasedRepeatOverviewColumnType) {
					var elementRef = ((FieldBasedRepeatOverviewColumnType) repeatColumn).getElementRef();
					updateMapping(elementRef);
					((FieldBasedRepeatOverviewColumnType) repeatColumn).setElementRef(referenceMapping.get(elementRef));
				}
				return true;
			}

			@Override
			public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
				throw new RuntimeException("Cannot handle included model with expression cells!");
			}
		}).acceptScreen(screenToInsert);

		return referenceMapping;
	}

	private void adaptModelElementIds(
		final ScreenElementType includeElement,
		final ScreenType screenToInsert
	) {
		// beware: long and repetitive piece of code ahead
		new ModelWalker(new ModelVisitor() {
			@Override
			public boolean visitScreen(final ScreenType screen) {
				setNewId(includeElement.getIncludeId(), screen);
				return true;
			}

			@Override
			public boolean visitSection(final SectionType section) {
				setNewId(includeElement.getIncludeId(), section);
				return true;
			}

			@Override
			public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
				setNewId(includeElement.getIncludeId(), repeat);
				return true;
			}

			@Override
			public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
				setNewId(includeElement.getIncludeId(), repeat);
				return true;
			}

			@Override
			public boolean visitControlGrid(final ControlGridType grid) {
				setNewId(includeElement.getIncludeId(), grid);
				return true;
			}

			@Override
			public boolean visitRow(final RowType row) {
				setNewId(includeElement.getIncludeId(), row);
				return true;
			}

			@Override
			public boolean visitControl(final ControlType control) {
				setNewId(includeElement.getIncludeId(), control);
				return true;
			}

			@Override
			public boolean visitTextCell(final TextCellType textCell) {
				setNewId(includeElement.getIncludeId(), textCell);
				return true;
			}

			@Override
			public boolean visitInlineRepeat(final InlineRepeatType repeat) {
				setNewId(includeElement.getIncludeId(), repeat);
				return true;
			}

			@Override
			public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {
				setNewId(includeElement.getIncludeId(), repeatColumn);
				return true;
			}

			@Override
			public boolean visitButtonPanel(final ButtonPanelType panel) {
				setNewId(includeElement.getIncludeId(), panel);
				return true;
			}

			@Override
			public boolean visitHeaderFooter(final HeaderFooterType headerFooter) {
				setNewId(includeElement.getIncludeId(), headerFooter);
				return true;
			}

			@Override
			public boolean visitButton(final ButtonType button) {
				setNewId(includeElement.getIncludeId(), button);
				return true;
			}

			@Override
			public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
				setNewId(includeElement.getIncludeId(), expressionCell);
				return true;
			}
		}).acceptScreen(screenToInsert);
	}

	private <T extends Id> void setNewId(final String includeId, final T modelElement) {
		modelElement.setId(includeId + "_" + modelElement.getId());
	}
}
