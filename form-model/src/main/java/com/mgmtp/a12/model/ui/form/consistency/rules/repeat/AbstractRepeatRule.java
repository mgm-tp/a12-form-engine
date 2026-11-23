// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;
import org.apache.commons.lang3.Validate;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractRepeatRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problems = new ArrayList<>();
		final AbstractRepeatChecker ruleChecker = getRuleChecker(model, problems);
		Validate.notNull(ruleChecker, "Please return checker rule implementation from getRuleChecker(...)");
		final RepeatModelVisitor visitor = new RepeatModelVisitor(ruleChecker);
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());
		problems.addAll(ruleChecker.getRepeatProblems());

		return problems;

	}

	public abstract AbstractRepeatChecker getRuleChecker(MeliesModel model, List<Problem> problems);

}
