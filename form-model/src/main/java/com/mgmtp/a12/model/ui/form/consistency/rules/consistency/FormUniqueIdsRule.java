// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.visitor.FormModelIdWalker;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class FormUniqueIdsRule implements FormModelConsistencyRule {
	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final List<Problem> problems = new LinkedList<Problem>();
		final Set<String> idSet = new HashSet<>();

		new FormModelIdWalker(elem -> {
			if (!idSet.add(elem.getId())) {
				final Problem problem = new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_DUPLICATE_IDS,
					new FormModelProblemSource(elem.getId()),
					elem.getId()
				);
				problems.add(problem);
			}
		}).accept(model);

		return problems;
	}
}
