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
 * 1. Open-Source License - EUPL v1.2
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
package com.mgmtp.a12.formengine.consistency.rules.repeat;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.repeat.rowaction.DefaultRowActionRule;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.List;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class DefaultRowActionRuleTest {

	private List<Problem> problems;

	@BeforeClass
	public void setUp() {
		final DefaultRowActionRule defaultRowActionRule = new DefaultRowActionRule();

		final FormModel productForm =
			ModelLoader.loadModel("com/mgmtp/a12/formengine/consistency/rules/repeat/rowaction/TestForm.json");
		problems = defaultRowActionRule.execute(productForm, null);
	}

	@DataProvider
	public Object[][] expectedErrors() {
		return new Object[][] {
			{
				"The repeat [id: inlinerepeat-dc273, name: default-action-copy] is using an unsupported row action ('copy'). Only 'Edit' is supported."
			},
			{
				"The repeat [id: inlinerepeat-dc275, name: default-action-remove] is using an unsupported row action ('remove'). Only 'Edit' is supported."
			},
			{
				"The repeat [id: inlinerepeat-dc276, name: default-action-reorder] is using an unsupported row action ('reorder'). Only 'Edit' is supported."
			},
			{
				"The detached repeat [id: inlinerepeat-15357, name: default-action-unknown-rowaction] default row action refers to an unknown custom row action with event 'my-custom-event-2'."
			},
			{
				"The repeat [id: inlinerepeat-e44fe, name: default-action-unknown-event] is using an unsupported row action ('abc'). Only 'Edit' is supported."
			},
			{
				"The detached repeat [id: detachedrepeat-e4f30, name: default-action-event-with-confirmation] default row action refers to a custom row action with event 'my-custom-event-2' which defines a confirmation message."
			},
			{
				"The repeat [id: detachedrepeat-e4363, name: dr-download] is using an unsupported row action ('download'). Only 'Edit' is supported."
			},
			{
				"The repeat [id: embeddedrepeat-9cdc2, name: er_download-noMultiFileUpload] is using an unsupported row action ('download'). Only 'Edit' is supported."
			}
		};
	}

	@Test(dataProvider = "expectedErrors")
	public void fieldAndGroupReferencedInExpression(final String expectedError) throws Exception {
		assertThat(problems, hasSize(expectedErrors().length));
		assertThat(problems, hasItem(hasProperty("message", is(expectedError)))
		);
	}

}
