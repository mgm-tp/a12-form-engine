// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class AutoExpandAreaRuleTest {

	private final AutoExpandAreaRule autoExpandAreaRule = new AutoExpandAreaRule();

	@BeforeClass
	public void setup() {
		autoExpandAreaRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/"));
	}

	// @formatter:off
	@Test
	public void verifyAutoExpandInvalidNoAreaOrLineBreaks() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelAutoExpandInvalidNoAreaLineBreaks.json");

		final List<Problem> problems = autoExpandAreaRule.executeRule(productForm);

		assertThat(problems, hasSize(2));
		assertThat(problems,hasItem(hasProperty("message",equalTo("For the form model element [id: control-d5da2, name: stringNoLineBreaks] autoExpand is set. This is only permitted, when the exposition is 'Area'."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("For the form model element [id: fieldbasedrepeatoverviewcolumn-b98d1, name: stringNoLineBreaks] autoExpand is set. This is only permitted, when the exposition is 'Area'."))));
	}

	@Test
	public void verifyAutoExpandValidArea() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelAutoExpandValidArea.json");

		final List<Problem> problems = autoExpandAreaRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}
}
