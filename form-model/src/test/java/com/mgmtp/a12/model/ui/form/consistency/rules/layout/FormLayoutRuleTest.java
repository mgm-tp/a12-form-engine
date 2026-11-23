// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

public class FormLayoutRuleTest {

	private final FormLayoutRule formLayoutRule = new FormLayoutRule();

	@Test
	public void checkInvalidLayout() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/formLayoutRuleTestInvalidFormModel.json");
		final List<Problem> problems = formLayoutRule.executeRule(productForm);

		// @formatter:off
		assertThat(problems, hasSize(8));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [cg] contains a wrong number of columns for layout lg. The expected number of columns is 2 but there are 3 defined columns."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [cg] contains a wrong column sum. The actual sum is 13 but only a maximum sum of 12 is allowed for layout lg."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [cg] contains a wrong number of columns for layout md. The expected number of columns is 2 but there are 1 defined columns."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [cg] contains a wrong number of columns for layout sm. The expected number of columns is 2 but there are 3 defined columns."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [mcs] contains a wrong number of columns for layout lg. The expected number of columns is 2 but there are 3 defined columns."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [mcs] contains a wrong column sum. The actual sum is 14 but only a maximum sum of 12 is allowed for layout lg."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [mcs] contains a wrong number of columns for layout md. The expected number of columns is 2 but there are 1 defined columns."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("Form model field [mcs] contains a wrong number of columns for layout sm. The expected number of columns is 2 but there are 3 defined columns."))));
	}

	@Test
	public void checkValidLayout() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/formLayoutRuleTestValidFormModel.json");
		final List<Problem> problems = formLayoutRule.executeRule(productForm);
		assertThat(problems, hasSize(0));
	}
}
