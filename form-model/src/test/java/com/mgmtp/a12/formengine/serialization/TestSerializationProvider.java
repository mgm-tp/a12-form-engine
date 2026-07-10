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
package com.mgmtp.a12.formengine.serialization;

import com.mgmtp.a12.model.Content;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.header.Header;
import com.mgmtp.a12.model.serialization.ModelSerializationProvider;

import com.mgmtp.a12.formengine.model.FormModel;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

public class TestSerializationProvider {

	private static final ModelSerializationProvider PROVIDER = new FormModelSerializationProvider();

	@Test
	public void testModelType() {
		Assert.assertEquals(PROVIDER.modelType(), FormModel.class);
	}

	@Test
	public void testSupports() {
		Assert.assertTrue(PROVIDER.supports(FormModel.class));
		Assert.assertFalse(PROVIDER.supports(FakeModel.class));
	}

	@Test
	public void testIsModelJson() throws IOException {
		final String jsonContent =
			IOUtils.toString(getClass().getResourceAsStream("SampleForm.json"), StandardCharsets.UTF_8);
		Assert.assertTrue(PROVIDER.isModelJson(jsonContent));
	}

	@Test
	public void negativeTestIsModelJson() throws IOException {
		final String jsonContent =
			IOUtils.toString(getClass().getResourceAsStream("DocModel.json"), StandardCharsets.UTF_8);
		Assert.assertFalse(PROVIDER.isModelJson(jsonContent));
	}

	private static class FakeModel implements Model {

		@Override
		public Header getHeader() {
			return null;
		}

		@Override
		public Content getContent() {
			return null;
		}
	}
}
