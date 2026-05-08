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
package com.mgmtp.a12.model.ui.form.consistency.rules.numberOfInitialRows;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.numberOfInitialRows.NumberOfInitialRowsRule;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.List;

import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_INVALID;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_TOO_BIG;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

public class NumberOfInitialRowsRuleTest {

	private MeliesModel model;
	private List<Problem> problems;
	private final NumberOfInitialRowsRule numberOfInitialRowsRule = new NumberOfInitialRowsRule();

	@BeforeClass
	public void setUp() {
		numberOfInitialRowsRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/numberOfInitialRows/"));
		model = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/numberOfInitialRows/TestForm.json");
		problems = numberOfInitialRowsRule.executeRule(model);

		assertThat(problems, hasSize(expectedProblems().length));
	}

	@Test(dataProvider = "expectedProblems")
	public void verifyNumberOfInitialRowsRuleValid(final Problem expectedProblem) {
		assertThat(problems, hasItem(hasProperty("message", is(expectedProblem.getMessage()))));
	}

	@DataProvider
	public Object[][] expectedProblems() {
		return new Object[][] {
			{
				createProblem(
					FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_TOO_BIG,
					"inlinerepeat-a2f2a",
					"inline-repeat-too-big")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_INVALID,
					"detachedrepeat-f13c6",
					"detached-repeat")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_INVALID,
					"embeddedrepeat-28da7",
					"embedded-repeat")
			}
		};
	}

	private Problem createProblem(final FormModelCategory category, final String repeatId, final String repeatName) {
		return new ConsistencyProblem(model.getHeaderId(), category, null, repeatId, repeatName);
	}
}
