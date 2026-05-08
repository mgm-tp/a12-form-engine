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
package com.mgmtp.a12.melies.model.include;

import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;
import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class TestIncludeExpansion {

	@DataProvider(name = "provider")
	public Object[][] testData() {
		return new String[][] {
			new String[] { "section" },
			new String[] { "button-panel" },
			new String[] { "control-grid" },
			new String[] { "inline-repeat" },
			new String[] { "embedded-repeat" },
			new String[] { "detached-repeat" },
			new String[] { "multiple" },
			new String[] { "siblings" }
		};
	}

	@Test(dataProvider = "provider")
	public void run(final String testCase) throws IOException, JSONException {
		final var modelResolver = new TestFormModelResolver(testCase + "/");

		final var modelResult = modelResolver.resolveFormModel(testCase + "-include.melies");

		IncludeExpansion.expandIncludes(
			modelResult.formModel,
			modelResult.documentModelAccess,
			modelResolver
		);

		final var expandedModelString = new FormModelJsonSerializer().serialize(modelResult.formModel);

		final var expectedModelString = new String(
			getClass().getResourceAsStream(testCase + "/" + testCase + "-expected.melies.json").readAllBytes(),
			StandardCharsets.UTF_8
		);

		JSONAssert.assertEquals(expectedModelString, expandedModelString, true);
	}
}
