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

public class FormSchemaVersionPatternTest {

	private FormSchemaVersionPatternRule schemaVersionRule = new FormSchemaVersionPatternRule();

	@Test
	public void checkSchemaVersion() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductForm.json");
		final List<Problem> problems = schemaVersionRule.executeRule(productForm);
		assertThat(problems, empty());
	}

	@Test
	public void checkWrongSchemaVersion() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductFormWrongVersion.json");
		final List<Problem> problems = schemaVersionRule.executeRule(productForm);
		assertThat(problems, hasSize(1));
		// @formatter:off
		assertThat(problems.get(0).getMessage(),equalTo("Form model version 19.1.2.3 does not match proper version schema. A version following the pattern <number>.<number>.number> is expected."));
	}

}
