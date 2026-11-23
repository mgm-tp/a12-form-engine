// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.columnWidth.RepeatColumnWidthRule;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class ColumnWidthTest {

	private RepeatColumnWidthRule repeatColumnWidthRule;

	@BeforeClass
	public void setUp() {
		repeatColumnWidthRule = new RepeatColumnWidthRule();
		repeatColumnWidthRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/"));
	}

	@Test
	public void checkValidColumnWidthInFieldOverviewColumn() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/ProductFromWithValidColumnWidthInFieldOverviewColumn.json");
		final List<Problem> problems = repeatColumnWidthRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void checkInvalidColumnWidthInFieldOverviewColumn() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/ProductFromWithInvalidColumnWidthInFieldOverviewColumn.json");
		final List<Problem> problems = repeatColumnWidthRule.executeRule(productForm);

		assertThat(problems, hasSize(2));
		// @formatter:off
		assertThat(problems,hasItem(hasProperty("message",startsWith("The width of column [id: fieldbasedrepeatoverviewcolumn-9b801] in repeat [id: inlinerepeat-fccf4, name: inline-repeat-mediaFiles] is too small. The column width has to be bigger than or equal to 0.3."))));
		assertThat(problems,hasItem(hasProperty("message",startsWith("The width of column [id: fieldbasedrepeatoverviewcolumn-e8a90] in repeat [id: inlinerepeat-fccf4, name: inline-repeat-mediaFiles] has too many decimal places. Just one decimal place is allowed."))));
		// @formatter:on
	}

	@Test
	public void checkValidColumnWidthInExpressionOverviewColumn() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/ProductFromWithValidColumnWidthInExpressionOveviewColumn.json");
		final List<Problem> problems = repeatColumnWidthRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void checkInvalidColumnWidthInExpressionOverviewColumn() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/ProductFromWithInvalidColumnWidthInExpressionOveviewColumn.json");
		final List<Problem> problems = repeatColumnWidthRule.executeRule(productForm);
		// @formatter:off
		assertThat(problems, hasSize(2));
		assertThat(problems, hasItem(hasProperty("message",startsWith("The width of column [id: expressionrepeatoverviewcolumn-3a075] in repeat [id: inlinerepeat-fccf4, name: inline-repeat-mediaFiles] is too small. The column width has to be bigger than or equal to 0.3."))));
		assertThat(problems, hasItem(hasProperty("message",startsWith("The width of column [id: expressionrepeatoverviewcolumn-af609] in repeat [id: inlinerepeat-fccf4, name: inline-repeat-mediaFiles] has too many decimal places. Just one decimal place is allowed."))));
		// @formatter:on
	}
}
