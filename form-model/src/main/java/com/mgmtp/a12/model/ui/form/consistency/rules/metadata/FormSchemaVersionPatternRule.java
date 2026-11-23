// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.notification.Severity;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Check the pattern of the rules version. The pattern is <code>[0-9]+\\.[0-9]+\\.[0-9]+</code>
 */
public class FormSchemaVersionPatternRule implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		Problem violation = null;
		final String modelSchemaVersion = model.getHeader().getModelVersion();
		if (!VersionChecker.matchesVersionPattern(modelSchemaVersion)) {
			violation = new ConsistencyProblem(
				model.getHeaderId(),
				FormModelCategory.FORM_MODEL_WRONG_VERSION_PATTERN,
				new FormModelProblemSource(model.getHeaderId()),
				Severity.ERROR,
				modelSchemaVersion
			);
		}

		return violation == null
			? Collections.emptyList()
			: Arrays.asList(violation);
	}
}
