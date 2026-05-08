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
