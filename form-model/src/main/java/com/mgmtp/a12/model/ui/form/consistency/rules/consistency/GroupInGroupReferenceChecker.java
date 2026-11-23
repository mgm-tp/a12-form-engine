// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class GroupInGroupReferenceChecker extends AbstractReferenceChecker {

	GroupInGroupReferenceChecker(final MeliesModel meliesModel, final DocumentModelAccess documentModelService) {
		super(meliesModel, documentModelService);
	}

	List<Problem> checkGroupInGroupConfiguration(final GroupConfigurationEntryType groupConfigurationEntry) {
		final List<Problem> problems = new ArrayList<>();
		final String groupRef = groupConfigurationEntry.getGroupRef();
		final Optional<IGroup> group = documentModelService.findGroupById(groupRef);
		if (!group.isPresent()) {
			problems.add(new ConsistencyProblem(
				meliesModel.getHeaderId(),
				FormModelCategory.PICUS_MISSING_GROUP_IN_GROUP_CONFIGURATION,
				new FormModelProblemSource(groupRef),
				groupRef,
				documentModelService.getDocumentModelId()
			));
		}
		return problems;
	}
}
