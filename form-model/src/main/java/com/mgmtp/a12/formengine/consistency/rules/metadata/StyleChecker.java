/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
package com.mgmtp.a12.formengine.consistency.rules.metadata;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.model.types.StyleType;

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
