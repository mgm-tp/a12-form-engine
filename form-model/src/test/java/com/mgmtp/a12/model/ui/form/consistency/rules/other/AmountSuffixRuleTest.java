// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class AmountSuffixRuleTest {

	private final AmountSuffixRule amountSuffixRule = new AmountSuffixRule();

	@BeforeClass
	public void setup() {
		amountSuffixRule.setModelResolver(new FileBasedPicusModelResolver(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/"));
	}

	@Test
	public void verifyAmountSuffixInvalidType() throws Exception {
		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelAmountSuffixInvalidType.json");

		final List<Problem> problems = amountSuffixRule.executeRule(form);

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", equalTo("Setting a dynamic global amount suffix is only allowed if the referenced document model field is of type Enumeration."))));
	}

	@Test
	public void verifyAmountSuffixMissingField() throws Exception {
		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelAmountSuffixMissingField.json");

		final List<Problem> problems = amountSuffixRule.executeRule(form);

		assertThat(problems, hasSize(1));
		assertThat(problems, hasItem(hasProperty("message", equalTo("The field [id: doesNotExist] set as the dynamic global amount suffix could not be resolved in document model [name: ProductDomain]."))));
	}

	@Test
	public void verifyAmountSuffixValidReference() throws Exception {
		final MeliesModel form = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/other/FormModelAmountSuffixValidReference.json");

		final List<Problem> problems = amountSuffixRule.executeRule(form);

		assertThat(problems, hasSize(0));
	}
}
