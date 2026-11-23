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
 * Check if version of model is supported by the application.
 */
public class FormSchemaVersionRule implements FormModelConsistencyRule {

	private String testMeliesModelVersion;

	public FormSchemaVersionRule() {
	}

	public FormSchemaVersionRule(final String testMeliesModelVersion) {
		this.testMeliesModelVersion = testMeliesModelVersion;
	}

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		Problem violation = null;

		final String modelSchemaVersion = model.getHeader().getModelVersion();
		final VersionChecker checker =
			testMeliesModelVersion != null ? new VersionChecker(testMeliesModelVersion) : new VersionChecker();

		if (!checker.isModelSchemaVersionCompatible(modelSchemaVersion)) {
			final String minSupportedVersion = checker.hasPreReleaseTag()
				? testMeliesModelVersion != null ? testMeliesModelVersion : MeliesModel.MODEL_VERSION
				: (testMeliesModelVersion != null ? testMeliesModelVersion : MeliesModel.MODEL_VERSION)
					.split("\\.")[0] + ".0.0";

			violation = new ConsistencyProblem(
				model.getHeaderId(),
				FormModelCategory.FORM_MODEL_WRONG_VERSION,
				new FormModelProblemSource(model.getHeaderId()),
				Severity.ERROR,
				modelSchemaVersion,
				minSupportedVersion,
				testMeliesModelVersion != null ? testMeliesModelVersion : MeliesModel.MODEL_VERSION
			);
		}

		return violation == null
			? Collections.emptyList()
			: Arrays.asList(violation);
	}
}
