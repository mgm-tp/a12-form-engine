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

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.DependentFieldCaseType;
import com.mgmtp.a12.melies.model.types.DependentFieldType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.notification.Severity;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DependentFieldTypeCompatibilityRule extends AbstractRuleWithDocumentModelService<MeliesModel>
	implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problems = new ArrayList<>();
		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);

		checkDependencies(
			model.getHeaderId(),
			model.getContent().getFieldConfiguration().getField(),
			documentModelService,
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
