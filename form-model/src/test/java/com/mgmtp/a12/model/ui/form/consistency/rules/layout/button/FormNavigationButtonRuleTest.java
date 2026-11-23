// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout.button;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.button.FormNavigationButtonRule;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class FormNavigationButtonRuleTest {

	private final FormNavigationButtonRule formNavigationButtonRule = new FormNavigationButtonRule();

	@Test
	public void checkButtonRule() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/button/ProductFormWithWrongNavigationButtons.json");
		final List<Problem> problems = formNavigationButtonRule.executeRule(productForm);
		assertThat(problems, hasSize(6));
		for (final String message : expectedMessages()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] expectedMessages() {
		return new String[] {
			"For the event button [next3] a target has been set. This is only allowed for navigation buttons.",
			"The target parameter of navigation button [next] has an invalid value [screen2]. It is either one of the screens [screen-a050f] or the following constants [#previous,#next].",
			"The target parameter of navigation button [FormSubheaderButton] has an invalid value [invalidScreen1]. It is either one of the screens [screen-a050f] or the following constants [#previous,#next].",
			"The target parameter of navigation button [FormFooterButton] has an invalid value [invalidScreen2]. It is either one of the screens [screen-a050f] or the following constants [#previous,#next].",
			"The target parameter of navigation button [ScreenSubheaderNavigationButton] has an invalid value [invalidScreen3]. It is either one of the screens [screen-a050f] or the following constants [#previous,#next].",
			"The target parameter of navigation button [ScreenFooterNavigationButton] has an invalid value [invalidScreen4]. It is either one of the screens [screen-a050f] or the following constants [#previous,#next]."
		};
	}

}
