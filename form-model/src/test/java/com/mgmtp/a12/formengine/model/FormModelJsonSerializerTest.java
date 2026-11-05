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
package com.mgmtp.a12.formengine.model;

import com.mgmtp.a12.formengine.serialization.FormModelJsonSerializer;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.annotations.Test;
import tools.jackson.core.JacksonException;

public class FormModelJsonSerializerTest {

	@Test
	public void testRoundtrip() throws Exception {
		final String jsonString = readResource("JsonSerializerFormModel.json");
		assertReserializesTo(jsonString, jsonString);
	}

	@Test
	public void testEmptyModelLabel() throws Exception {
		final String jsonString = readResource("JsonSerializerEmptyLabelFormModel.json");
		assertReserializesTo(jsonString, jsonString);
	}

	@Test
	public void testTrueMarkersRoundtrip() throws Exception {
		final String jsonString = readResource("JsonSerializerMarkersFormModel.json");
		assertReserializesTo(jsonString, jsonString);
	}

	@Test
	public void testFalseMarkersAreDropped() throws Exception {
		final String jsonString = readResource("JsonSerializerMarkersFormModel.json").replace(": true", ": false");
		assertReserializesTo(jsonString, readResource("JsonSerializerUnsetMarkersFormModel.json"));
	}

	@Test(expectedExceptions = JacksonException.class)
	public void testNonBooleanMarkerIsRejected() throws Exception {
		final String jsonString = readResource("JsonSerializerMarkersFormModel.json")
			.replace("\"collapsible\": true", "\"collapsible\": \"x\"");
		new FormModelJsonSerializer().fromJsonString(jsonString);
	}

	private static void assertReserializesTo(final String inputJson, final String expectedJson) throws Exception {
		final FormModelJsonSerializer serializer = new FormModelJsonSerializer();
		final FormModel model = serializer.fromJsonString(inputJson);
		JSONAssert.assertEquals(expectedJson, serializer.serialize(model), true);
	}

	private static String readResource(final String fileName) throws IOException {
		try (final InputStream inputStream = FormModelJsonSerializerTest.class.getResourceAsStream(fileName)) {
			return IOUtils.toString(inputStream, StandardCharsets.UTF_8);
		}
	}
}
