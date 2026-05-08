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
