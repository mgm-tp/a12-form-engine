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
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.showCommaSeparated;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.List;

import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_NO_MULTI_SELECT_COLUMN;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_ROW_HEIGHT_GIVEN;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_UNNECESSARY;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

public class ShowCommaSeparatedRuleTest {

	private MeliesModel model;
	private List<Problem> problems;
	private final ShowCommaSeparatedRule rule = new ShowCommaSeparatedRule();

	@BeforeClass
	public void setUp() {
		rule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/showCommaSeparated/"));
		model = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/showCommaSeparated/ShowCommaSeparated-form.json");
		problems = rule.executeRule(model);

		assertThat(problems, hasSize(expectedProblems().length));
	}

	@Test(dataProvider = "expectedProblems")
	public void checkExpectedProblem(final Problem expectedProblem) {
		assertThat(problems, hasItem(hasProperty("message", is(expectedProblem.getMessage()))));
	}

	@DataProvider
	public Object[][] expectedProblems() {
		return new Object[][] {
			{
				createProblem(
					FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_ROW_HEIGHT_GIVEN,
					"fieldbasedrepeatoverviewcolumn-4f145",
					"inlinerepeat-03f93",
					"inline-repeat-2")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_ROW_HEIGHT_GIVEN,
					"fieldbasedrepeatoverviewcolumn-b198b",
					"detachedrepeat-fbf07",
					"detached-repeat-2")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_ROW_HEIGHT_GIVEN,
					"fieldbasedrepeatoverviewcolumn_04f8a",
					"embeddedrepeat_ee991",
					"embedded-repeat-2")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_NO_MULTI_SELECT_COLUMN,
					"fieldbasedrepeatoverviewcolumn-ff7ba",
					"inlinerepeat-04d1c",
					"inline-repeat-3")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_UNNECESSARY,
					"fieldbasedrepeatoverviewcolumn-80f99",
					"inlinerepeat-04d1d",
					"inline-repeat-4")
			}
		};
	}

	private Problem createProblem(
		final FormModelCategory category,
		final String columnId,
		final String repeatId,
		final String repeatName) {
		return new ConsistencyProblem(model.getHeaderId(), category, null, columnId, repeatId, repeatName);
	}
}
