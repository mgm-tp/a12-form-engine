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
package com.mgmtp.a12.model.ui.form.consistency.rules.name;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class TestDuplicateSiblingNameRule {

	private final DuplicateSiblingNameRule duplicateSiblingNameRule = new DuplicateSiblingNameRule();

	private final List<String> EXPECTED_MESSAGES = Arrays.asList(
		"The form model element [id: screen1, name: Screen1, type: ScreenType] has children with duplicate names: sec1.",
		"The form model element [id: section-d6612, name: sec1, type: SectionType] has children with duplicate names: cg1.",
		"The form model element [id: controlgrid-1c5e9, name: cg3, type: ControlGridType] has children with duplicate names: row1,row3.",
		"The form model element [id: row-aeb39, name: row1, type: RowType] has children with duplicate names: cell1.",
		"The form model element [id: section-eab10, name: sec1, type: SectionType] has children with duplicate names: mcs.",
		"The form model element [id: buttonpanel-b0683, name: mcs, type: ButtonPanelType] has children with duplicate names: button1.",
		"The form model element [id: inlinerepeat-5ae40, name: repeat1, type: InlineRepeatType] has children with duplicate names: expr1.",
		"The form model element [id: controlgrid-4e6be, name: cg2, type: ControlGridType] has children with duplicate names: dr-row1.",
		"The form model element [id: section-e6983, name: sec3, type: SectionType] has children with duplicate names: repeat1.",
		"The form model element [id: -, name: screens, type: ArrayList] has children with duplicate names: Screen1.",
		"The form model element [id: headerfooter-7cd4d, name: major buttons, type: HeaderFooterType] has children with duplicate names: shb.",
		"The form model element [id: headerfooter-5bfe1, name: major buttons, type: HeaderFooterType] has children with duplicate names: fmb.",
		"The form model element [id: headerfooter-5bfe1, name: minor buttons, type: HeaderFooterType] has children with duplicate names: fb.",
		"The form model element [id: subHeaderBox1, name: major buttons, type: HeaderFooterType] has children with duplicate names: button1.",
		"The form model element [id: footerBox1, name: minor buttons, type: HeaderFooterType] has children with duplicate names: button3.",
		"The form model element [id: footerBox1, name: major buttons, type: HeaderFooterType] has children with duplicate names: button5."
	);

	@Test
	public void verifyDuplicates() throws Exception {

		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/name/DuplicateNamesModel.json");
		final List<Problem> problems = duplicateSiblingNameRule.executeRule(productForm);

		Assert.assertFalse(problems.isEmpty());
		Assert.assertEquals(problems.size(), EXPECTED_MESSAGES.size());

		EXPECTED_MESSAGES.forEach(message -> assertThat(problems, hasItem(hasProperty("message", equalTo(message)))));

	}

	@Test
	public void verifyNoDuplicates() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/name/NoDuplicateNamesModel.json");

		Assert.assertTrue(duplicateSiblingNameRule.executeRule(productForm).isEmpty());
	}
}
