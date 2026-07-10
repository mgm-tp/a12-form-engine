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
package com.mgmtp.a12.formengine.consistency.rules.exposition;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.Arrays;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.Test;

public class TestDataTypeExpositionMatchRule {

	private static final String[] EXPECTED_PROBLEMS = {
			"Element [id: field_6d86a, name: date1]: The exposition 'AUTOCOMPLETE' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/multi-select'.",
			"Element [id: fieldimpl_96942, name: date2]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: field_971be, name: bool4]: The exposition 'THUMBNAIL_OR_ICON' may only be used for elements of data type 'attachment'.",
			"Element [id: field_30a33, name: string6]: The exposition 'FULL' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'.",
			"Element [id: field_4e2ef, name: string7]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: field_06a12, name: string8]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: group_c2419, name: multiSelect4]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: group_0e490, name: attachment1]: The exposition 'THUMBNAIL_OR_ICON' is set in the control or field configuration. This exposition may only be used for columns.",
			"Element [id: field_53aff, name: date1]: The exposition 'INLINE' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'.",
			"Element [id: field_82994, name: date2]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: field_dd58a, name: bool4]: The exposition 'THUMBNAIL_OR_ICON' may only be used for elements of data type 'attachment'.",
			"Element [id: field_df89e, name: string6]: The exposition 'FULL' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'.",
			"Element [id: field_adbb2, name: string7]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: field_a76e0, name: string8]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: multi-select_1ffdd, name: multiSelect4]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: field_06a12, name: string8]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: field_a76e0, name: string8]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: field_6d86a, name: date1]: The exposition 'AUTOCOMPLETE' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/multi-select'.",
			"Element [id: fieldimpl_96942, name: date2]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: field_971be, name: bool4]: The exposition 'THUMBNAIL_OR_ICON' may only be used for elements of data type 'attachment'.",
			"Element [id: field_30a33, name: string6]: The exposition 'FULL' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'.",
			"Element [id: field_4e2ef, name: string7]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: group_c2419, name: multiSelect4]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: group_0e490, name: attachment1]: The exposition 'THUMBNAIL_OR_ICON' is set in the control or field configuration. This exposition may only be used for columns.",
			"Element [id: attachment_69b3f, name: attachment2]: The exposition 'THUMBNAIL_OR_ICON' is set in the control or field configuration. This exposition may only be used for columns.",
			"Element [id: field_53aff, name: date1]: The exposition 'INLINE' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'.",
			"Element [id: field_82994, name: date2]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: field_dd58a, name: bool4]: The exposition 'THUMBNAIL_OR_ICON' may only be used for elements of data type 'attachment'.",
			"Element [id: field_df89e, name: string6]: The exposition 'FULL' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'.",
			"Element [id: field_adbb2, name: string7]: The exposition 'COMPACT' may only be used for elements of data type 'enumeration/string (with ext. enumeration)/attachment'.",
			"Element [id: multi-select_1ffdd, name: multiSelect4]: The exposition 'AREA' may only be used for elements of data type 'string'.",
			"Element [id: attachment_e40e6, name: attachment2]: The exposition 'THUMBNAIL_OR_ICON' is set in the control or field configuration. This exposition may only be used for columns.",
			"Element [id: field_8c88a, name: confirm2]: The exposition 'BOOLEAN_SELECT' may only be used for elements of data type 'boolean'.",
			"Element [id: field_86623, name: confirm3]: The exposition 'FULL' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'.",
			"Element [id: field_cb015, name: confirm4]: The exposition 'INLINE' may only be used for elements of data type 'enumeration/boolean/string (with ext. enumeration)/multi-select'."
	};
	private static final String TEST_PACKAGE = "com/mgmtp/a12/formengine/consistency/rules/exposition/";
	private final DataTypeExpositionMatchRule dataTypeExpositionMatchRule = new DataTypeExpositionMatchRule();

	@Test
	public void testRule() {
		final FormModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = dataTypeExpositionMatchRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));
		Assert.assertEquals(problems.size(), EXPECTED_PROBLEMS.length);
		Arrays.stream(EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
