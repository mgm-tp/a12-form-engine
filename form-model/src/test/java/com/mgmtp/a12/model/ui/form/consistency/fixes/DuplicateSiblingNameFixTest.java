// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.fixes;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.name.DuplicateSiblingNameRule;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;
import org.apache.commons.io.IOUtils;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class DuplicateSiblingNameFixTest {

	private static final String REFERENCE = "FixedDuplicateNamesModel.json";
	private final DuplicateSiblingNameFix duplicateSiblingNameFix = new DuplicateSiblingNameFix();
	private final DuplicateSiblingNameRule duplicateSiblingNameRule = new DuplicateSiblingNameRule();

	@Test
	public void fixDuplicates() throws Exception {

		final MeliesModel meliesModel =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/fixes/DuplicateNamesModel.json");

		Assert.assertFalse(duplicateSiblingNameRule.executeRule(meliesModel).isEmpty());

		duplicateSiblingNameFix.fix(meliesModel);

		Assert.assertTrue(duplicateSiblingNameRule.executeRule(meliesModel).isEmpty());

		final String fixedModelString = new FormModelJsonSerializer().serialize(meliesModel);

		final InputStream resourceAsStream = DuplicateSiblingNameFixTest.class.getResourceAsStream(REFERENCE);
		JSONAssert.assertEquals(
			IOUtils.toString(resourceAsStream, StandardCharsets.UTF_8),
			fixedModelString,
			true
		);
	}
}
