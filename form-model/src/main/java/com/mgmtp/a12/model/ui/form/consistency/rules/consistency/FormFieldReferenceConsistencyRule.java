// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;

import java.util.ArrayList;
import java.util.List;

public class FormFieldReferenceConsistencyRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problems = new ArrayList<>();
		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);
		final FieldInFieldChecker fieldInFieldChecker = new FieldInFieldChecker(model, documentModelService);
		final DependentFieldChecker dependentFieldChecker = new DependentFieldChecker(model, documentModelService);
		final DependentEnumerationChecker dependentEnumerationChecker =
			new DependentEnumerationChecker(model, documentModelService);
		final CrossDependencyChecker dependentChecker = new CrossDependencyChecker(model, documentModelService);

		// collect all problems from field configuration
		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();
		for (final FieldConfigurationEntryType fieldConfigurationEntry : fieldConfiguration.getField()) {
			problems.addAll(fieldInFieldChecker.checkFieldInFieldConfiguration(fieldConfigurationEntry));
			problems.addAll(dependentFieldChecker.checkDependentField(fieldConfigurationEntry));
			problems.addAll(dependentEnumerationChecker.checkDependentEnumeration(fieldConfigurationEntry));
		}
		problems.addAll(dependentChecker.checkDependentEnumerationAndDependentField(fieldConfiguration));

		return problems;
	}

}
