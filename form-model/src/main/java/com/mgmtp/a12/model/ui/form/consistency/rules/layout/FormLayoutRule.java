// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;

import java.util.List;

/**
 * Check layout used in rules definition. The layout must match defined number of columns and sum must be 12.
 */
public class FormLayoutRule implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {

		final LayoutChecker layoutChecker = new LayoutChecker(model.getHeaderId());
		final LayoutModelVisitor visitor = new LayoutModelVisitor(layoutChecker);
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());

		return layoutChecker.getLayoutProblems();
	}

}
