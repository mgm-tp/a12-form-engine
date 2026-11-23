// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.Content;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.header.Header;
import com.mgmtp.a12.model.serialization.ModelSerializationProvider;
import com.mgmtp.a12.model.ui.form.FormModel;

public class TestSerializationProvider {

	private static final ModelSerializationProvider PROVIDER = new FormModelSerializationProvider();

	@Test
	public void testModelType() {
		Assert.assertEquals(PROVIDER.modelType(), FormModel.class);
	}

	@Test
	public void testSupports() {
		Assert.assertTrue(PROVIDER.supports(MeliesModel.class));
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



