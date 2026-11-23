// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.form.nesting;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.ConsistencyCategory;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.nesting.RepeatNestingRule;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class RepeatNestingRuleTest {

	private final RepeatNestingRule repeatNestingRule = new RepeatNestingRule();
	private List<Problem> problems = Collections.emptyList();

	@BeforeClass
	public void executeRule() {
		repeatNestingRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/form/nesting/"));
		final MeliesModel testModel =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/form/nesting/FormModel.json");
		problems = repeatNestingRule.executeRule(testModel);

		Assert.assertFalse(problems.isEmpty());
		Assert.assertEquals(problems.size(), testData().length);
	}

	@Test(dataProvider = "testData")
	public void checkRuleFindings(final String expectedMessage, final ConsistencyCategory expectedCategory)
		throws Exception {
		final Optional<Problem> problem =
			problems.stream().filter(p -> p.getMessage().equals(expectedMessage)).findAny();
		Assert.assertTrue(problem.isPresent());
		Assert.assertEquals(problem.get().getCategory(), expectedCategory);
	}

	@DataProvider
	private Object[][] testData() {
		return new Object[][] {
			{
				"The repeat is bound to a group [id: G1337] that does not exist in the document model.",
				FormModelCategory.FORM_MODEL_INVALID_GROUP_REF
			}, {
				"Repeat [id: ir-1] is bound to a non-repeatable group [id: G2, name: base].",
				FormModelCategory.FORM_MODEL_NON_REPEATABLE_REPEAT_GROUP
			}, {
				"Repeat [id: ir-2] is bound to a non-repeatable group [id: G6, name: no_rep1].",
				FormModelCategory.FORM_MODEL_NON_REPEATABLE_REPEAT_GROUP
			}, {
				"Invalid nesting: The repeat [id: ir-3] is not bound to a (direct or indirect) child group of its "
				+ "parent's repeat group [id: G7, name: rep2_1].",
				FormModelCategory.FORM_MODEL_INVALID_NESTING_PARENT
			}, {
				"Invalid nesting: The repeat [id: ir-4] is not bound to the next repeatable child group of its "
				+ "parent's "
				+ "repeat group [id: G4, name: rep].", FormModelCategory.FORM_MODEL_INVALID_NESTING_REPEATABLE_BETWEEN
			}, {
				"Repeat [id: dr-3] is not nested into another repeat and therefore must be bound to a repeatable "
				+ "group "
				+ "that is also not a child (directly or indirectly) of another repeatable group.",
				FormModelCategory.FORM_MODEL_INVALID_NESTING_REPEATABLE_PARENT
			}
		};
	}
}
