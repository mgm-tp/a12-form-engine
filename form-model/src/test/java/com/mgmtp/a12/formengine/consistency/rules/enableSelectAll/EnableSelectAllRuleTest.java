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
package com.mgmtp.a12.formengine.consistency.rules.enableSelectAll;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class EnableSelectAllRuleTest {
	private final EnableSelectAllRule enableSelectAllRule = new EnableSelectAllRule();

	@BeforeClass
	public void setup() {
	}

	@Test
	public void verifyEnableSelectAllRuleValid() {
		final FormModel productForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/enableSelectAll/FormModelValid.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/enableSelectAll/");
		final List<Problem> problems = enableSelectAllRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));

		assertThat(problems, hasSize(0));
	}

	@Test
	public void verifyEnableSelectAllRuleInvalidDataType() {
		final FormModel productForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/enableSelectAll/FormModelInvalidDataType.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/enableSelectAll/");
		final List<Problem> problems = enableSelectAllRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The 'select all' option is enabled for the model element [id: field_d6a97, name: stringField]. This is only permitted for the 'multi-select' datatype."))));
	}

	@Test
	public void verifyEnableSelectAllRuleInvalidExpostion() {
		final FormModel productForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/enableSelectAll/FormModelInvalidExposition.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/enableSelectAll/");
		final List<Problem> problems = enableSelectAllRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));

		assertThat(problems, hasSize(2));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The 'select all' option is enabled for the model element [id: group_42c62, name: multiSelectField1]. This is only permitted for the exposition full and inline."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The 'select all' option is enabled for the model element [id: groupimpl_56b70, name: multiSelectField1]. This is only permitted for the exposition full and inline."))));
	}
}
