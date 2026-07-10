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
package com.mgmtp.a12.formengine.consistency.rules.exposition;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.IIdNamed;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IBooleanType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IConfirmType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;

import com.mgmtp.a12.formengine.consistency.ConsistencyValidationException;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.formengine.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public class DataTypeExpositionMatchRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problems = new ArrayList<>();

		final ExpositionConsistencyChecker checker = new ExpositionConsistencyChecker(documentModelAccess, model);
		new ModelWalker(checker).acceptModel(model);
		problems.addAll(checker.getProblems());
		return problems;
	}

	private static class ExpositionConsistencyChecker extends ModelVisitor {
		private final List<Problem> problems = new ArrayList<>();
		private final DocumentModelAccess documentModelService;
		private final FormModel model;

		ExpositionConsistencyChecker(final DocumentModelAccess documentModelService, final FormModel model) {
			this.documentModelService = documentModelService;
			this.model = model;
		}

		@Override
		public boolean visitControl(final ControlType control) {
			final String elementRef = control.getElementRef();
			final ExpositionPresentationEnumType exposition = control.getExposition();

			checkExposition(control.getId(), elementRef, exposition, false, model, documentModelService, problems);

			return super.visitControl(control);
		}

		@Override
		public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {
			if (repeatColumn instanceof FieldBasedRepeatOverviewColumnType column) {
				final String elementRef = column.getElementRef();
				final ExpositionPresentationEnumType exposition = column.getExposition();

				checkExposition(
					repeatColumn.getId(),
					elementRef,
					exposition,
					true,
					model,
					documentModelService,
					problems);
			}

			return super.visitRepeatOverviewColumn(repeatColumn);
		}

		@Override
		public boolean visitFieldConfigurationEntry(final FieldConfigurationEntryType fieldConfigurationEntry) {
			final String elementRef = fieldConfigurationEntry.getElementRef();
			final ExpositionPresentationEnumType exposition = fieldConfigurationEntry.getExposition();

			checkExposition(elementRef, elementRef, exposition, false, model, documentModelService, problems);

			return super.visitFieldConfigurationEntry(fieldConfigurationEntry);
		}

		public List<Problem> getProblems() {
			return problems;
		}
	}

	private static void checkExposition(
		final String sourceElementId,
		final String elementRef,
		final ExpositionPresentationEnumType exposition,
		final boolean expositionFromColumn,
		final FormModel model,
		final DocumentModelAccess documentModelService,
		final Collection<Problem> problemCollection
	) {
		if (exposition == null) {
			return;
		}

		final Optional<IElement> elementOptional = documentModelService.findElementById(elementRef);
		final FieldConfigurationEntryType fieldConfigEntry = getFieldConfigurationEntry(model, elementRef);

		if (elementOptional.isEmpty()) {
			// this case is covered in another rule
			return;
		}
		final IElement element = elementOptional.get();

		final IFieldType
			fieldType =
			element instanceof IField ? ((IField) element).getEffectiveType().orElse(null) : null;
		final String usageType = element instanceof IGroup ? ((IGroup) element).getUsageType().orElse("") : null;

		switch (exposition) {
			case CHECKBOX, SWITCH, SWITCH_WITH_VALUES:
				// the element may only be a boolean or a confirm
				if (!(fieldType instanceof IBooleanType || fieldType instanceof IConfirmType)) {
					addProblem(model, problemCollection, sourceElementId, element, exposition, "boolean/confirm");
				}
				break;
			case FULL, INLINE:
				// the element may only be an enumeration, a boolean, a string (in case of external enumerations) or a multi-select
				if (!(
					fieldType instanceof IEnumerationType ||
						fieldType instanceof IBooleanType ||
						(fieldType instanceof IStringType && fieldConfigEntry.isExternalEnumerationSet()) ||
						"multi-select".equals(usageType)
				)) {
					addProblem(
						model,
						problemCollection,
						sourceElementId,
						element,
						exposition,
						"enumeration/boolean/string (with ext. enumeration)/multi-select");
				}
				break;
			case BOOLEAN_SELECT:
				// the element may only be a boolean
				if (!(fieldType instanceof IBooleanType)) {
					addProblem(model, problemCollection, sourceElementId, element, exposition, "boolean");
				}
				break;
			case AUTOCOMPLETE:
				// the element may only be an enumeration, a string (in case of external enumerations) or a multi-select
				if (!(
					fieldType instanceof IEnumerationType ||
						(fieldType instanceof IStringType && fieldConfigEntry.isExternalEnumerationSet()) ||
						"multi-select".equals(usageType)
				)) {
					addProblem(
						model,
						problemCollection,
						sourceElementId,
						element,
						exposition,
						"enumeration/string (with ext. enumeration)/multi-select");
				}
				break;
			case COMPACT:
				// the element may only be an enumeration, string (in case of external enumeration) or an attachment
				if (!(
					fieldType instanceof IEnumerationType ||
						(fieldType instanceof IStringType && fieldConfigEntry.isExternalEnumerationSet()) ||
						"attachment".equals(usageType)
				)) {
					addProblem(
						model,
						problemCollection,
						sourceElementId,
						element,
						exposition,
						"enumeration/string (with ext. enumeration)/attachment");
				}
				break;
			case AREA:
				// the element may only be a string (without external enumeration)
				if (!(fieldType instanceof IStringType && !fieldConfigEntry.isExternalEnumerationSet())) {
					addProblem(model, problemCollection, sourceElementId, element, exposition, "string");
				}
				break;
			case THUMBNAIL_OR_ICON:
				// the element may only be an attachment
				if (!"attachment".equals(usageType)) {
					addProblem(model, problemCollection, sourceElementId, element, exposition, "attachment");
				} else if (!expositionFromColumn) {
					// only allowed for columns
					problemCollection.add(new ConsistencyProblem(
						model.getHeaderId(),
						FormModelCategory.FORM_MODEL_EXPOSITION_ONLY_ALLOWED_FOR_COLUMNS,
						new FormModelProblemSource(sourceElementId),
						element.getId(),
						element.getName(),
						exposition.name()
					));
				}
				break;
		}
	}

	private static void addProblem(
		final FormModel model,
		final Collection<Problem> problemCollection,
		final String sourceElementId,
		final IIdNamed element,
		final ExpositionPresentationEnumType exposition,
		final String dataTypeName
	) {
		problemCollection.add(new ConsistencyProblem(
			model.getHeaderId(),
			FormModelCategory.FORM_MODEL_DATATYPE_EXPOSITION_MISMATCH,
			new FormModelProblemSource(sourceElementId),
			element.getId(),
			element.getName(),
			exposition.name(),
			dataTypeName
		));
	}

	private static FieldConfigurationEntryType getFieldConfigurationEntry(
		final FormModel model,
		final String elementRef) {
		return model
			.getContent()
			.getFieldConfiguration()
			.getField()
			.stream()
			.filter(fce -> elementRef.equals(fce.getElementRef()))
			.findFirst()
			.orElse(null);
	}
}
