// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
