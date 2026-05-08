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
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.fieldreferences.ExpressionColumnFieldReferenceRule;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class ExpressionColumnTest {

	private ExpressionColumnFieldReferenceRule expressionColumnFieldReferenceRule;

	@BeforeClass
	public void setUp() {
		expressionColumnFieldReferenceRule = new ExpressionColumnFieldReferenceRule();
		expressionColumnFieldReferenceRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions/"));
	}

	@Test
	public void attachmentInExpression() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions/TestForm2.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);
		// @formatter:off
		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", is("ExpressionColumn [id: expressionrepeatoverviewcolumn-d1443, name: dr-expr-1] uses a field reference to group [/base/RepGroup/RepeatedlyAttachedFile, customType: attachment]."))));
	}

	@Test
	public void fieldAndGroupReferencedInExpression() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions"
								  + "/FormModel_fieldAndGroupInExpressionAndFieldBasedOverviewColumn.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void fieldAndGroupFromDifferentRepeatableGroupsReferencedInExpression() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions"
								  + "/FormModel_fieldAndGroupInExpressionFromDifferentRepeatableGroups.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", is("ExpressionColumn [id: expressionrepeatoverviewcolumn-34577, name: expr1] refers to field '/Group1/A/C' which is not a valid field reference in its evaluation data context '/Group1/A/'."))));
	}

	@Test
	public void fieldAndGroupAllContainedInMultipleRepeatableGroupsReferencedInExpression() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions"
								  + "/FormModel_fieldAndGroupInExpressionAllContainedInMultipleRepeatableGroups.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void fieldFromNonRepeatableGroupInExpression() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions/FormModel_fieldFromNonRepeatableGroupInExpression.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void nonRepeatableGroupInExpression() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions/FormModel_nonRepeatableGroupInExpression.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", is("ExpressionColumn [id: expressionrepeatoverviewcolumn-34577, name: expr1] refers to group '/Group1/A/TL' which is not a valid group reference in its evaluation data context '/Group1/A/'."))));
	}

	@Test
	public void fieldFromNonRepeatableGroupInFieldBasedOverviewColumn() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions"
								  + "/FormModel_fieldFromNonRepeatableGroupInFieldBasedOverviewColumn.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(0));
	}

	@Test
	public void invalidExpression() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions/FormModel_invalidExpression.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", is("ExpressionColumn [id: expressionrepeatoverviewcolumn-34577, name: expr1] is syntactically incorrect: [Expression parse error in: kontext]}NonRepeatable){[A]}\nmismatched input ']' expecting '(']."))));
	}

	@Test
	public void missingFieldAndGroupInExpressionAndFieldBasedOverviewColumn() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/expressions/FormModel_missingFieldAndGroupInExpression.json");
		final List<Problem> problems = expressionColumnFieldReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", is("ExpressionColumn [id: expressionrepeatoverviewcolumn-c428c, name: expr] refers to group '/TL/Repeatable/Group3' which is not a valid group reference in its evaluation data context '/TL/Repeatable/'."))));
	}
}
