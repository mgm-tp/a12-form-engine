// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import java.util.List;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

public class SecretAreaLineBreaksRuleTest {

	private final SecretAreaLineBreaksRule secretAreaLineBreaksRule = new SecretAreaLineBreaksRule();

	@BeforeClass
	public void setup() {
		secretAreaLineBreaksRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/"));
	}

	@Test
	public void verifySecretInvalidArea() throws Exception {

		final MeliesModel productForm =
			ModelLoader
				.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelSecretInvalidArea.json");

		final List<Problem> problems = secretAreaLineBreaksRule.executeRule(productForm);

		assertThat(problems, hasSize(2));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"For the form model element [id: control-c6715, name: stringNoLineBreaks] 'secret' is set. This is not permitted, when the exposition is 'Area' or in the underlying field of the DocumentModel 'Line Breaks Permitted' is set."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"For the form model element [id: fieldbasedrepeatoverviewcolumn-e5c62, name: stringNoLineBreaks] 'secret' is set. This is not permitted, when the exposition is 'Area' or in the underlying field of the DocumentModel 'Line Breaks Permitted' is set."))));
	}

	@Test
	public void verifySecretInvalidLineBreaks() throws Exception {

		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelSecretInvalidLineBreaks.json");

		final List<Problem> problems = secretAreaLineBreaksRule.executeRule(productForm);

		assertThat(problems, hasSize(2));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"For the form model element [id: control-31dd8, name: stringWithLineBreaks] 'secret' is set. This is not permitted, when the exposition is 'Area' or in the underlying field of the DocumentModel 'Line Breaks Permitted' is set."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"For the form model element [id: fieldbasedrepeatoverviewcolumn-f804b, name: stringWithLineBreaks] 'secret' is set. This is not permitted, when the exposition is 'Area' or in the underlying field of the DocumentModel 'Line Breaks Permitted' is set."))));
	}

	@Test
	public void verifySecretValid() throws Exception {

		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelSecretValid.json");

		Assert.assertTrue(secretAreaLineBreaksRule.executeRule(productForm).isEmpty());
	}
}
