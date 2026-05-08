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
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.fieldreferences.FieldColumnReferenceRule;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class FieldColumnTest {

	private List<Problem> problems;

	@BeforeClass
	public void setUp() {
		final FieldColumnReferenceRule fieldColumnReferenceRule = new FieldColumnReferenceRule();
		fieldColumnReferenceRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/repeat/fieldcolumn/"));

		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/repeat/fieldcolumn/FormModel.json");
		problems = fieldColumnReferenceRule.executeRule(productForm);

		assertThat(problems, hasSize(expectedErrors().length));
	}

	@DataProvider
	public Object[][] expectedErrors() {
		return new Object[][] {
			{
				"Column [id: foc-4] of repeat [id: ir-0, name: ir-0] references element [id: F4, name: Rep3_1] with "
				+ "incompatible granularity."
			}, {
				"Column [id: foc-6] of repeat [id: ir-0, name: ir-0] references element [id: F6, name: Rep2_3] with "
				+ "incompatible granularity."
			}, {
				"Column [id: foc-12] of repeat [id: ir-2, name: ir-2] references element [id: F6, name: Rep2_3] with "
				+ "incompatible granularity."
			},
			};
	}

	@Test(dataProvider = "expectedErrors")
	public void fieldAndGroupReferencedInExpression(final String expectedError) throws Exception {
		assertThat(problems, hasItem(hasProperty("message", is(expectedError))));
	}

}
