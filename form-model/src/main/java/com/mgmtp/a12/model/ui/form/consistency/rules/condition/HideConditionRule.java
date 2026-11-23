// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.condition;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

import java.util.ArrayList;
import java.util.List;

/**
 * Rule that checks following aspects of hide conditions in Form Model elements:
 * <ul>
 *     <li>Whether the referenced master field exists in the associated Document Model.</li>
 *     <li>Whether the master field is of type enumeration, boolean or confirm.</li>
 *     <li>Whether the master values specified in the hide conditions are valid values for the master field.</li>
 *	   <li>Whether there is at least one case specified in the hide conditions.</li>
       <li>Whether the hide condition master and the conditionally hidden element have a valid granularity relationship.</li>
 * </ul>
 */
public class HideConditionRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problems = new ArrayList<>();
		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);
		final HideConditionChecker hideConditionChecker = new HideConditionChecker(model, documentModelService);
		final HideConditionVisitor hideConditionVisitor = new HideConditionVisitor(hideConditionChecker);

		new ModelWalker(hideConditionVisitor).acceptScreenGroupRootElement(model.getContent().getScreens());

		problems.addAll(hideConditionChecker.getProblems());

		return problems;
	}

}
