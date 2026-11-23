// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model;

import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;

import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.InputStream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.greaterThan;

public class MeliesModelTest {

	@Test
	public void loadSampleMeliesConfig() {
		final InputStream inputStream = MeliesModelTest.class.getResourceAsStream("/SampleMeliesModel.json");
		final MeliesModel meliesModel = (MeliesModel) new FormModelJsonStreamSerializer().deserialize(inputStream);

		Assert.assertNotNull(meliesModel);
		Assert.assertNotNull(meliesModel.getContent());
		assertThat(meliesModel.getContent().getScreens().size(), greaterThan(0));
	}
}
