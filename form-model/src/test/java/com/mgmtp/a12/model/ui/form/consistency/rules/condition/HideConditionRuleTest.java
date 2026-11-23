// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.condition;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

public class HideConditionRuleTest {
	private static final String[] EXPECTED_INVALID_TYPE_PROBLEMS = new String[] {
		"Master field [id: field_string] from hide condition on element [name: control_target] can be resolved in document model [name: document-model], but has invalid data type [type: String]. Should be [Boolean], [Confirm] or [Enumeration].",
	};

	private static final String[] EXPECTED_MISSING_MASTER_PROBLEMS = new String[] {
		"The master field [id: field_nonexistent] in the hide condition of element control_target could not be resolved in document model [name: document-model]."
	};

	private static final String[] EXPECTED_INVALID_MASTER_VALUE_PROBLEMS = new String[] {
		"Hide condition on element [name: control_target] references master field [id: field_enum] in document model [name: document-model] with invalid master value [value: invalid_value]."
	};

	private static final String[] EXPECTED_NO_CASES_PROBLEMS = new String[] {
		"For the hide condition on element [name: control_target] no master value was selected. At least one master value must be specified."
	};

	private static final String[] EXPECTED_INVALID_GRANULARITY_PROBLEMS = new String[] {
		"For the hide condition on element [name: sectionRoot] the master field [id: field_enum_repeat] has an invalid granularity in document model [name: document-model-with-repeat]. The master field must have the same or a coarser granularity than the corresponding document model group of the element."
	};

	private static final String TEST_PACKAGE = "com/mgmtp/a12/model/ui/form/consistency/rules/condition/";

	private final HideConditionRule rule = new HideConditionRule();

	@BeforeClass
	public void setUp() {
		rule.setModelResolver(new FileBasedPicusModelResolver(TEST_PACKAGE));
	}

	@Test
	public void testInvalidMasterFieldType() {
		final MeliesModel invalidMasterTypeForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormInvalidMasterType.json");
		final List<Problem> problems = rule.executeRule(invalidMasterTypeForm);
		Assert.assertEquals(problems.size(), EXPECTED_INVALID_TYPE_PROBLEMS.length);
		Arrays.stream(EXPECTED_INVALID_TYPE_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testMissingMasterField() {
		final MeliesModel
			missingMasterFieldForm =
			ModelLoader.loadModel(TEST_PACKAGE + "TestFormMissingMasterField.json");
		final List<Problem> problems = rule.executeRule(missingMasterFieldForm);
		Assert.assertEquals(problems.size(), EXPECTED_MISSING_MASTER_PROBLEMS.length);
		Arrays.stream(EXPECTED_MISSING_MASTER_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testInvalidMasterValue() {
		final MeliesModel invalidMasterValueForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormInvalidMasterValue.json");
		final List<Problem> problems = rule.executeRule(invalidMasterValueForm);
		Assert.assertEquals(problems.size(), EXPECTED_INVALID_MASTER_VALUE_PROBLEMS.length);
		Arrays.stream(EXPECTED_INVALID_MASTER_VALUE_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testNoCases() {
		final MeliesModel noCasesForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormNoCases.json");
		final List<Problem> problems = rule.executeRule(noCasesForm);
		Assert.assertEquals(problems.size(), EXPECTED_NO_CASES_PROBLEMS.length);
		Arrays.stream(EXPECTED_NO_CASES_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testInvalidGranularity() {
		final MeliesModel invalidGranularityForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormInvalidGranularity.json");
		final List<Problem> problems = rule.executeRule(invalidGranularityForm);
		Assert.assertEquals(problems.size(), EXPECTED_INVALID_GRANULARITY_PROBLEMS.length);
		Arrays.stream(EXPECTED_INVALID_GRANULARITY_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
