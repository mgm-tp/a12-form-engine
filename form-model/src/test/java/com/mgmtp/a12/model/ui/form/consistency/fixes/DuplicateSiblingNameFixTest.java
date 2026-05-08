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
