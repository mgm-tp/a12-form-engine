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
package com.mgmtp.a12.formengine.consistency.rules.other;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.notification.Severity;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
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
import com.mgmtp.a12.formengine.model.types.FieldBasedInput;
import com.mgmtp.a12.formengine.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * For a string control secret cannot be selected, when the exposition is "area" or for the underlying document model
 * string field line breaks are permitted.
 */
public class SecretAreaLineBreaksRule implements ConsistencyRule {

	private static Problem problem(
            final FormModel model, final FieldBasedInput fieldBasedInput,
            final String fieldName) {

		String id;
		if (fieldBasedInput instanceof ControlType) {
			id = ((ControlType) fieldBasedInput).getId();
		} else {
			id = ((RepeatOverviewColumnType) fieldBasedInput).getId();
		}

		return new ConsistencyProblem(
			model.getHeaderId(),
			FormModelCategory.FORM_MODEL_SECRET_AREA_LINE_BREAKS,
			new FormModelProblemSource(id),
			Severity.INFO,
			id,
			fieldName);
	}

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problemCollection = new ArrayList<>();

		final ModelWalker walker = new ModelWalker(new AreaOrLineBreaksSecretDetectionVisitor(
			model,
			problemCollection,
			documentModelAccess));

		walker.acceptScreenGroupRootElement(model.getContent().getScreens());

		return problemCollection;
	}

	private static class AreaOrLineBreaksSecretDetectionVisitor extends ModelVisitor {

		final List<Problem> problems;
		private final FormModel model;
		private final DocumentModelAccess documentModelService;

		AreaOrLineBreaksSecretDetectionVisitor(
			final FormModel model,
			final List<Problem> problems,
			final DocumentModelAccess documentModelService) {
			this.model = model;
			this.problems = problems;
			this.documentModelService = documentModelService;
		}

		@Override
		public boolean visitControl(final ControlType control) {
			if (control.isSecretSet()) {
				checkSecret(control);
			}
			return true;
		}

		@Override
		public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType column) {
			if (column instanceof FieldBasedRepeatOverviewColumnType) {
				final FieldBasedRepeatOverviewColumnType fieldBasedColumn = (FieldBasedRepeatOverviewColumnType) column;
				if (fieldBasedColumn.isSecretSet()) {
					checkSecret(fieldBasedColumn);
				}
			}

			return true;

		}

		private void checkSecret(final FieldBasedInput fieldBasedInput) {
			if (isSecretInvalid(fieldBasedInput)) {
				final Optional<IElement> element =
					documentModelService.findElementById(fieldBasedInput.getElementRef());
				final String elementName = element.map(IElement::getName).orElse("");
				problems.add(problem(model, fieldBasedInput, elementName));
			}
		}

		private boolean isSecretInvalid(final FieldBasedInput fieldBasedInput) {
			return isExpositionArea(fieldBasedInput) || isLineBreaksPermitted(fieldBasedInput.getElementRef());
		}

		private boolean isExpositionArea(final FieldBasedInput fieldBasedInput) {
			final List<FieldConfigurationEntryType> fieldConfigEntries =
				model.getContent().getFieldConfiguration().getField();

			for (final FieldConfigurationEntryType entry : fieldConfigEntries) {
				if (entry.getElementRef().equals(fieldBasedInput.getElementRef())) {
					if (ExpositionPresentationEnumType.AREA.equals(entry.getExposition())) {
						return true;
					}
				}
			}

			if (fieldBasedInput instanceof ControlType) {
				if (ExpositionPresentationEnumType.AREA.equals(((ControlType) fieldBasedInput).getExposition())) {
					return true;
				}
			}

			return false;
		}

		private boolean isLineBreaksPermitted(final String elementRef) {
			final Optional<IField> field = documentModelService.findFieldById(elementRef);
			if (!field.isPresent()) {
				return false;
			}
			final IFieldType dataType = field.get().getFieldType();
			return dataType instanceof IStringType
				? ((IStringType) dataType).isLineBreaksPermitted()
				: false;
		}
	}
}
