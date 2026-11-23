// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import java.util.List;

import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

public class FormOffsetSpanRuleTest {

	private final FormOffsetSpanRule formOffsetSpanRule = new FormOffsetSpanRule();

	@Test
	public void checkInvalidSpanConfig() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/formOffsetSpanRuleTestInvalidFormModel.json");
		final List<Problem> problems = formOffsetSpanRule.executeRule(productForm);

		// @formatter:off
		assertThat(problems, hasSize(9));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-52eb8 in Control Grid cg has an invalid span configuration for size md, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-fb979 in Control Grid cg has an invalid span configuration for size md, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-fb979 in Control Grid cg has an invalid span configuration for size sm, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-fb97a in Control Grid cg has an invalid span configuration for size sm, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-52eb7 in Control Grid cg2 has an invalid span configuration for size md, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-52eb7 in Control Grid cg2 has an invalid span configuration for size sm, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-52eb8 in Control Grid cg3 has an invalid span configuration for size md, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-52eb8 in Control Grid cg3 has an invalid offset configuration for size sm, since the width taken up by the offset exceeds 12 based on the given layout."))));
		assertThat(problems, hasItem(hasProperty("message",equalTo("The element control-52eb8 in Control Grid cg3 has an invalid span configuration for size sm, since the resulting width taken up by the element exceeds 12 based on the given layout."))));
	}

	@Test
	public void checkValidSpanConfig() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/formOffsetSpanRuleTestValidFormModel.json");
		final List<Problem> problems = formOffsetSpanRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}
}
