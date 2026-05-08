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
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.multiFileUpload;

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

public class MultiFileUploadRuleTest {
	private static final String[] EXPECTED_PROBLEMS = new String[] {
		"For the repeat [id: inlinerepeat-c988d, name: ir-multi-file-disabled-but-options] 'multiFileUploadOptions' is set. This is only allowed if 'multiFileUpload' is set as well.",
		"For the repeat [id: inlinerepeat-3a4da, name: ir-missing-elementRef] 'multiFileUpload' is set, but no reference to an attachment group. This reference is mandatory if 'multiFileUpload' is set.",
		"For the repeat [id: inlinerepeat-894b7, name: inline-missing-options] 'multiFileUpload' is set, but no reference to an attachment group. This reference is mandatory if 'multiFileUpload' is set.",
		"For the repeat [id: inlinerepeat-c4e68, name: ir-no-attachment-collection] 'multiFileUpload' is set. This is only allowed if the underlying document model group [id: group_99da2] contains exactly one (non-repeatable) attachment group." 
	};
	private static final String TEST_PACKAGE = "com/mgmtp/a12/model/ui/form/consistency/rules/repeat/multiFileUpload/";
	private final MultiFileUploadRule multiFileUploadRule = new MultiFileUploadRule();

	@BeforeClass
	public void setUp() {
		multiFileUploadRule.setModelResolver(new FileBasedPicusModelResolver(TEST_PACKAGE));
	}

	@Test
	public void testRule() {
		final MeliesModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestForm.json");
		final List<Problem> problems = multiFileUploadRule.executeRule(productForm);
		Assert.assertEquals(problems.size(), EXPECTED_PROBLEMS.length);
		Arrays.stream(EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
