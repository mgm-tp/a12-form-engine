// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
