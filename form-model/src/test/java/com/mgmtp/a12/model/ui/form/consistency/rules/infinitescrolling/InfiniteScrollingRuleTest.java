// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
