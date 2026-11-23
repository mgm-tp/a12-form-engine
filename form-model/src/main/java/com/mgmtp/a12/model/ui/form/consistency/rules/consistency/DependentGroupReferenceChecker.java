// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import java.util.ArrayList;
import java.util.List;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.DependentGroupType;
import com.mgmtp.a12.melies.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;

public class DependentGroupReferenceChecker extends AbstractReferenceChecker {

	public DependentGroupReferenceChecker(
		final MeliesModel meliesModel,
		final DocumentModelAccess documentModelService) {
		super(meliesModel, documentModelService);
	}

	/**
	 * Check case of dependent group, if master field exists and if its type is enum/boolean
	 *
	 * @param groupConfiguration
	 * @return
	 */
	List<Problem> checkDependentGroup(final GroupConfigurationEntryType groupConfiguration) {
		final List<Problem> problems = new ArrayList<>();
		final DependentGroupType dependentGroup = groupConfiguration.getDependentGroup();
		if (dependentGroup != null) {
			problems.addAll(checkPicusFieldInDependentType(
				dependentGroup.getMasterField(),
				true,
				FormModelCategory.PICUS_MISSING_FIELD_IN_DEPENDENT_GROUP_MASTER
			));
		}
		return problems;
	}

}
