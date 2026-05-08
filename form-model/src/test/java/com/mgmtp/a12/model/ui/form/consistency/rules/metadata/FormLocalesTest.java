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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import java.util.List;
import java.util.Locale;

import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

public class FormLocalesTest {

	private final FormLocalesRule formLanguages = new FormLocalesRule();

	@Test
	public void checkProperLanguages() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/LanguageTestForm.json");
		final List<Problem> problems = formLanguages.executeRule(productForm);
		assertThat(problems, empty());
	}

	@Test
	public void checkWrongLanguages() throws Exception {
		final MeliesModel productForm = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/metadata/LanguageTestForm.json");
		productForm.getHeader().getLocales().clear();
		productForm.getHeader().getLocales().add(Locale.JAPANESE);
		final List<Problem> problems = formLanguages.executeRule(productForm);

		assertThat(problems, hasSize(91));
		for (final String message : getExpectedMessages()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessages() {
		return new String[] {
			"Form model field [Screen1] contains text [Screen1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [Button] contains text [ScreenSubheaderButton] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [Button] contains text [ScreenFooterMajorButton] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [Button] contains text [ScreenFooterMinorButton] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [cse-1] contains text [cse-1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [sec-1] contains text [sec-1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [cg-1] contains text [cg-1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [null] contains text [text] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [TextCell] contains text [TextCell] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [control-e8014] contains text [Control Hint] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [control-e8014] contains text [Control Label] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ExpressionCell] contains text [ExpressionCell] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [mcs] contains text [mcs] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-column] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [ExpressionColumn] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-apply] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-commit-add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-edit] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-remove] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-view] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-cancel] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-returen] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-up] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-down] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-confirmation-message] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-confirmation-title] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-rowaction-message] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [dr-1] contains text [dr-1-rowaction-label] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [c-1] contains text [dr-1-control-hint] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [c-1] contains text [dr-1-control-label] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-column] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-apply] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-commit-add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-edit] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-remove] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-view] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-cancel] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-returen] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-up] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-down] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-confirmation-message] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-confirmation-title] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-rowaction-message] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [ir-1] contains text [ir-1-rowaction-label] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-column] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-apply] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-commit-add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-edit] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-remove] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-view] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-cancel] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-returen] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-up] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-down] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-confirmation-message] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-confirmation-title] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-rowaction-message] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [er-1] contains text [er-1-rowaction-label] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [bp-1] contains text [bp-1] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [b] contains text [b] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [header] contains text [TestModel] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [apply] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [commit-add] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [edit] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [remove] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [view] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [cancel] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [confirm] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [returen] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [up] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [down] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [copy] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [close] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [download] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [skip] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [replace] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-button-label] contains text [upload-as-copy] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-confirmation-message] contains text [confirmation-message] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [default-confirmation-title] contains text [confirmation-title] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [F123] contains text [text] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [F123] contains text [text] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [F234] contains text [Field Configuration Hint] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [F234] contains text [Field Configuration Label] in unexpected locale [de_DE]. Expected locales are [ja].",
			"Form model field [F234] contains text [Field Configuration Placeholder] in unexpected locale [de_DE]. Expected locales are [ja].", };
	}


}
