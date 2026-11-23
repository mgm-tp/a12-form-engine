// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
