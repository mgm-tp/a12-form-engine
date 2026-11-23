// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
