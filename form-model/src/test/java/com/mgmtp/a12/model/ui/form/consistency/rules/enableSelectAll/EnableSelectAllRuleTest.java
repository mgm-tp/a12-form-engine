// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.enableSelectAll;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

public class EnableSelectAllRuleTest {
	private final EnableSelectAllRule enableSelectAllRule = new EnableSelectAllRule();

	@BeforeClass
	public void setup() {
		enableSelectAllRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/enableSelectAll/"));
	}

	@Test
	public void verifyEnableSelectAllRuleValid() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/enableSelectAll/FormModelValid.json");

		final List<Problem> problems = enableSelectAllRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void verifyEnableSelectAllRuleInvalidDataType() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/enableSelectAll/FormModelInvalidDataType.json");

		final List<Problem> problems = enableSelectAllRule.executeRule(productForm);
		// @formatter:off
		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The 'select all' option is enabled for the model element [id: field_d6a97, name: stringField]. This is only permitted for the 'multi-select' datatype."))));
	}

	@Test
	public void verifyEnableSelectAllRuleInvalidExpostion() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/enableSelectAll/FormModelInvalidExposition.json");

		final List<Problem> problems = enableSelectAllRule.executeRule(productForm);

		assertThat(problems, hasSize(2));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The 'select all' option is enabled for the model element [id: group_42c62, name: multiSelectField1]. This is only permitted for the exposition full and inline."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The 'select all' option is enabled for the model element [id: groupimpl_56b70, name: multiSelectField1]. This is only permitted for the exposition full and inline."))));
	}
}
