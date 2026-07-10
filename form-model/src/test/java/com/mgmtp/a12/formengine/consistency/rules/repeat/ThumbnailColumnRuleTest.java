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
 * 1. Open-Source License - EUPL v1.2
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
package com.mgmtp.a12.formengine.consistency.rules.repeat;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.consistency.rules.repeat.thumbnailColumn.RepeatThumbnailColumnRule;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.Arrays;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.Test;

public class ThumbnailColumnRuleTest {
	private static final String[] EXPECTED_PROBLEMS = new String[] {
		"The column [id: fieldbasedrepeatoverviewcolumn-3b80a] of the repeat [id: inlinerepeat-b71cc, name: inline-repeat-Rep] has exposition 'THUMBNAIL_OR_ICON' set, but this is only allowed for columns that reference an 'attachment' group."
	};
	private static final String TEST_PACKAGE = "com/mgmtp/a12/formengine/consistency/rules/repeat/thumbnailColumn/";
	private final RepeatThumbnailColumnRule repeatThumbnailColumnRule = new RepeatThumbnailColumnRule();

	@Test
	public void testRule() {
		final FormModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(
			TEST_PACKAGE);
		final List<Problem> problems = repeatThumbnailColumnRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));
		Assert.assertEquals(problems.size(), EXPECTED_PROBLEMS.length);
		Arrays.stream(EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
