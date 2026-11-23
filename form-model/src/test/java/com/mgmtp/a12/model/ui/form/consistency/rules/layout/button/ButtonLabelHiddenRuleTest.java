// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout.button;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import java.util.List;

import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import com.mgmtp.a12.model.ui.form.consistency.rules.button.FormNavigationButtonRule;

public class ButtonLabelHiddenRuleTest {
	private final FormNavigationButtonRule formNavigationButtonRule = new FormNavigationButtonRule();

	@Test
	public void checkButtonRule() throws Exception {
		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/button/ButtonForm.json");
		final List<Problem> problems = formNavigationButtonRule.executeRule(form);
		assertThat(problems, hasSize(14));
		for (final String message : expectedMessages()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] expectedMessages() {
		return new String[] {
			"For the Button [button1] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button2] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button3] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button4] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button5] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button6] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button7] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button8] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button9] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button10] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button11] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button12] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button13] 'labelHidden' is set. This is only allowed if an icon is given.",
			"For the Button [button14] 'labelHidden' is set. This is only allowed if an icon is given.",
		};
	}
}
