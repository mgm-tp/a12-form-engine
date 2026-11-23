// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
