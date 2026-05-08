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
 * 1. Open-Source License – EUPL v1.2
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
package com.mgmtp.a12.melies.model.include;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ButtonPanelType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.ScreenElementType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;

import java.util.LinkedHashMap;

/**
 * Contains the expansion logic for form model includes.
 * <p>
 * The include mechanism only works on elements of type {@link ScreenElementType}.
 * Those elements represent an include only when the properties "formModelRef" and "hostDocumentModelPath" are set.
 * </p>
 * <p>
 * The "formModelRef" property specifies the referenced form model that should replace this screen element.
 * The "hostDocumentModelPath" property contains a reference to a group of the underlying document model of this screen
 * elements form model. It is used to bind the included form model elements to their adjusted document model elements.
 * I.e. references from included controls/field are adapted to their relative counterpart in the host document model.
 * References from repeats to groups are adapted accordingly.
 *</p>
 * <p>
 * The inclusion algorithm works as follows:
 * </p>
 * <p>
 * The host form model is traversed and all include screen elements are collected.
 * When finding such an element, the referenced form model is loaded and a replacement result object is stored in a
 * replacement collection.
 * The replacement result objects contain:
 * </p>
 * <ul>
 * <li>All screen elements of the first screen of the referenced form model</li>
 * <li>All field config entries of the referenced form model that are used by above screen elements</li>
 * <li>All group config entries of the referenced form model that are used by above screen elements</li>
 * </ul>
 * <p>
 * After traversing the whole form model, all replacements are put into the host model
 * (as a replacement of their original screen elements).
 * The field & group config entries are merged into the host models field & group config.
 * </p>
 * <p>
 * The replacement screen elements contain the include properties of the original screen element that they replaced.
 * This ensures that included elements can be recognized after include expansion. Furthermore, it allows to re-expand
 * those includes, e.g. to update the elements when the referenced form model was modified.
 * </p>
 * <p>
 * Special care needs to be taken when a single screen element is replaced by multiple screen elements of the referenced
 * form model. This is because all of those "new" screen elements contain the include properties of the original element.
 * When the expansion is again executed on the model, e.g. for an update, these screen elements may not be expanded
 * individually. The expansion must be executed only once on all of them collectively.
 * </p>
 */
public class IncludeExpansion {

	public static void expandIncludes(
		final MeliesModel model,
		final DocumentModelAccess modelAccess,
		final FormModelResolver modelResolver
	) {
		final var replacementMapping = new LinkedHashMap<ScreenElementType, IncludeMapper.IncludeMappingResult>();

		/*
		 * note: the walker implementation does not allow modifications of the form model during the traversal. that's
		 * why the replacements are first collected and then all include elements are replaced afterwards
		 */
		new ModelWalker(new ModelVisitor() {

			private boolean genericVisit(final ScreenElementType screenElement) {
				if (screenElement.getFormModelRef() != null && screenElement.getHostDocumentModelPath() != null) {
					// This block will try to find predecessor screen elements that contain the same include id as the
					// current element.
					// Those sibling screen elements must be the result of a former include expansion that mapped
					// multiple screen elements into the host form model at once.
					// Only the first screen element of those sibling elements shall be expanded again.
					// The following sibling elements will be replaced with nothing which effectively removes them.
					// The first screen element can again expand into multiple screen elements (if the referenced
					// form model still contains multiple screen elements in the first screen).
					if (screenElement.getIncludeId() != null) {
						final var includeId = screenElement.getIncludeId();
						final var predecessorSibling = getPredecessor(screenElement);
						if (predecessorSibling != null && screenElement.getIncludeId().equals(predecessorSibling.getIncludeId())) {
							// the sibling has the same includeId and thus must be the result of the same include expansion
							// that's why the current screen element can be ignored / replaced with nothing
							replacementMapping.put(screenElement, IncludeMapper.IncludeMappingResult.emptyMapping());
							return false;
						}
					}

					final var includedContent =
						new IncludeMapper(modelAccess, modelResolver).expand(screenElement);
					replacementMapping.put(screenElement, includedContent);

					return false;
				}

				return true;
			}

			public boolean visitSection(final SectionType section) {
				return genericVisit(section);
			}

			public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
				return genericVisit(repeat);
			}

			public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
				return genericVisit(repeat);
			}

			public boolean visitControlGrid(final ControlGridType grid) {
				return genericVisit(grid);
			}

			public boolean visitInlineRepeat(final InlineRepeatType repeat) {
				return genericVisit(repeat);
			}

			public boolean visitButtonPanel(final ButtonPanelType panel) {
				return genericVisit(panel);
			}

		}).acceptModel(model);

		replacementMapping.forEach((originalElement, mappedElements) -> {
			final var parentNode = originalElement.getParentNode();

			if (parentNode instanceof ScreenType) {
				final var parentScreen = (ScreenType) parentNode;
				final var insertIndex = parentScreen.getScreenElements().indexOf(originalElement);
				parentScreen.getScreenElements().remove(insertIndex);

				mappedElements.elements.forEach(element -> element.getParentScreen()
																  .getScreenElements()
																  .remove(element));
				parentScreen.getScreenElements().addAll(insertIndex, mappedElements.elements);

			} else if (parentNode instanceof SectionType) {
				final var parentSection = (SectionType) parentNode;
				final var insertIndex = parentSection.getScreenElement().indexOf(originalElement);
				parentSection.getScreenElement().remove(insertIndex);

				mappedElements.elements.forEach(element -> element.getParentScreen()
																  .getScreenElements()
																  .remove(element));
				parentSection.getScreenElement().addAll(insertIndex, mappedElements.elements);
			} else if (parentNode instanceof EmbeddedRepeatType) {
				if (mappedElements.elements.size() == 1
					&& mappedElements.elements.get(0) instanceof ControlGridType) {
					final var parentEmbeddedRepeat = (EmbeddedRepeatType) parentNode;
					parentEmbeddedRepeat.setControlGrid((ControlGridType) mappedElements.elements.get(0));
				} else {
					throw new RuntimeException(String.format(
						"Cannot replace control grid in embedded repeat with anything other than a single control grid!\nThe first replacement element is of type '%s' and there are '%s' element(s) in total.",
						parentNode.getClass().getSimpleName(),
						mappedElements.elements.size()
					));
				}
			} else {
				throw new RuntimeException(String.format(
					"Include element has unexpected parent of type '%s'",
					parentNode.getClass().getSimpleName()
				));
			}

			mappedElements.fieldEntries.forEach(entry -> addFieldConfigEntry(model, entry));
			mappedElements.groupEntries.forEach(entry -> addGroupConfigEntry(model, entry));
		});
	}

	private static ScreenElementType getPredecessor(final ScreenElementType screenElement) {
		final var parentNode = screenElement.getParentNode();

		if (parentNode instanceof ScreenType) {
			final var elementIdx = ((ScreenType) parentNode).getScreenElements().indexOf(screenElement);
			return elementIdx > 0 ? ((ScreenType) parentNode).getScreenElements().get(elementIdx - 1) : null;
		} else if (parentNode instanceof SectionType) {
			final var elementIdx = ((SectionType) parentNode).getScreenElement().indexOf(screenElement);
			return elementIdx > 0 ? ((SectionType) parentNode).getScreenElement().get(elementIdx - 1) : null;
		}
		return null;
	}

	private static void addFieldConfigEntry(final MeliesModel model, final FieldConfigurationEntryType entry) {
		final var existingEntry =
			MeliesModelUtil.getFieldConfiguration(model.getContent().getFieldConfiguration(), entry.getElementRef());

		if (existingEntry == null) {
			model.getContent().getFieldConfiguration().getField().add(entry);
		} else {
			mergeFieldConfigEntries(existingEntry, entry);
		}
	}

	private static void mergeFieldConfigEntries(
		final FieldConfigurationEntryType existing,
		final FieldConfigurationEntryType added
	) {
		if (!existing.isAnnotationSet()) {
			existing.withAnnotation(added.getAnnotations());
		}
		if (!existing.isAttachmentConfigSet()) {
			existing.setAttachmentConfig(added.getAttachmentConfig());
		}
		if (!existing.isSuffixSet()) {
			existing.setSuffix(added.getSuffix());
		}
		if (!existing.isLabelSet()) {
			existing.setLabel(added.getLabel());
		}
		if (!existing.isHintSet()) {
			existing.setHint(added.getHint());
		}
		if (!existing.isInitialValueSet()) {
			existing.setInitialValue(added.getInitialValue());
		}
		if (!existing.isExpositionSet()) {
			existing.setExposition(added.getExposition());
		}
		if (!existing.isReadonlySet()) {
			existing.setReadonly(added.getReadonly());
		}
		if (!existing.isSecretSet()) {
			existing.setSecret(added.getSecret());
		}
		if (!existing.isPlaceholderSet()) {
			existing.setPlaceholder(added.getPlaceholder());
		}
		if (!existing.isDependentEnumerationSet()) {
			existing.setDependentEnumeration(added.getDependentEnumeration());
		}
		if (!existing.isExternalEnumerationSet()) {
			existing.setExternalEnumeration(added.getExternalEnumeration());
		}
		if (!existing.isDependentFieldSet()) {
			existing.setDependentField(added.getDependentField());
		}
		if (!existing.isEnableSelectAllSet()) {
			existing.setEnableSelectAll(added.getEnableSelectAll());
		}
	}

	private static void addGroupConfigEntry(final MeliesModel model, final GroupConfigurationEntryType entry) {
		final var existingEntry =
			MeliesModelUtil.getGroupConfiguration(model.getContent().getGroupConfiguration(), entry.getGroupRef());

		if (existingEntry == null) {
			model.getContent().getGroupConfiguration().getGroup().add(entry);
		} else {
			mergeGroupConfigEntries(existingEntry, entry);
		}
	}

	private static void mergeGroupConfigEntries(
		final GroupConfigurationEntryType existing,
		final GroupConfigurationEntryType added
	) {
		if (!existing.isAnnotationSet()) {
			existing.withAnnotation(added.getAnnotations());
		}
		if (!existing.isDependentGroupSet()) {
			existing.setDependentGroup(added.getDependentGroup());
		}
		if (!existing.isNumberOfInitialRowsSet()) {
			existing.setNumberOfInitialRows(added.getNumberOfInitialRows());
		}
	}
}
