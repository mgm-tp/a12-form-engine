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
package com.mgmtp.a12.model.ui.form.consistency.rules.infinitescrolling;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.infinitescrolling.InfiniteScrollingRule;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.List;

import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_MANY_DECIMAL_PLACES;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_SMALL;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_CONFIG;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_NO_ROW_HEIGHT;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_PAGING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

public class InfiniteScrollingRuleTest {

	private MeliesModel model;
	private List<Problem> problems;

	@BeforeClass
	public void setUp() {
		model = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/infinitescrolling/TestForm.json");
		final InfiniteScrollingRule virtualScrollingRule = new InfiniteScrollingRule();
		problems = virtualScrollingRule.executeRule(model);

		assertThat(problems, hasSize(expectedProblems().length));
	}

	@Test(dataProvider = "expectedProblems")
	public void validationModeInButtons(final Problem expectedProblem) {
		assertThat(problems, hasItem(hasProperty("message", is(expectedProblem.getMessage()))));
	}

	@DataProvider
	public Object[][] expectedProblems() {
		return new Object[][] {
			{
				createProblem(
					FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_PAGING,
					"inlinerepeat-c613a",
					"repeat-virtual-scrolling-page-size")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_PAGING,
					"inlinerepeat-1cf82",
					"repeat-table-height-page-size")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_CONFIG,
					"inlinerepeat-3ea2c",
					"repeat-virtual-scrolling")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_CONFIG,
					"inlinerepeat-2e8ee",
					"repeat-table-height")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_PAGING,
					"inlinerepeat-a341c",
					"repeat-all")
			},
			{
				createProblem(
					FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_SMALL,
					"inlinerepeat-a341d",
					"repeat-too-small-column")
			},
			{
				createProblem(
					FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_MANY_DECIMAL_PLACES,
					"inlinerepeat-a341f",
					"repeat-too-many-decimal-places")
			},
			{
				createProblem(
					FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_NO_ROW_HEIGHT,
					"inlinerepeat-a341x",
					"repeat-no-row-height")
			}

		};
	}

	private Problem createProblem(final FormModelCategory category, final String repeatId, final String repeatName) {
		return new ConsistencyProblem(model.getHeaderId(), category, null, repeatId, repeatName);
	}
}
