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
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.Matchers.equalTo;

public class MetadataReadonlyRuleTest {

	private static final String[] EXPECTED_ERRORS = {
		"The dependent field references the readonly metadata field [id: abc6a6767a60488754aace2accb73824_field_1169c, name: docRef].",
		"The external enumeration references the readonly metadata field [id: abc6a6767a60488754aace2accb73824_field_cfb40, name: modelReference]."
	};

	private MetadataReadonlyRule metadataDependencyRule;

	@BeforeClass
	public void setUp() {
		metadataDependencyRule = new MetadataReadonlyRule();
		metadataDependencyRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/consistency/metadata/"));
	}

	@Test
	public void testMetadataDependencies() {
		MeliesModel model = ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/consistency/metadata/Metadata-FM.json");
		List<Problem> problems = metadataDependencyRule.executeRule(model);

		assertThat(problems, hasSize(EXPECTED_ERRORS.length));
		for (String message : EXPECTED_ERRORS) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}
}
