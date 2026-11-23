// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.rowaction.FormRepeatCustomRowActionsRule;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class FormRepeatCustomRowActionsRuleTest {

	private FormRepeatCustomRowActionsRule formRepeatCustomRowActionsRule;

	@BeforeClass
	public void setUp() {
		formRepeatCustomRowActionsRule = new FormRepeatCustomRowActionsRule();
		formRepeatCustomRowActionsRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/"));

	}

	@Test
	public void checkInvalidIconLabelEvent() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/ProductFormWithInvalidIconLabelEvent.json");
		final List<Problem> problems = formRepeatCustomRowActionsRule.executeRule(productForm);
		// @formatter:off
		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",startsWith("Event of RowActions in Repeat [detachedRepeat] must be provided."))));
		// @formatter:on
	}

	@Test
	public void checkValidIconEvent() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/ProductFormWithValidIconEvent.json");
		final List<Problem> problems = formRepeatCustomRowActionsRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void checkValidLabelEvent() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/ProductFormWithValidLabelEvent.json");
		final List<Problem> problems = formRepeatCustomRowActionsRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

}
