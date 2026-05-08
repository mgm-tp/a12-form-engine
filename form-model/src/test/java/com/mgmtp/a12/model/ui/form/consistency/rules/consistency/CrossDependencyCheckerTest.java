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
