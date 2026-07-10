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
package com.mgmtp.a12.formengine.consistency.rules.dependency;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.Arrays;
import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

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
	}

	@Test
	public void fieldAndGroupReferencedInExpression() throws Exception {
		final FormModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/formengine/consistency/rules/dependency/TestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/dependency/");
		final List<Problem> problems = dependentFieldTypeCompatibilityRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));

		assertThat(problems, hasSize(EXPECTED_ERRORS.size()));

		for (final String expectedError : EXPECTED_ERRORS) {
			assertThat(problems, hasItem(hasProperty("message", is(expectedError))));
		}
	}

}
