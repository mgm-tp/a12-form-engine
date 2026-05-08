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
package com.mgmtp.a12.model.ui.form.consistency.rules.placeholder;

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

public class PlaceholderRuleTest {
	private final PlaceholderRule placeholderRule = new PlaceholderRule();

	@BeforeClass
	public void setup() {
		placeholderRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/placeholder/"));
	}

	@Test
	public void verifyPlaceholderRuleValid() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/placeholder/FormModelPlaceholderValid.json");

		final List<Problem> problems = placeholderRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void verifyPlaceholderRuleInvalid() {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/placeholder/FormModelPlaceholderInvalid.json");

		final List<Problem> problems = placeholderRule.executeRule(productForm);
		assertThat(problems, hasSize(7));
		assertThat(problems, hasItem(hasProperty("message", equalTo("For the form model element [id: fieldimpl_824de, name: enumerationFieldFull] 'placeholder' is set. This is not permitted for the combination of datatype of the underlying field and exposition."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("For the form model element [id: fieldimpl_90bce, name: enumerationFieldInline] 'placeholder' is set. This is not permitted for the combination of datatype of the underlying field and exposition."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("For the form model element [id: groupimpl_9f693, name: multiSelectInline] 'placeholder' is set. This is not permitted for the combination of datatype of the underlying field and exposition."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("For the form model element [id: groupimpl_1bda1, name: multiSelectFull] 'placeholder' is set. This is not permitted for the combination of datatype of the underlying field and exposition."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("For the form model element [id: group_9f18b, name: attachment] 'placeholder' is set. This is not permitted for the combination of datatype of the underlying field and exposition."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("For the form model element [id: fieldimpl_61f05, name: confirmField] 'placeholder' is set. This is not permitted for the combination of datatype of the underlying field and exposition."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("For the form model element [id: field_91bc4, name: booleanFieldSwitch] 'placeholder' is set. This is not permitted for the combination of datatype of the underlying field and exposition."))));
	}
}
