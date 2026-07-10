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
package com.mgmtp.a12.formengine.consistency.rules.controlgrid;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.Arrays;
import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class ExpressionCellFieldReferenceTest {

	private static final List<String> EXPECTED_ERRORS = Arrays.asList(
		"ExpressionCell [id: expressioncell-70de7, name: expr-1] is syntactically incorrect: [Expression parse error in: kontext(base)\n\t[TestField]\n}\nmissing '{' at '['].",
		"ExpressionCell [id: expressioncell-6260f, name: expr-2] refers to field '/TestField' which is not a valid field reference in its evaluation data context '/'.",
		"ExpressionCell [id: expressioncell-a0977, name: expr-3] uses a field reference to group [/base/GloballyAttachedFile, customType: attachment].",
		"ExpressionCell [id: expressioncell-3fd93, name: dr-expr-2] is syntactically incorrect: [Expression parse error in: kontext(base)\n\tkontext(RepGroup) {\n\t\t[FieldA] \" #\" [FieldB]\n\t}\n}\nmissing '{' at 'kontext'].",
		"ExpressionCell [id: expressioncell-7e256, name: dr-expr-3] uses a field reference to group [/base/RepGroup/RepeatedlyAttachedFile, customType: attachment].",
		"ExpressionCell [id: expressioncell-6978b, name: dr-expr-4] refers to field '/base/RepGroup/FieldC' which is not a valid field reference in its evaluation data context '/base/RepGroup/'.",
		"ExpressionCell [id: expressioncell_a9d34, name: dr-expr-5] refers to field '/base/RepGroup/DoesNotExist' which is not a valid field reference in its evaluation data context '/base/RepGroup/'."
	);
	private ExpressionCellFieldReferenceRule expressionCellFieldReferenceRule;

	@BeforeClass
	public void setUp() {
		expressionCellFieldReferenceRule = new ExpressionCellFieldReferenceRule();
	}

	@Test
	public void fieldAndGroupReferencedInExpression() throws Exception {
		final FormModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/formengine/consistency/rules/controlgrid/TestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(
			"com/mgmtp/a12/formengine/consistency/rules/controlgrid/");
		final List<Problem> problems = expressionCellFieldReferenceRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));

		assertThat(problems, hasSize(EXPECTED_ERRORS.size()));

		for (final String expectedError : EXPECTED_ERRORS) {
			assertThat(problems, hasItem(hasProperty("message", is(expectedError))));
		}
	}

}
