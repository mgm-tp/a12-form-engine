// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import java.util.ArrayList;
import java.util.List;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;

public class LabelConsistencyRule extends AbstractRuleWithDocumentModelService<MeliesModel> {
	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final LabelConsistencyChecker checker = new LabelConsistencyChecker(model.getHeaderId());
		List<Problem> problems = new ArrayList<>();
		final DocumentModelAccess documentModelAccess = createDocumentModelService(model, problems);
		final LabelModelVisitor visitor = new LabelModelVisitor(model, documentModelAccess, checker);
		new ModelWalker(visitor).acceptModel(model);

		problems.addAll(checker.getProblems());

		return problems;
	}
}
