// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import java.util.ArrayList;
import java.util.List;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.GroupConfigurationType;
import com.mgmtp.a12.model.consistency.Problem;

public class FormGroupReferenceRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final List<Problem> problems = new ArrayList<>();
		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);
		final DependentGroupReferenceChecker dependentGroupReferenceChecker =
			new DependentGroupReferenceChecker(model, documentModelService);
		final GroupInGroupReferenceChecker groupInGroupReferenceChecker =
			new GroupInGroupReferenceChecker(model, documentModelService);

		// collect all problems from group configuration
		final GroupConfigurationType groupConfiguration = model.getContent().getGroupConfiguration();
		for (final GroupConfigurationEntryType groupConfigurationEntry : groupConfiguration.getGroup()) {
			problems.addAll(groupInGroupReferenceChecker.checkGroupInGroupConfiguration(groupConfigurationEntry));
			problems.addAll(dependentGroupReferenceChecker.checkDependentGroup(groupConfigurationEntry));
		}
		return problems;
	}

}
