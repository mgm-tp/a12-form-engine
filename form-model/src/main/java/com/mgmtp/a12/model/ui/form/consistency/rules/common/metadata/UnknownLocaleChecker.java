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
 * 1. Open-Source License – EUPL v1.2
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
package com.mgmtp.a12.model.ui.form.consistency.rules.common.metadata;

import com.mgmtp.a12.model.consistency.ConsistencyCategory;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.language.LocalizedTextAdapter;
import com.mgmtp.a12.model.ui.form.consistency.rules.language.LocalizedTextValue;

import org.apache.commons.lang3.StringUtils;

import java.util.LinkedList;
import java.util.List;

public class UnknownLocaleChecker {

	private final String modelName;

	private final List<String> expectedLocales;

	private final ConsistencyCategory problemCategory;

	private final List<Problem> localeProblems = new LinkedList<Problem>();

	public UnknownLocaleChecker(
		final String modelName,
		final List<String> expectedLocales,
		final ConsistencyCategory problemCategory
	) {
		this.modelName = modelName;
		this.expectedLocales = expectedLocales;
		this.problemCategory = problemCategory;
	}

	public void check(final LocalizedTextAdapter localizedTextAdapter, final String checkedElement) {
		if (localizedTextAdapter == null) {
			return;
		}
		for (final LocalizedTextValue language : localizedTextAdapter.getLocalizedTexts()) {
			checkTextTypeLocale(language, checkedElement);
		}
	}

	public List<Problem> getLocaleProblems() {
		return localeProblems;
	}

	private void checkTextTypeLocale(final LocalizedTextValue localizedTextValue, final String checkedElement) {
		final String locale = localizedTextValue.getLocale();
		if (!expectedLocales.contains(locale)) {
			final Problem problem = new ConsistencyProblem(
				modelName,
				problemCategory,
				new FormModelProblemSource(checkedElement),
				checkedElement,
				localizedTextValue.getText(),
				localizedTextValue.getLocale(),
				StringUtils.join(expectedLocales, ",")
			);
			localeProblems.add(problem);
		}
	}

}
