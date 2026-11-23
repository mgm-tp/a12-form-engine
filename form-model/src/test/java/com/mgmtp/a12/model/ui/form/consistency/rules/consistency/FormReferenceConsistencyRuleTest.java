// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
