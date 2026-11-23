// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import java.util.List;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.StyleType;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;

/**
 * Check styles usage in the rules definition. Styles are defined in meta-data section.
 */
public class FormCheckStylesRule implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final List<StyleType> definedStyles = model.getContent().getStyles();
		final StyleChecker styleChecker = new StyleChecker(model.getHeaderId(), definedStyles);
		final StylesModelVisitor visitor = new StylesModelVisitor(styleChecker);
		new ModelWalker(visitor).acceptModel(model);

		return styleChecker.getStyleProblems();
	}
}
