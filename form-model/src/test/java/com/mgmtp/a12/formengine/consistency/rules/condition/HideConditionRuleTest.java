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
package com.mgmtp.a12.formengine.consistency.rules.condition;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.Arrays;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.Test;

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

	private static final String TEST_PACKAGE = "com/mgmtp/a12/formengine/consistency/rules/condition/";

	private final HideConditionRule rule = new HideConditionRule();

	@Test
	public void testInvalidMasterFieldType() {
		final FormModel invalidMasterTypeForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormInvalidMasterType.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = rule.execute(invalidMasterTypeForm, RuleTestHelper.createDocumentModelAccess(modelResolver, invalidMasterTypeForm));
		Assert.assertEquals(problems.size(), EXPECTED_INVALID_TYPE_PROBLEMS.length);
		Arrays.stream(EXPECTED_INVALID_TYPE_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testMissingMasterField() {
		final FormModel
			missingMasterFieldForm =
			ModelLoader.loadModel(TEST_PACKAGE + "TestFormMissingMasterField.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = rule.execute(missingMasterFieldForm, RuleTestHelper.createDocumentModelAccess(modelResolver, missingMasterFieldForm));
		Assert.assertEquals(problems.size(), EXPECTED_MISSING_MASTER_PROBLEMS.length);
		Arrays.stream(EXPECTED_MISSING_MASTER_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testInvalidMasterValue() {
		final FormModel invalidMasterValueForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormInvalidMasterValue.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = rule.execute(invalidMasterValueForm, RuleTestHelper.createDocumentModelAccess(modelResolver, invalidMasterValueForm));
		Assert.assertEquals(problems.size(), EXPECTED_INVALID_MASTER_VALUE_PROBLEMS.length);
		Arrays.stream(EXPECTED_INVALID_MASTER_VALUE_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testNoCases() {
		final FormModel noCasesForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormNoCases.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = rule.execute(noCasesForm, RuleTestHelper.createDocumentModelAccess(modelResolver, noCasesForm));
		Assert.assertEquals(problems.size(), EXPECTED_NO_CASES_PROBLEMS.length);
		Arrays.stream(EXPECTED_NO_CASES_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testInvalidGranularity() {
		final FormModel invalidGranularityForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormInvalidGranularity.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = rule.execute(invalidGranularityForm, RuleTestHelper.createDocumentModelAccess(modelResolver, invalidGranularityForm));
		Assert.assertEquals(problems.size(), EXPECTED_INVALID_GRANULARITY_PROBLEMS.length);
		Arrays.stream(EXPECTED_INVALID_GRANULARITY_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
