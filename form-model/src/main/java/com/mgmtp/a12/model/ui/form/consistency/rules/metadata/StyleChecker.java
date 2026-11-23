// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.types.StyleType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

class StyleChecker {

	private String modelName;

	private List<StyleType> expectedStyles;

	private List<Problem> styleProblems = new LinkedList<Problem>();

	public StyleChecker(final String modelName, final List<StyleType> expectedStyles) {
		this.modelName = modelName;
		this.expectedStyles = expectedStyles;
	}

	public void checkElementStyles(
		final List<StyleType> actualStyles,
		final String checkedElement,
		final String checkedElementId) {
		if (actualStyles == null) {
			return;
		}
		for (final StyleType actualStyle : actualStyles) {
			checkElementStyle(actualStyle, checkedElement, checkedElementId);
		}
	}

	public List<Problem> getStyleProblems() {
		return styleProblems;
	}

	private void checkElementStyle(
		final StyleType actualStyle,
		final String checkedElement,
		final String checkedElementId) {
		if (!expectedStyles.stream().anyMatch(o -> o.getName().equals(actualStyle.getName()))) {
			final List<String> expectedStyleNames = new ArrayList<String>();
			for (StyleType style : expectedStyles) {
				expectedStyleNames.add(style.getName());
			}
			final Problem problem = new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_WRONG_STYLE,
				new FormModelProblemSource(checkedElementId),
				checkedElement,
				actualStyle.getName(),
				expectedStyleNames);
			styleProblems.add(problem);
		}
	}

}
