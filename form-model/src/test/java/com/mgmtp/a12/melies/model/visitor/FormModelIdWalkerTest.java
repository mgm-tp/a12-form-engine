// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.visitor;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.InputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class FormModelIdWalkerTest {

	private static final String[] EXPECTED_IDS = new String[] {
		"footerBox",
		"next",
		"baggage-r1",
		"baggage-r2",
		"D4343",
		"screen2",
		"screen1",
		"baggage-type",
		"baggage-weight",
		"row1",
		"buttons",
		"fdfdf",
		"g1",
		"row3",
		"row2",
		"c1",
		"row5",
		"c2",
		"row4",
		"c3",
		"c4",
		"c5",
		"cgexample",
		"c6",
		"c7",
		"subHeaderBox",
		"erer",
		"baggage-cg",
		"iban",
		"bic",
		"fieldOverviewColumn-1",
		"fieldOverviewColumn-2",
		"expressionOverviewColumn-1"
	};

	@Test
	public void testAccept() throws Exception {
		final InputStream inputStream = FormModelIdWalkerTest.class.getResourceAsStream("/SampleMeliesModel.json");
		final MeliesModel model = ((MeliesModel) new FormModelJsonStreamSerializer().deserialize(inputStream));

		final Set<String> actual = new HashSet<>();
		new FormModelIdWalker(elem -> actual.add(elem.getId())).accept(model);

		final HashSet<String> expected = new HashSet<>(Arrays.asList(EXPECTED_IDS));

		Assert.assertEquals(actual, expected);
	}
}
