// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.autoComplete;

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

public class TestRepeatAutoCompleteRule {
	private static final String[] AUTOCOMPLETE_EXPECTED_PROBLEMS = new String[] {
		"For the form model element [name: NumberField, id: fieldbasedrepeatoverviewcolumn_af679] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: DateField, id: fieldbasedrepeatoverviewcolumn_ed047] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: TimeField, id: fieldbasedrepeatoverviewcolumn_d8879] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: ConfirmField, id: fieldbasedrepeatoverviewcolumn_01b41] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: BooleanField, id: fieldbasedrepeatoverviewcolumn_d4d5d] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: EnumerationField, id: fieldbasedrepeatoverviewcolumn_fb3e6] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field.",
		"For the form model element [name: NumberTypeDef, id: fieldbasedrepeatoverviewcolumn_3a839] 'autoComplete' is set. This is only allowed for elements that reference a string/string-like field."
	};

	private static final String TEST_PACKAGE = "com/mgmtp/a12/model/ui/form/consistency/rules/repeat/autoComplete/";
	private final RepeatAutoCompleteRule rule = new RepeatAutoCompleteRule();

	@BeforeClass
	public void setUp() {
		rule.setModelResolver(new FileBasedPicusModelResolver(TEST_PACKAGE));
	}

	@Test
	public void testAutoCompleteCheck() {
		final MeliesModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestAutoComplete-form.json");
		final List<Problem> problems = rule.executeRule(productForm);
		Assert.assertEquals(problems.size(), AUTOCOMPLETE_EXPECTED_PROBLEMS.length);
		Arrays.stream(AUTOCOMPLETE_EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
