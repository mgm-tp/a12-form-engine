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
import java.util.List;
import java.util.Optional;

/**
 * For a string control or string based fieldOverviewColumn autoExpand is only allowed, when the exposition is "area".
 */
public class AutoExpandAreaRule implements ConsistencyRule {

	private static Problem problem(final FormModel model, final String id, final String fieldName) {
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
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problemCollection = new ArrayList<>();

		final ModelWalker walker = new ModelWalker(new AutoExpandNotAreaDetectionVisitor(
			model,
			problemCollection,
			documentModelAccess
		));

		walker.acceptScreenGroupRootElement(model.getContent().getScreens());

		return problemCollection;
	}

	private static class AutoExpandNotAreaDetectionVisitor extends ModelVisitor {

		final List<Problem> problems;
		private final FormModel model;
		private final DocumentModelAccess documentModelService;

		AutoExpandNotAreaDetectionVisitor(
                final FormModel model, final List<Problem> problems, final DocumentModelAccess documentModelService
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
