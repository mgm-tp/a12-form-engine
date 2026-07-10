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
package com.mgmtp.a12.formengine.consistency.rules.other;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.consistency.rules.dependency.FormDependencyRule;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class FormDependencyRuleTest {

	private final FormDependencyRule formDependencyRule = new FormDependencyRule();

	@BeforeClass
	public void setUp() throws Exception {
	}

	/**
	 * Tests, that a cyclic combination of dependencies and computations is not considered as a cycle
	 * if some of the dependencies are not relevant, i.e. they cannot change the value of the dependent
	 * field.
	 *
	 * Examples of irrelevant dependencies:
	 * - Field dependency, that set a field to read-only
	 * - a group dependency, that only hides the corresponding group
	 */
	@Test
	public void checkNoCycle() throws Exception {
		final FormModel formModel = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/cycleDetection/no-cycle-form.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/cycleDetection/");
		final List<Problem> problems = formDependencyRule.execute(formModel, RuleTestHelper.createDocumentModelAccess(modelResolver, formModel));

		assertThat(problems, hasSize(0));
	}

	/**
	 * Tests, that a cycle of field dependencies is correctly detected.
	 */
	@Test
	public void checkFieldDependencyCycle() throws Exception {
		final FormModel formModel = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/cycleDetection/field-dependency-cycle-form.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/cycleDetection/");
		final List<Problem> problems = formDependencyRule.execute(formModel, RuleTestHelper.createDocumentModelAccess(modelResolver, formModel));

		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo(
			"The model contains a cyclic reference between the following fields: "
			+ "Field [path: /root/g1/Enum1] referenced by Field Dependency -> "
			+ "Field [path: /root/g1/Enum3] referenced by Field Dependency -> "
			+ "Field [path: /root/g1/Enum2] referenced by Field Dependency."
		))));
	}

	/**
	 * Tests, that a cycle of enumeration dependencies is correctly detected.
	 */
	@Test
	public void checkEnumDependencyCycle() throws Exception {
		final FormModel formModel = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/cycleDetection/enum-dependency-cycle-form.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/cycleDetection/");
		final List<Problem> problems = formDependencyRule.execute(formModel, RuleTestHelper.createDocumentModelAccess(modelResolver, formModel));

		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo(
			"The model contains a cyclic reference between the following fields: "
			+ "Field [path: /root/g1/Enum1] referenced by Enumeration Dependency -> "
			+ "Field [path: /root/g1/Enum3] referenced by Enumeration Dependency -> "
			+ "Field [path: /root/g1/Enum2] referenced by Enumeration Dependency."
		))));
	}

	/**
	 * Tests, that a cycle of computations is correctly detected.
	 */
	@Test
	public void checkComputationCycle() throws Exception {
		final FormModel formModel = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/cycleDetection/computation-cycle-form.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/cycleDetection/");
		final List<Problem> problems = formDependencyRule.execute(formModel, RuleTestHelper.createDocumentModelAccess(modelResolver, formModel));

		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo(
			"The model contains a cyclic reference between the following fields: "
			+ "Field [path: /root/Boolean1] referenced by Computation [path: /root/Computation2] -> "
			+ "Field [path: /root/Boolean2] referenced by Computation [path: /root/Computation1]."
		))));
	}

	/**
	 * Tests, that a cycle of field and enumeration dependencies is correctly detected.
	 */
	@Test
	public void checkMixedDependencyCycle() throws Exception {
		final FormModel formModel = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/cycleDetection/mixed-dependency-cycle-form.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/cycleDetection/");
		final List<Problem> problems = formDependencyRule.execute(formModel, RuleTestHelper.createDocumentModelAccess(modelResolver, formModel));

		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo(
			"The model contains a cyclic reference between the following fields: "
				+ "Field [path: /root/g1/Boolean1] referenced by Field Dependency -> "
				+ "Field [path: /root/g1/Enum2] referenced by Enumeration Dependency -> "
				+ "Field [path: /root/g1/Enum1] referenced by Field Dependency -> "
				+ "Field [path: /root/g1/g2/Boolean] referenced by Field Dependency -> "
				+ "Field [path: /root/g1/Confirm1] referenced by Field Dependency -> "
				+ "Field [path: /root/g1/Boolean3] referenced by Field Dependency -> "
				+ "Field [path: /root/g1/Boolean2] referenced by Field Dependency."
		))));
	}

	/**
	 * Tests, that a cycle of field, enumeration dependencies and computations is correctly detected.
	 */
	@Test
	public void checkMixedCycle() throws Exception {
		final FormModel formModel = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/cycleDetection/mixed-cycle-form.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/cycleDetection/");
		final List<Problem> problems = formDependencyRule.execute(formModel, RuleTestHelper.createDocumentModelAccess(modelResolver, formModel));

		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo(
			"The model contains a cyclic reference between the following fields: "
				+ "Field [path: /root/Enum1] referenced by Computation [path: /root/Computation3] -> "
				+ "Field [path: /root/Enum5] referenced by Computation [path: /root/Computation2] -> "
				+ "Field [path: /root/Enum4] referenced by Enumeration Dependency -> "
				+ "Field [path: /root/Enum3] referenced by Field Dependency -> "
				+ "Field [path: /root/Enum2] referenced by Computation [path: /root/Computation1]."
		))));
	}

	/**
	 * Tests, that a cycle of field ref and computation is properly detected.
	 */
	@Test
	public void checkComputationDependencyFieldRefCycle() throws Exception {
		final FormModel formModel = ModelLoader.loadModel(
			"com/mgmtp/a12/formengine/consistency/rules/cycleDetection/computation-dependency-fieldref-cycle-form.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/cycleDetection/");
		final List<Problem> problems = formDependencyRule.execute(formModel, RuleTestHelper.createDocumentModelAccess(modelResolver, formModel));

		assertThat(problems, hasSize(1));
		assertThat(problems,hasItem(hasProperty("message",equalTo(
			"The model contains a cyclic reference between the following fields: "
				+ "Field [path: /root/DependentField] referenced by Field Dependency -> "
				+ "Field [path: /root/RefField] referenced by Computation [path: /root/ComputeRefFieldFromDependentField]."
		))));
	}
}
