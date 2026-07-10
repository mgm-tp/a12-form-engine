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
package com.mgmtp.a12.formengine.consistency.rules.dependency;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.notification.Severity;

import com.mgmtp.a12.kernel.md.model.api.IField;

import com.mgmtp.a12.formengine.consistency.ConsistencyValidationException;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.DependentFieldCaseType;
import com.mgmtp.a12.formengine.model.types.DependentFieldType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

public class DependentFieldTypeCompatibilityRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problems = new ArrayList<>();

		checkDependencies(
			model.getHeaderId(),
			model.getContent().getFieldConfiguration().getField(),
			documentModelAccess,
			problems
		);

		return problems;
	}

	private void checkDependencies(
		final String modelName,
		final List<FieldConfigurationEntryType> fieldConfigEntries,
		final DocumentModelAccess documentModelService,
		final List<Problem> problems
	) {
		fieldConfigEntries.forEach(entry -> {
			final DependentFieldType dependentField = entry.getDependentField();
			if (dependentField != null && dependentField.isCaseSet()) {
				final List<DependentFieldCaseType> cases = dependentField.getCase();
				cases.forEach(caze -> {
					if (StringUtils.isNotBlank(caze.getFieldRef())) {
						final Optional<IField> entryField = documentModelService.findFieldById(entry.getElementRef());
						final Optional<IField> caseField = documentModelService.findFieldById(caze.getFieldRef());
						if (!caseField.isPresent() || !entryField.isPresent()) {
							// FormFieldReferenceConsistencyRule covers this case
							return;
						}
						if (areTypesIncompatible(entryField.get(), caseField.get())) {
							problems.add(new ConsistencyProblem(
								modelName,
								FormModelCategory.FORM_MODEL_DEPENDENT_FIELD_CASE_INCOMPATIBLE_FIELDTYPE,
								new FormModelProblemSource(entry.getElementRef()),
								Severity.INFO,
								entry.getElementRef(),
								entryField.get().getName(),
								caze.getFieldRef(),
								caseField.get().getName(),
								caze.getMasterValue()
							));
						}
					}
				});
			}
		});
	}

	private boolean areTypesIncompatible(final IField entryField, final IField caseField) {
		return !entryField.getEffectiveType().get().getClass().equals(caseField.getEffectiveType().get().getClass());
	}
}
