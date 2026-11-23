// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model;

import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.ExpressionRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;
import org.apache.commons.io.IOUtils;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class MarkdownExpressionTest {

	private static final String JSON = "MarkdownExpressionModel.json";

	@Test
	public void testMarkdownExpressions() throws Exception {
		final InputStream resourceAsStream = MarkdownExpressionTest.class.getResourceAsStream(JSON);
		final String stringJsonMeliesModel = IOUtils.toString(resourceAsStream, StandardCharsets.UTF_8);

		final MeliesModel model = (MeliesModel) new FormModelJsonSerializer().deserialize(stringJsonMeliesModel);

		final ScreenType screen = model.getContent().getScreens().get(0);
		final DetachedRepeatType detachedRepeat = (DetachedRepeatType) screen.getScreenElements().get(0);
		final ExpressionRepeatOverviewColumnType expressionColumn =
			(ExpressionRepeatOverviewColumnType) detachedRepeat.getRepeatOverviewColumn().get(0);

		Assert.assertEquals("abcde \"  \"\nfghij \"  \"\n#bold blubb", expressionColumn.getExpression());

		var actual = new FormModelJsonSerializer().serialize(model);

		JSONAssert.assertEquals(stringJsonMeliesModel, actual, true);
	}
}
