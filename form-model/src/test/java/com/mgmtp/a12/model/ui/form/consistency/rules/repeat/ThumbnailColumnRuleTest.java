// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

import java.util.Arrays;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.thumbnailColumn.RepeatThumbnailColumnRule;

public class ThumbnailColumnRuleTest {
	private static final String[] EXPECTED_PROBLEMS = new String[] {
		"The column [id: fieldbasedrepeatoverviewcolumn-3b80a] of the repeat [id: inlinerepeat-b71cc, name: inline-repeat-Rep] has exposition 'THUMBNAIL_OR_ICON' set, but this is only allowed for columns that reference an 'attachment' group."
	};
	private static final String TEST_PACKAGE = "com/mgmtp/a12/model/ui/form/consistency/rules/repeat/thumbnailColumn/";
	private final RepeatThumbnailColumnRule repeatThumbnailColumnRule = new RepeatThumbnailColumnRule();

	@BeforeClass
	public void setUp() {
		repeatThumbnailColumnRule.setModelResolver(new FileBasedPicusModelResolver(TEST_PACKAGE));
	}

	@Test
	public void testRule() {
		final MeliesModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestForm.json");
		final List<Problem> problems = repeatThumbnailColumnRule.executeRule(productForm);
		Assert.assertEquals(problems.size(), EXPECTED_PROBLEMS.length);
		Arrays.stream(EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
