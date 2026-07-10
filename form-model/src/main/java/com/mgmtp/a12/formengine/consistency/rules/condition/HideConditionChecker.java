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
package com.mgmtp.a12.formengine.consistency.rules.condition;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IBooleanType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IConfirmType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType.IEnumValue;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;

import com.mgmtp.a12.formengine.consistency.DocumentModelHelper;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.Granularity;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ControlGridNode;
import com.mgmtp.a12.formengine.model.types.ExpressionRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.FieldBasedInput;
import com.mgmtp.a12.formengine.model.types.HideConditionCaseType;
import com.mgmtp.a12.formengine.model.types.HideConditionType;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.types.ScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenType;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public class HideConditionChecker {

	final FormModel formModel;
	final DocumentModelAccess documentModelService;
	final List<Problem> problems;

	public HideConditionChecker(final FormModel formModel, final DocumentModelAccess documentModelAccess) {
		this.formModel = formModel;
		this.documentModelService = documentModelAccess;
		this.problems = new ArrayList<>();
	}

	protected void checkCondition(
		final HideConditionType condition,
		final String elementName,
		final String elementId,
		final Object element) {
		final String fieldRef = condition.getMasterField();

		// It is not a 'consistency' problem, when no master field is set at all
		if (fieldRef == null || fieldRef.isEmpty()) {
			return;
		}

		// Check if referenced master field exists

		final Optional<IField> foundFieldOptional = documentModelService.findFieldById(fieldRef);
		if (foundFieldOptional.isEmpty()) {
			problems.add(new ConsistencyProblem(
				formModel.getHeaderId(),
				FormModelCategory.MISSING_DM_FIELD_IN_HIDE_CONDITION_MASTER,
				new FormModelProblemSource(elementId),
				fieldRef,
				elementName,
				this.documentModelService.getDocumentModelId()));
			return;
		}

		// Check if referenced master field has valid type

		final IField foundField = foundFieldOptional.get();
		final IFieldType effectiveDataType = foundField.getEffectiveType().orElse(null);
		if (!isValidDataType(effectiveDataType)) {
			final String
				fieldTypeString =
				effectiveDataType != null ? DocumentModelHelper.getFieldTypeString(effectiveDataType) : "null";

			problems.add(new ConsistencyProblem(
				formModel.getHeaderId(),
				FormModelCategory.HIDE_CONDITION_MASTER_FIELD_INVALID_TYPE,
				new FormModelProblemSource(elementId),
				fieldRef,
				elementName,
				this.documentModelService.getDocumentModelId(),
				fieldTypeString));
		}

		// Check if only existing master values are used

		if (condition.isCasesSet() && isValidDataType(effectiveDataType)) {
			final Set<String> validValues = getValidValuesForFieldType(effectiveDataType);

			for (final HideConditionCaseType caseType : condition.getCases()) {
				final String masterValue = caseType.getMasterValue();
				if (masterValue != null && !validValues.contains(masterValue)) {
					problems.add(new ConsistencyProblem(
						formModel.getHeaderId(),
						FormModelCategory.HIDE_CONDITION_INVALID_MASTER_VALUE,
						new FormModelProblemSource(elementId),
						elementName,
						fieldRef,
						this.documentModelService.getDocumentModelId(),
						masterValue));
				}
			}
		}

		// Check that at least one case is defined

		if (!condition.isCasesSet()) {
			problems.add(new ConsistencyProblem(
				formModel.getHeaderId(),
				FormModelCategory.FORM_MODEL_HIDE_CONDITION_NO_CASES,
				new FormModelProblemSource(elementId),
				elementName));
		}

		// Check that the master field granularity is contained in the granularity of the
		// corresponding dm group of the element with the hide condition

		final String rootGroupId = documentModelService.getDocumentModel().getContent().getDocumentModelRoot().getId();
		if (!isMasterFieldGranularityValid(fieldRef, element, rootGroupId)) {
			problems.add(new ConsistencyProblem(
				formModel.getHeaderId(),
				FormModelCategory.FORM_MODEL_HIDE_CONDITION_INVALID_MASTER_FIELD_GRANULARITY,
				new FormModelProblemSource(elementId),
				elementName,
				fieldRef,
				this.documentModelService.getDocumentModelId()));
		}

	}

	private boolean isValidDataType(final IFieldType fieldType) {
		return fieldType instanceof IEnumerationType
			|| fieldType instanceof IBooleanType
			|| fieldType instanceof IConfirmType;
	}

	private Set<String> getValidValuesForFieldType(final IFieldType fieldType) {
		final Set<String> validValues = new HashSet<>();

		if (fieldType instanceof IEnumerationType enumerationType) {
			for (final IEnumValue enumValue : enumerationType.getValues()) {
				validValues.add(enumValue.getValue());
			}
		} else if (fieldType instanceof IBooleanType) {
			validValues.add("true");
			validValues.add("false");
		} else if (fieldType instanceof IConfirmType) {
			validValues.add("true");
		}

		return validValues;
	}

	private boolean isMasterFieldGranularityValid(
		final String masterFieldRef,
		final Object element,
		final String rootGroupId
	) {

		final Optional<IField> masterFieldOptional = documentModelService.findFieldById(masterFieldRef);
		if (masterFieldOptional.isEmpty()) {
			return true;
		}

		final String correspondingElementId = resolveCorrespondingDocumentModelElementId(element, rootGroupId);
		if (correspondingElementId == null) {
			return true;
		}

		final IElement masterField = masterFieldOptional.get();
		final Granularity masterFieldGranularity = Granularity.computeGranularity(masterField);

		Granularity correspondingElementGranularity = new Granularity(new ArrayList<>());
		if (!correspondingElementId.equals(rootGroupId)) {
			final Optional<IElement> correspondingElementOptional = documentModelService.findElementById(correspondingElementId);
			if (correspondingElementOptional.isEmpty()) {
				return true;
			}
			final IElement correspondingElement = correspondingElementOptional.get();
			correspondingElementGranularity = Granularity.computeGranularity(correspondingElement);
		}

		return correspondingElementGranularity.contains(masterFieldGranularity);
	}

	private String resolveCorrespondingDocumentModelElementId(final Object element, final String rootGroupId) {
		if (element instanceof ScreenElementType
			|| element instanceof ControlGridNode
			|| element instanceof ExpressionRepeatOverviewColumnType
		) {
			return resolveClosestRepeatGroupOrRootId(element, rootGroupId);
		} else if (element instanceof FieldBasedInput) {
			return ((FieldBasedInput) element).getElementRef();
		} else {
			return null;
		}
	}

	private String resolveClosestRepeatGroupOrRootId(final Object element, final String rootGroupId) {

		Object closestScreenElement = element;
		if (element instanceof ControlGridNode || element instanceof ExpressionRepeatOverviewColumnType) {
			closestScreenElement = resolveClosestScreenElement(element);
			if (closestScreenElement == null) {
				return null;
			}
		}

		final Object repeatOrRootScreen = recursivelyFindClosestRepeatOrRootScreen(closestScreenElement);
		return switch (repeatOrRootScreen) {
			case null -> null;
			case final ScreenType ignored -> rootGroupId;
			case final RepeatType repeatType -> repeatType.getGroupRef();
			default -> null;
		};
	}

	private Object resolveClosestScreenElement(final Object element) {
		if (element instanceof ControlGridNode) {
			return ((ControlGridNode) element).getParent();
		} else if (element instanceof ExpressionRepeatOverviewColumnType) {
			return ((ExpressionRepeatOverviewColumnType) element).getParent();
		} else {
			return null;
		}
	}

	private Object recursivelyFindClosestRepeatOrRootScreen(final Object element) {
		if (element instanceof ScreenType && ((ScreenType) element).getParentScreenElement() == null || element instanceof RepeatType) {
			return element;
		} else if (element instanceof ScreenElementType) {
			if (((ScreenElementType) element).getParent() != null) {
				return recursivelyFindClosestRepeatOrRootScreen(((ScreenElementType) element).getParent());
			} else {
				// When it's a top-level screen element, parent is null, so go to parent screen directly
				return recursivelyFindClosestRepeatOrRootScreen(((ScreenElementType) element).getParentScreen());
			}
		} else {
			return null;
		}
	}

	protected List<Problem> getProblems() {
		return problems;
	}
}
