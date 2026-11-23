// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class FormSchemaVersionTest {

	private final FormSchemaVersionRule schemaVersionRule = new FormSchemaVersionRule();

	@Test
	public void checkSchemaVersion() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductForm.json");
		final List<Problem> problems = schemaVersionRule.executeRule(productForm);
		assertThat(problems, empty());
	}

	@Test
	public void checkWrongSchemaVersion() throws Exception {
		final String testMeliesModelVersion = "31.99.1";
		final FormSchemaVersionRule rule = new FormSchemaVersionRule(testMeliesModelVersion);
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductFormWrongVersion.json");
		final List<Problem> problems = rule.executeRule(productForm);
		assertThat(problems, hasSize(1));
		// @formatter:off
		assertThat(problems.get(0).getMessage(),equalTo(String.format("Version mismatch: Form model version is 19.1.2.3 but only models with version >= %s.0.0 and <= %s are supported.", testMeliesModelVersion.split("\\.")[0], testMeliesModelVersion)));
	}

	@Test
	public void checkWrongSchemaVersionWithPreReleaseTag() throws Exception {
		final String testMeliesModelVersion = "31.0.0-pre.0";
		final FormSchemaVersionRule rule = new FormSchemaVersionRule(testMeliesModelVersion);
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductFormWrongVersionPreRelease.json");
		final List<Problem> problems = rule.executeRule(productForm);
		assertThat(problems, hasSize(1));
		// @formatter:off
		assertThat(problems.get(0).getMessage(),equalTo(String.format("Version mismatch: Form model version is 30.0.0 but only models with version >= %s and <= %s are supported.", testMeliesModelVersion, testMeliesModelVersion)));
	}
}
