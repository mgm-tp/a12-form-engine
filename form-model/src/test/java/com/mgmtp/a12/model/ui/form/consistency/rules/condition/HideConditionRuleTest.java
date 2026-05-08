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
