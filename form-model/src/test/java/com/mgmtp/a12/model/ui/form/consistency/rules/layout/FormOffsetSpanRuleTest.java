/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
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
