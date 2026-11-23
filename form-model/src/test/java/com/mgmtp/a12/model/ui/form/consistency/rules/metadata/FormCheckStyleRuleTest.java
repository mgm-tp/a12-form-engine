// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class FormCheckStyleRuleTest {

	private final FormCheckStylesRule formCheckStylesRule = new FormCheckStylesRule();

	@Test
	public void checkStyles() throws Exception {
		final MeliesModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/model/ui/form/consistency/rules/metadata/Company.json");
		final List<Problem> problems = formCheckStylesRule.executeRule(productForm);
		assertThat(problems, empty());
	}

	@Test
	public void checkWrongStyles() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/CompanyWithWrongStyle.json");
		final List<Problem> problems = formCheckStylesRule.executeRule(productForm);
		// @formatter:off
		assertThat(problems, hasSize(9));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [<Section>Notes] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [<CustomScreenElement>Notes] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [<Grid>DescriptionAndDate] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [control-3b2b9] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [<Button>BasicInformation] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [Footer Button] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [Notes Repeat/event] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [InlineRepeat/test] contains unexpected style [WWW]. Expected styles are [[foo, bar]]."))));
		assertThat(problems,hasItem(hasProperty("message",equalTo("Form model field [fieldOverviewColumn-1] contains unexpected style [hans]. Expected styles are [[foo, bar]]."))));
	}

}
