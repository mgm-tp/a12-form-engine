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

public class FormEmptyRolesRuleTest {

	private final FormEmptyRolesRule formEmptyRolesRule = new FormEmptyRolesRule();

	@Test
	public void checkRolesNotEmpty() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductForm.json");
		final List<Problem> problems = formEmptyRolesRule.executeRule(productForm);
		assertThat(problems, empty());
	}

	@Test
	public void checkRolesEmpty() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductForm.json");
		productForm.getHeader().getAnnotations().clear();

		final List<Problem> problems = formEmptyRolesRule.executeRule(productForm);

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The form model does not contain any roles. There must be at least one role set."))));
	}

}
