// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class FormColumnIndexRuleTest {

	private final FormColumnIndexRule formColumnIndexRule = new FormColumnIndexRule();

	@Test
	public void checkColumnIndex() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/CompanyWithWrongControlGridColumn.json");
		final List<Problem> problems = formColumnIndexRule.executeRule(productForm);
		// @formatter:off
		assertThat(problems, hasSize(4));
		assertThat(problems,hasItem(hasProperty("message",equalTo("The element [control-3b2b9] exceeds for layout lg with offset [1] the defined maximum index [2] for the control grid [<Grid>DescriptionAndDate]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("The element [control-191f1] exceeds for layout lg with offset [1] the defined maximum index [4] for the control grid [<Grid>HQAddress]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("The element [control-ca162] exceeds for layout lg with offset [0] the defined maximum index [2] for the control grid [<Grid>SiteDescription]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("The element [control-95e49] exceeds for layout lg with offset [0] the defined maximum index [4] for the control grid [<Grid>SiteAddress]."))));
	}

}
