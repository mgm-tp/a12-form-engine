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
package com.mgmtp.a12.formengine.consistency.rules.metadata;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.List;

import org.testng.annotations.Test;

public class FormSchemaVersionPatternTest {

	private FormSchemaVersionPatternRule schemaVersionRule = new FormSchemaVersionPatternRule();

	@Test
	public void checkSchemaVersion() throws Exception {
		final FormModel productForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/metadata/ProductForm.json");
		final List<Problem> problems = schemaVersionRule.execute(productForm, null);
		assertThat(problems, empty());
	}

	@Test
	public void checkWrongSchemaVersion() throws Exception {
		final FormModel productForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/metadata/ProductFormWrongVersion.json");
		final List<Problem> problems = schemaVersionRule.execute(productForm, null);
		assertThat(problems, hasSize(1));

		assertThat(problems.get(0).getMessage(),equalTo("Form model version 19.1.2.3 does not match proper version schema. A version following the pattern <number>.<number>.number> is expected."));
	}

}
