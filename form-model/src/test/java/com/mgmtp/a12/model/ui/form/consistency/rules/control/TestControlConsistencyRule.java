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
package com.mgmtp.a12.model.ui.form.consistency.rules.control;

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
import static org.hamcrest.Matchers.*;

public class TestControlConsistencyRule {
	private static final String[] INDEX_EXPECTED_PROBLEMS = new String[] {
		"Control [id: control-c2659] has a numeric index, but its value is not an integer.",
		"Control [id: control-d55b6] has a semantic index, but the context group [id: group_fc257, name: repeat1] has no index field.",
		"Root context references a control [id: control-92726] with the field [id: field_30af7, name: field3] with incompatible granularity.",
		"Repeat [id: detachedrepeat-d625c, name: detached-repeat-repeat] references a control [id: control-ddec2] with the field [id: field_c2fe7, name: field4] with incompatible granularity.",
	};

	private static final String[] GRANULARITY_EXPECTED_PROBLEMS = new String[] {
		"Control [id: control-6fc5f] must not contain index information due to its granularity.",
		"Control [id: control-7908f] requires index information due to its granularity.",
		"Control [id: control-b6cc6] must not contain index information due to its granularity.",
		"Control [id: control-b326c] must not contain index information due to its granularity.",
		"Control [id: control-a6f41] requires index information due to its granularity."
	};

	private static final String[] AUTOCOMPLETE_EXPECTED_PROBLEMS = new String[] {
		"For the form model element [name: numberField, id: control_97904] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: dateTimeField, id: control_37c83] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: TypeDefNumber, id: control_ea984] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field."
	};

	private static final String TEST_PACKAGE = "com/mgmtp/a12/model/ui/form/consistency/rules/control/";
	private final ControlConsistencyRule rule = new ControlConsistencyRule();

	@BeforeClass
	public void setUp() {
		rule.setModelResolver(new FileBasedPicusModelResolver(TEST_PACKAGE));
	}

	@Test
	public void testIndexCheck() {
		final MeliesModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormWrongIndex.json");
		final List<Problem> problems = rule.executeRule(productForm);
		Assert.assertEquals(problems.size(), INDEX_EXPECTED_PROBLEMS.length);
		Arrays.stream(INDEX_EXPECTED_PROBLEMS).forEach(message -> {
			System.out.println(message);
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testGranularityCheck() {
		final MeliesModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestFormWrongGranularity.json");
		final List<Problem> problems = rule.executeRule(productForm);
		Assert.assertEquals(problems.size(), GRANULARITY_EXPECTED_PROBLEMS.length);
		Arrays.stream(GRANULARITY_EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}

	@Test
	public void testAutoCompleteCheck() {
		final MeliesModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestAutocompleteOnStringControls.json");
		final List<Problem> problems = rule.executeRule(productForm);
		Assert.assertEquals(problems.size(), AUTOCOMPLETE_EXPECTED_PROBLEMS.length);
		Arrays.stream(AUTOCOMPLETE_EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
