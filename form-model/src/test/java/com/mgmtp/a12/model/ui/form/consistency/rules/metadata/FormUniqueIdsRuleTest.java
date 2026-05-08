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
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import java.util.List;
import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.FormUniqueIdsRule;

public class FormUniqueIdsRuleTest {
	private final FormUniqueIdsRule consistencyRule = new FormUniqueIdsRule();

	@Test
	public void checkValidIds() throws Exception {
		final MeliesModel testForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/IdTestForm.json");
		final List<Problem> problems = consistencyRule.executeRule(testForm);
		assertThat(problems, empty());
	}

	@Test
	public void checkInvalidIds() throws Exception {
		final MeliesModel testForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/InvalidIdTestForm.json");

		final List<Problem> problems = consistencyRule.executeRule(testForm);

		assertThat(problems, hasSize(17));
		for (final String message : getExpectedMessages()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessages() {
		return new String[] {
			"The form model contains a duplicate id [screen1]. All ids must be unique.",
			"The form model contains a duplicate id [buttonpanel-29a78]. All ids must be unique.",
			"The form model contains a duplicate id [detachedrepeat-88408]. All ids must be unique.",
			"The form model contains a duplicate id [inlinerepeat-ac846]. All ids must be unique.",
			"The form model contains a duplicate id [embeddedrepeat-7d55a]. All ids must be unique.",
			"The form model contains a duplicate id [controlgrid-ba10b]. All ids must be unique.",
			"The form model contains a duplicate id [fieldbasedrepeatoverviewcolumn-c24fa]. All ids must be unique.",
			"The form model contains a duplicate id [expressionrepeatoverviewcolumn-0894b]. All ids must be unique.",
			"The form model contains a duplicate id [textcell-058be]. All ids must be unique.",
			"The form model contains a duplicate id [row-52bba]. All ids must be unique.",
			"The form model contains a duplicate id [control-7f4ef]. All ids must be unique.",
			"The form model contains a duplicate id [button-598f0]. All ids must be unique.",
			"The form model contains a duplicate id [section-af573]. All ids must be unique.",
			"The form model contains a duplicate id [expressioncell-a762c]. All ids must be unique.",
			"The form model contains a duplicate id [multicolumnsection-41fc5]. All ids must be unique.",
			"The form model contains a duplicate id [button-7187e]. All ids must be unique.",
			"The form model contains a duplicate id [headerFooterBox1]. All ids must be unique."
		};
	}
}
