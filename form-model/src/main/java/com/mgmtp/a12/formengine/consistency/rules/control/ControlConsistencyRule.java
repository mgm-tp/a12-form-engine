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
package com.mgmtp.a12.formengine.consistency.rules.control;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ICustomFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ITypeDefType;

import com.mgmtp.a12.formengine.consistency.ElementReferenceFinder;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.Granularity;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ControlIndexEnumType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Optional;

public class ControlConsistencyRule implements ConsistencyRule {
	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) {
		final List<Problem> problems = new ArrayList<>();

		final ControlConsistencyChecker checker = new ControlConsistencyChecker(documentModelAccess, model);
		new ModelWalker(checker).acceptScreenGroupRootElement(model.getContent().getScreens());
		problems.addAll(checker.getProblems());

		return problems;
	}

	private static class ControlConsistencyChecker extends ModelVisitor {
		private final List<Problem> problems = new ArrayList<>();

		private final DocumentModelAccess documentModelService;
		private final ElementReferenceFinder elementReferenceFinder;
		private final FormModel model;

		private final Deque<RepeatType> enteredRepeats = new ArrayDeque<>();

		ControlConsistencyChecker(final DocumentModelAccess documentModelService, final FormModel model) {
			this.documentModelService = documentModelService;
			this.elementReferenceFinder = new ElementReferenceFinder(documentModelService);
			this.model = model;
		}

		@Override
		public boolean visitControl(ControlType control) {
			final String elementRef = control.getElementRef();

			if (!(
				elementReferenceFinder.isField(elementRef)
					|| elementReferenceFinder.isSupportedCustomType(elementRef)
			)) {
				problems.add(new ConsistencyProblem(
					model.getHeader().getId(),
					FormModelCategory.FORM_MODEL_UNKNOWN_ELEMENTREF,
					new FormModelProblemSource(control.getId()),
					control.getId(),
					"control",
					elementRef
				));
				return super.visitControl(control);
			}

			final Optional<IField> field = documentModelService.findFieldById(elementRef);

			if (field.isPresent()) {
				final IFieldType effectiveDataType = field.get().getEffectiveType().orElse(null);
				checkAutoCompleteOnControls(control, field.get(), effectiveDataType);
			}

			documentModelService.findElementById(elementRef).ifPresent(element -> {
				Granularity controlGranularity = Granularity.computeGranularity(element);

				if (enteredRepeats.size() == 0) {
					checkGranularityControlInRootContext(control, element, controlGranularity);
					checkControlIndex(control, controlGranularity, new Granularity(new ArrayList<>()));
				} else {
					RepeatType repeat = enteredRepeats.getFirst();
					documentModelService.findGroupById(repeat.getGroupRef()).ifPresent(group -> {
						Granularity repeatGranularity = Granularity.computeGranularity(group);

						checkGranularityControlInRepeatContext(
							control,
							element,
							controlGranularity,
							repeat,
							repeatGranularity);
						checkControlIndex(control, controlGranularity, repeatGranularity);
					});
				}
			});

			return super.visitControl(control);
		}

		@Override
		public void enter(final Object obj) {
			if (obj instanceof RepeatType) {
				enteredRepeats.push((RepeatType) obj);
			}
		}

		@Override
		public void leave(final Object obj) {
			if (obj instanceof RepeatType) {
				enteredRepeats.pop();
			}
		}

		public List<Problem> getProblems() {
			return problems;
		}

		private boolean checkAutoCompleteOnControls(
			final ControlType control,
			final IField field,
			final IFieldType dataType) {
			final String fieldName = field.getName();

			if (!(dataType instanceof IStringType) && !(dataType instanceof ITypeDefType) && !(dataType instanceof ICustomFieldType) && control.isAutoCompleteSet()) {
				problems.add(new ConsistencyProblem(
					model.getHeader().getId(),
					FormModelCategory.FORM_MODEL_AUTOCOMPLETE_ONLY_ALLOWED_FOR_STRING_FIELDS,
					new FormModelProblemSource(control.getId()),
					fieldName,
					control.getId(),
					control.getElementRef()
				));
			}
			return super.visitControl(control);
		}

		private void checkGranularityControlInRootContext(
			final ControlType control,
			final IElement element,
			final Granularity controlGranularity) {
			if (controlGranularity.getRepeatableGroups().size() > 1) {
				problems.add(new ConsistencyProblem(
					model.getHeader().getId(),
					FormModelCategory.FORM_MODEL_CONTROL_ROOT_CONTEXT_WRONG,
					new FormModelProblemSource(control.getId()),
					control.getId(),
					element.getId(),
					element.getName()
				));
			}
		}

		private void checkGranularityControlInRepeatContext(
			final ControlType control,
			final IElement element,
			final Granularity controlGranularity,
			final RepeatType repeat,
			final Granularity repeatGranularity) {
			if (repeatGranularity.getRelativeDistance(controlGranularity) > 1) {
				problems.add(new ConsistencyProblem(
					model.getHeader().getId(),
					FormModelCategory.FORM_MODEL_CONTROL_REPEAT_CONTEXT_WRONG,
					new FormModelProblemSource(control.getId()),
					repeat.getId(),
					repeat.getName(),
					control.getId(),
					element.getId(),
					element.getName()
				));
			}
		}

		private void checkControlIndex(
			ControlType control,
			Granularity controlGranularity,
			Granularity repeatGranularity) {
			final int granularity = repeatGranularity.getRelativeDistance(controlGranularity);
			if (granularity == 1 && !control.isIndexSet()) {
				problems.add(new ConsistencyProblem(
					model.getHeader().getId(),
					FormModelCategory.FORM_MODEL_CONTROL_INDEX_MISSING,
					new FormModelProblemSource(control.getId()),
					control.getId()
				));
			} else if (granularity < 1 && control.isIndexSet()) {
				problems.add(new ConsistencyProblem(
					model.getHeader().getId(),
					FormModelCategory.FORM_MODEL_CONTROL_INDEX_EXISTS,
					new FormModelProblemSource(control.getId()),
					control.getId()
				));
			} else if (granularity == 1 && control.isIndexSet()) {
				if (control.getIndex().getType() == ControlIndexEnumType.NUMERIC) {
					try {
						Integer.parseInt(control.getIndex().getValue());
					} catch (Exception e) {
						problems.add(new ConsistencyProblem(
							model.getHeader().getId(),
							FormModelCategory.FORM_MODEL_CONTROL_INDEX_NUMERIC_VALUE_NOT_INT,
							new FormModelProblemSource(control.getId()),
							control.getId()
						));
					}
				} else if (control.getIndex().getType() == ControlIndexEnumType.SEMANTIC) {
					final Optional<IElement> element = documentModelService.findElementById(control.getElementRef());
					if (element.isPresent()) {
						IGroup group = element.get().getParent();
						while (group != null && group.getRepeatability() == 1) {
							group = group.getParent();
						}
						if (group != null && !group.getIndexField().isPresent()) {
							problems.add(new ConsistencyProblem(
								model.getHeader().getId(),
								FormModelCategory.FORM_MODEL_CONTROL_INDEX_SEMANTIC_VALUE_NO_INDEX_FIELD,
								new FormModelProblemSource(control.getId()),
								control.getId(),
								group.getId(),
								group.getName()
							));
						}
					}
				}
			}
		}
	}
}
