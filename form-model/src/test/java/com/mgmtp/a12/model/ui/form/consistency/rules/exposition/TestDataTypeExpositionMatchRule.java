// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.exposition;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

import java.util.Arrays;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.general.FileBasedPicusModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

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
	private static final String TEST_PACKAGE = "com/mgmtp/a12/model/ui/form/consistency/rules/exposition/";
	private final DataTypeExpositionMatchRule dataTypeExpositionMatchRule = new DataTypeExpositionMatchRule();

	@BeforeClass
	public void setUp() {
		dataTypeExpositionMatchRule.setModelResolver(new FileBasedPicusModelResolver(TEST_PACKAGE));
	}

	@Test
	public void testRule() {
		final MeliesModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "TestForm.json");
		final List<Problem> problems = dataTypeExpositionMatchRule.executeRule(productForm);
		Assert.assertEquals(problems.size(), EXPECTED_PROBLEMS.length);
		Arrays.stream(EXPECTED_PROBLEMS).forEach(message -> {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		});
	}
}
