// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.commons.io.IOUtils;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.annotations.Test;

import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;

public class MeliesModelJsonSerializerTest {

	@Test
	public void testRoundtrip() throws Exception {
		final String inputFileName = "JsonSerializerFormModel.json";
		try (final InputStream inputStream = MeliesModelJsonSerializerTest.class.getResourceAsStream(inputFileName)) {
			final String jsonString = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
			final MeliesModel model = new MeliesModelJsonSerializer().fromJsonString(jsonString);
			JSONAssert.assertEquals(jsonString, new FormModelJsonSerializer().serialize(model), true);
		}
	}

	@Test
	public void testEmptyModelLabel() throws Exception {
		final String inputFileName = "JsonSerializerEmptyLabelFormModel.json";
		try (final InputStream inputStream = MeliesModelJsonSerializerTest.class.getResourceAsStream(inputFileName)) {
			final String jsonString = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
			final MeliesModel model = new MeliesModelJsonSerializer().fromJsonString(jsonString);
			JSONAssert.assertEquals(jsonString, new FormModelJsonSerializer().serialize(model), true);
		}
	}
}
