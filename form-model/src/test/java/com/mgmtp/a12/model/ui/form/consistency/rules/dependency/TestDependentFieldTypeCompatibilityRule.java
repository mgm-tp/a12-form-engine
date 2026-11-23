// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.dependency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class TestDependentFieldTypeCompatibilityRule {

	private static final List<String> EXPECTED_ERRORS = Arrays.asList(
		"The dependent field definition on field [id: field_055de, name: NumberField] refers to a type-incompatible field [id: field_aeb18, name: ConfirmField] in the case for master value 'b'.",
		"The dependent field definition on field [id: field_055de, name: NumberField] refers to a type-incompatible field [id: field_3fd19, name: TimeField] in the case for master value 'c'.",

		"The dependent field definition on field [id: field_02790, name: DateField] refers to a type-incompatible field [id: field_3fd19, name: TimeField] in the case for master value 'a'.",
		"The dependent field definition on field [id: field_02790, name: DateField] refers to a type-incompatible field [id: field_8534b, name: StringTypeDefField] in the case for master value 'b'.",
		"The dependent field definition on field [id: field_02790, name: DateField] refers to a type-incompatible field [id: field_e742d, name: NumberTypeDefField] in the case for master value 'c'.",

		"The dependent field definition on field [id: field_38aaf, name: BooleanField] refers to a type-incompatible field [id: field_aeb18, name: ConfirmField] in the case for master value 'a'.",
		"The dependent field definition on field [id: field_38aaf, name: BooleanField] refers to a type-incompatible field [id: field_8534b, name: StringTypeDefField] in the case for master value 'b'.",
		"The dependent field definition on field [id: field_38aaf, name: BooleanField] refers to a type-incompatible field [id: field_242c4, name: EnumerationField] in the case for master value 'c'.",

		"The dependent field definition on field [id: field_fc743, name: StringField] refers to a type-incompatible field [id: field_38aaf, name: BooleanField] in the case for master value 'a'.",
		"The dependent field definition on field [id: field_fc743, name: StringField] refers to a type-incompatible field [id: field_02790, name: DateField] in the case for master value 'b'."
	);
	private DependentFieldTypeCompatibilityRule dependentFieldTypeCompatibilityRule;

	@BeforeClass
	public void setUp() {
		dependentFieldTypeCompatibilityRule = new DependentFieldTypeCompatibilityRule();
		dependentFieldTypeCompatibilityRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/dependency/"));
	}

	@Test
	public void fieldAndGroupReferencedInExpression() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/dependency/TestForm.json");
		final List<Problem> problems = dependentFieldTypeCompatibilityRule.executeRule(productForm);

		assertThat(problems, hasSize(EXPECTED_ERRORS.size()));

		for (final String expectedError : EXPECTED_ERRORS) {
			assertThat(problems, hasItem(hasProperty("message", is(expectedError))));
		}
	}

}
