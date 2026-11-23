// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.ExpositionPresentationEnumType;
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
 * For a string control or string based fieldOverviewColumn autoExpand is only allowed, when the exposition is "area".
 */
public class AutoExpandAreaRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	private static Problem problem(final MeliesModel model, final String id, final String fieldName) {
		return new ConsistencyProblem(
			model.getHeaderId(),
			FormModelCategory.FORM_MODEL_AUTO_EXPAND_INVALID,
			new FormModelProblemSource(id),
			Severity.INFO,
			id,
			fieldName
		);
	}

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problemCollection = new ArrayList<>();

		final ModelWalker walker = new ModelWalker(new AutoExpandNotAreaDetectionVisitor(
			model,
			problemCollection,
			createDocumentModelService(model, problemCollection)
		));

		walker.acceptScreenGroupRootElement(model.getContent().getScreens());

		return problemCollection;
	}

	private static class AutoExpandNotAreaDetectionVisitor extends ModelVisitor {

		final List<Problem> problems;
		private final MeliesModel model;
		private final DocumentModelAccess documentModelService;

		AutoExpandNotAreaDetectionVisitor(
			final MeliesModel model, final List<Problem> problems, final DocumentModelAccess documentModelService
		) {
			this.model = model;
			this.problems = problems;
			this.documentModelService = documentModelService;
		}

		@Override
		public boolean visitControl(final ControlType control) {
			if (control.isAutoExpandSet()) {
				checkControl(control);
			}
			return true;
		}

		@Override
		public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {
			if (repeatColumn instanceof FieldBasedRepeatOverviewColumnType) {
				if (((FieldBasedRepeatOverviewColumnType) repeatColumn).isAutoExpandSet()) {
					checkColumn((FieldBasedRepeatOverviewColumnType) repeatColumn);
				}
			}
			return true;
		}

		private void checkControl(final ControlType control) {
			check(control.getElementRef(), control.getExposition(), control.getId());
		}

		private void checkColumn(final FieldBasedRepeatOverviewColumnType column) {
			check(column.getElementRef(), null, column.getId());
		}

		private void check(final String elementRef, final ExpositionPresentationEnumType exposition, final String id) {
			if (isAutoExpandInvalid(elementRef, exposition)) {
				final Optional<IElement> element = documentModelService.findElementById(elementRef);
				final String elementName = element.map(IElement::getName).orElse("");
				problems.add(problem(model, id, elementName));
			}
		}

		private boolean isAutoExpandInvalid(final String elementRef, final ExpositionPresentationEnumType exposition) {
			return isNotExpositionArea(elementRef, exposition);
		}

		private boolean isNotExpositionArea(final String elementRef, final ExpositionPresentationEnumType exposition) {
			final List<FieldConfigurationEntryType> fieldConfigEntries =
				model.getContent().getFieldConfiguration().getField();

			boolean isFieldConfigExpositionArea = false;
			boolean isElementExpositionArea = false;

			for (final FieldConfigurationEntryType entry : fieldConfigEntries) {
				if (entry.getElementRef().equals(elementRef)) {
					if (ExpositionPresentationEnumType.AREA.equals(entry.getExposition())) {
						isFieldConfigExpositionArea = true;
					}
				}
			}

			if (ExpositionPresentationEnumType.AREA.equals(exposition)) {
				isElementExpositionArea = true;
			}

			return !isFieldConfigExpositionArea && !isElementExpositionArea;
		}
	}
}
