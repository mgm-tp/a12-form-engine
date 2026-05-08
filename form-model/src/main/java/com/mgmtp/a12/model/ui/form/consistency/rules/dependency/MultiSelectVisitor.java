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
package com.mgmtp.a12.model.ui.form.consistency.rules.dependency;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelHelper;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.List;

class MultiSelectVisitor extends ModelVisitor {

	private final String modelId;
	private final FieldConfigurationType fieldConfiguration;
	private final List<Problem> problems = new ArrayList<Problem>();
	private final DocumentModelAccess documentModelService;

	MultiSelectVisitor(
		final String modelId,
		final FieldConfigurationType fieldConfiguration,
		final DocumentModelAccess documentModelService
	) {
		this.modelId = modelId;
		this.fieldConfiguration = fieldConfiguration;
		this.documentModelService = documentModelService;
	}

	@Override
	public boolean visitControl(final ControlType control) {
		final String ref = control.getElementRef();
		final IElement element = documentModelService.findElementById(ref).orElse(null);

		checkElement(control.getId(), element);
		return true;
	}

	@Override
	public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {

		if (repeatColumn instanceof FieldBasedRepeatOverviewColumnType) {
			final String ref = ((FieldBasedRepeatOverviewColumnType) repeatColumn).getElementRef();
			final IElement element = documentModelService.findElementById(ref).orElse(null);

			checkElement(repeatColumn.getId(), element);
		}

		return true;
	}

	List<Problem> getProblems() {
		return problems;
	}

	private void checkElement(final String formModelElementRef, final IElement element) {
		if (DocumentModelHelper.isMultiSelectGroup(element)) {

			final IField valueField = DocumentModelHelper.getMultiSelectGroupField((IGroup) element);
			final boolean isStringField = valueField.getEffectiveType().orElse(null) instanceof IStringType;

			if (isStringField && !hasExternalEnumerationAssigned(valueField)) {
				problems.add(
					new ConsistencyProblem(
						modelId,
						FormModelCategory.FORM_MODEL_STRING_VALUE_MULTI_SELECT_NO_EXTERNAL_ENUM_SET,
						new FormModelProblemSource(formModelElementRef),
						formModelElementRef,
						element.getId(),
						element.getName()
					)
				);
			}
		}
	}

	private boolean hasExternalEnumerationAssigned(final IField field) {
		return fieldConfiguration.getField()
			.stream()
			.filter(fieldConfigurationEntry -> fieldConfigurationEntry
				.getElementRef()
				.equals(field.getId()) && fieldConfigurationEntry.isExternalEnumerationSet())
			.findAny()
			.isPresent();
	}
}
