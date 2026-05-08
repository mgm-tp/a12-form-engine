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
package com.mgmtp.a12.model.ui.form.consistency.general;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.RuleExecutor;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.hamcrest.MatcherAssert;
import org.hamcrest.Matchers;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class RuleExecutorTest {

	private RuleExecutor ruleExecutor;

	@BeforeClass
	public void setUp() throws Exception {
		ruleExecutor = new RuleExecutor(
			new FileBasedPicusModelResolver("com/mgmtp/a12/model/ui/form/consistency/general/"),
			Collections.emptyList()
		);
	}

	@Test
	public void checkRuleExecutor() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithWrongNavigationButtons.json");
		final List<Problem> problems = ruleExecutor.validateModel(productForm);

		for (Problem p : problems) {
			System.out.println("Problem: " + p);
		}

		// @formatter:off
		assertThat(problems, hasSize(5));
		assertThat(problems,hasItem(hasProperty("message", equalTo("The target parameter of navigation button [next] has an invalid value [screen2]. It is either one of the screens [screen-a050f,screen-e75f1,screen-60aaa] or the following constants [#previous,#next]."))));
		assertThat(problems,hasItem(hasProperty("message", equalTo("For the event button [next3] a target has been set. This is only allowed for navigation buttons."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [next] contains text [weiter] in unexpected locale [de]. Expected locales are [en]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [next2] contains text [weiter2] in unexpected locale [de]. Expected locales are [en]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [next3] contains text [weiter] in unexpected locale [de]. Expected locales are [en]."))));
	}
}
