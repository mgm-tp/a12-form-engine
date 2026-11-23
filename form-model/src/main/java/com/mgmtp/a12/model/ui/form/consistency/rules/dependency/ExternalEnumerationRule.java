// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.dependency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

import java.util.ArrayList;
import java.util.List;

public class ExternalEnumerationRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {

		final List<Problem> externalEnumerationProblems = new ArrayList<>();

		externalEnumerationProblems.addAll(checkAllowCustomValues(model));
		externalEnumerationProblems.addAll(checkCaseSensitive(model));
		externalEnumerationProblems.addAll(checkStringValueMultiSelects(model));

		return externalEnumerationProblems;
	}

	private List<Problem> checkAllowCustomValues(final MeliesModel model) {

		final InvalidAllowCustomValuesChecker invalidAllowCustomValuesChecker =
			new InvalidAllowCustomValuesChecker(model.getHeaderId());
		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();

		return new ArrayList<>(invalidAllowCustomValuesChecker.check(fieldConfiguration));
	}

	private List<Problem> checkCaseSensitive(final MeliesModel model) {
		final InvalidCaseSensitiveChecker invalidCaseSensitiveChecker =
			new InvalidCaseSensitiveChecker(model.getHeaderId());
		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();

		return new ArrayList<>(invalidCaseSensitiveChecker.check(fieldConfiguration));
	}

	private List<Problem> checkStringValueMultiSelects(final MeliesModel model) {

		final List<Problem> problems = new ArrayList<>();
		final MultiSelectVisitor visitor =
			new MultiSelectVisitor(
				model.getHeaderId(),
				model.getContent().getFieldConfiguration(),
				createDocumentModelService(model, problems)
			);
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());
		problems.addAll(visitor.getProblems());

		return problems;
	}
}
