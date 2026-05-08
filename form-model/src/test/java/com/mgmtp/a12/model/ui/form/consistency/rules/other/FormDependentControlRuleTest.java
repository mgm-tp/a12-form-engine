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
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

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

public class FormDependentControlRuleTest {

	private FormDependentControlRule formDependentControlRule;

	@BeforeClass
	public void setUp() {
		formDependentControlRule = new FormDependentControlRule();
		formDependentControlRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/"));
	}

	@Test
	public void checkMissingReferences() throws Exception {

		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/DependentControlWithMissingScreenElement.json");
		final List<Problem> problems = formDependentControlRule.executeRule(productForm);

		// @formatter:off
		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_eadf7] refers to screen [section_d6b5c] which is missing in the model."))));
	}

	@Test
	public void checkInvalidParentReferences() throws Exception {

		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/ProductFormWithDependentControl.json");
		final List<Problem> problems = formDependentControlRule.executeRule(productForm);

		// @formatter:off
		assertThat(problems, hasSize(2));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control-be277] refers to screen [controlgrid-0f93f] which is a parent of the dependent control."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control-b4bee] refers to screen [section-6e865] which is a parent of the dependent control."))));
	}

	@Test
	public void checkAtLeastOneScreenElementGiven() throws Exception {

		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/DependentControlWithNoScreenElement.json");
		final List<Problem> problems = formDependentControlRule.executeRule(form);

		// @formatter:off
		assertThat(problems, hasSize(2));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control-ae4b2] does not define any dependent screen element. At least one dependent screen element must be set."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control-09494] does not define any dependent screen element. At least one dependent screen element must be set."))));
	}

	@Test
	public void checkReferencesToDifferentScreen() throws Exception {

		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/DependentControlWithReferencesToDifferentScreen.json");
		final List<Problem> problems = formDependentControlRule.executeRule(form);

		// @formatter:off
		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_eadf7] refers to screen element [section_1264f], which is located on a different screen. This is not allowed."))));
	}

	@Test
	public void checkIndexedControlReferences() throws Exception {

		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/DependentControlWithIndexedReferencesToDifferentScreen.json");
		final List<Problem> problems = formDependentControlRule.executeRule(form);

		// @formatter:off
		assertThat(problems, hasSize(3));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_b084e] contains index information and refers to screen element [section_d0dfc] on a different (detail) screen. This is not allowed."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_e1db0] contains index information and refers to screen element [controlgrid_51e46] on a different (detail) screen. This is not allowed."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_a24eb] refers to screen element [section_59ec2], which is located on a different screen. This is not allowed."))));
	}

	@Test
	public void checkIncompatibleDataContexts() throws Exception {

		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/DependentControlWithIncompatibleDataContext.json");
		final List<Problem> problems = formDependentControlRule.executeRule(form);

		// @formatter:off
		assertThat(problems, hasSize(6));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_19bb1] refers to screen element [section_ce235] with an incompatible data context."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_995f7] refers to screen element [controlgrid_e2351] with an incompatible data context."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_7b31c] refers to screen element [controlgrid_edf3b] with an incompatible data context."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_fecf2] refers to screen element [section_ce235] with an incompatible data context."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_d8eb1] refers to screen element [multicolumnsection_9ba42] with an incompatible data context."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Dependent control [control_578b4] refers to screen element [controlgrid_edf3b] with an incompatible data context."))));
	}

}
