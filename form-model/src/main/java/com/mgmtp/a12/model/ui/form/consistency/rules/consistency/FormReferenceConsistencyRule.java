// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import java.util.ArrayList;
import java.util.List;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;

public class FormReferenceConsistencyRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final List<Problem> problems = new ArrayList<>();
		// collect all problems from consistency check melies visitor
		final ConsistencyCheckMeliesVisitor visitor =
			new ConsistencyCheckMeliesVisitor(
				model.getHeaderId(),
				createDocumentModelService(model, problems)
			);
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());
		problems.addAll(visitor.getProblems());

		return problems;
	}

}
