// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

import org.apache.commons.collections4.ListUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

public class LocaleCompatibilityRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final ArrayList<Problem> problems = new ArrayList<>();

		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);

		final List<Locale> picusLocales =
			ListUtils.emptyIfNull(documentModelService.getDocumentModel().getHeader().getLocales());

		final String missingLocales = ListUtils.emptyIfNull(model.getHeader().getLocales())
			.stream()
			.filter(meliesLocale -> picusLocales.stream()
				.noneMatch(picusLocale -> picusLocale.equals(
					meliesLocale)))
			.map(Locale::toString)
			.collect(Collectors.joining(","));

		if (!missingLocales.isEmpty()) {
			problems.add(new ConsistencyProblem(
				model.getHeaderId(),
				FormModelCategory.FORM_MODEL_INCOMPATIBLE_LOCALES,
				new FormModelProblemSource(model.getHeaderId()),
				missingLocales
			));
		}

		return problems;
	}
}
