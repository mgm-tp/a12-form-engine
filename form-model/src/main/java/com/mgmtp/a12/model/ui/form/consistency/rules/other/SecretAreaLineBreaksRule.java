// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.melies.model.types.FieldBasedInput;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.notification.Severity;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * For a string control secret cannot be selected, when the exposition is "area" or for the underlying document model
 * string field line breaks are permitted.
 */
public class SecretAreaLineBreaksRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	private static Problem problem(
		final MeliesModel model, final FieldBasedInput fieldBasedInput,
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
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problemCollection = new ArrayList<>();

		final ModelWalker walker = new ModelWalker(new AreaOrLineBreaksSecretDetectionVisitor(
			model,
			problemCollection,
			createDocumentModelService(model, problemCollection)));

		walker.acceptScreenGroupRootElement(model.getContent().getScreens());

		return problemCollection;
	}

	private static class AreaOrLineBreaksSecretDetectionVisitor extends ModelVisitor {

		final List<Problem> problems;
		private final MeliesModel model;
		private final DocumentModelAccess documentModelService;

		AreaOrLineBreaksSecretDetectionVisitor(
			final MeliesModel model,
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
