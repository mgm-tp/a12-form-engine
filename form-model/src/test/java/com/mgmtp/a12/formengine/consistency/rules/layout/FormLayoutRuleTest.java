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
 * 1. Open-Source License - EUPL v1.2
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
package com.mgmtp.a12.formengine.consistency.rules.layout;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.List;

import org.testng.annotations.Test;

public class FormLayoutRuleTest {

	private final FormLayoutRule formLayoutRule = new FormLayoutRule();

	@Test
	public void checkInvalidLayout() {
		final FormModel productForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/layout/formLayoutRuleTestInvalidFormModel.json");
		final List<Problem> problems = formLayoutRule.execute(productForm, null);


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
		final FormModel productForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/layout/formLayoutRuleTestValidFormModel.json");
		final List<Problem> problems = formLayoutRule.execute(productForm, null);
		assertThat(problems, hasSize(0));
	}
}
