// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.controlgrid;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

import java.util.Arrays;
import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

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
		expressionCellFieldReferenceRule.setModelResolver(
			new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/controlgrid/"));
	}

	@Test
	public void fieldAndGroupReferencedInExpression() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/controlgrid/TestForm.json");
		final List<Problem> problems = expressionCellFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(EXPECTED_ERRORS.size()));

		for (final String expectedError : EXPECTED_ERRORS) {
			assertThat(problems, hasItem(hasProperty("message", is(expectedError))));
		}
	}

}
