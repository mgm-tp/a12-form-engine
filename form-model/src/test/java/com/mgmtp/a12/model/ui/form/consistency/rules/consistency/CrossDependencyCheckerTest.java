// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.model.consistency.ConsistencyStatus;
import com.mgmtp.a12.model.consistency.ConsistencyValidator;
import com.mgmtp.a12.model.ui.form.consistency.general.ConsistencyValidatorTest;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

public class CrossDependencyCheckerTest extends ConsistencyValidatorTest {
	private static final String
		modelDirectory =
		"com/mgmtp/a12/model/ui/form/consistency/rules/consistency/cross-dependency-checker/";

	@BeforeClass
	public void setUp() throws Exception {
		checker = new ConsistencyValidator(new FileBasedPicusModelResolver(modelDirectory));
	}

	@Test
	public void testCheckDependentEnumerationAndDependentField() throws IOException {
		final ConsistencyStatus status = runValidation(modelDirectory + "form-model.json");
		assertThat(status.isValid(), is(false));
		assertThat(status.problems().get(0).getMessage(),
			equalTo(
				"The field [Id field_747fb] is part of a dependent enumeration and a dependent field with \"Value\", or \"Field Value\". The behavior of the combination is not defined."));
		assertThat(status.problems().get(1).getMessage(),
			equalTo(
				"The field [Id field_8391e] is part of a dependent enumeration and a dependent field with \"Value\", or \"Field Value\". The behavior of the combination is not defined."));
	}
}
