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
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class FormReferenceConsistencyRuleTest {

	private static final String TEST_PACKAGE = "com/mgmtp/a12/model/ui/form/consistency/rules/consistency/document-model-reference/";

	private final FormReferenceConsistencyRule rule = new FormReferenceConsistencyRule();

	@BeforeClass
	public void setUp() {
		rule.setModelResolver(new FileBasedPicusModelResolver(TEST_PACKAGE));
	}

	@Test
	public void testValidMetaFieldReferences() throws IOException {
		final MeliesModel testForm = ModelLoader.loadModel(TEST_PACKAGE + "form-model-valid.json");
		final List<Problem> problems = rule.executeRule(testForm);
		Assert.assertEquals(problems.size(), 0);
	}

	@Test
	public void testInvalidFieldAndGroupReferences() throws IOException {
		final MeliesModel testForm = ModelLoader.loadModel(TEST_PACKAGE + "form-model-invalid.json");
		final List<Problem> problems = rule.executeRule(testForm);
		Assert.assertEquals(problems.size(), 3);
		Arrays.stream(EXPECTED_ERRORS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	private static final String[] EXPECTED_ERRORS = new String[] {
		"Element [id: field_54321] in control [id: control-135ab] could not be resolved in document model [name: document-model].",
		"Element [id: field_12345] in overview column of the repeat type [id: inline-repeat-123ab] could not be resolved in document model [name: document-model].",
		"The repeat is bound to a group [id: group_12345] that does not exist in the document model."
	};
}
