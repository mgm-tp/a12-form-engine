// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
