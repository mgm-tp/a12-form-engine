// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.form.expression;

import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ExpressionChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ExpressionNode;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ExpressionResult;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class ConsistencyCheckerExpressionTest {

	private static final ExpressionChecker checker = new ExpressionChecker();

	@Test
	public void testValidExpression() throws Exception {

		final ExpressionNode expectedNode = new ExpressionNode(
			"root",
			null,
			null,
			List.of(new ExpressionNode(
				"group",
				"inline",
				null,
				List.of(
					new ExpressionNode(
						"case",
						"rep01",
						"0",
						List.of(new ExpressionNode(
							"string",
							null,
							"x",
							List.of()
						))
					))
			))
		);

		final ExpressionResult result = checker.parse("kontext(inline) { case [rep01] = \"0\" { \"x\" } } ");
		assertThat(result.getNode(), equalTo(expectedNode));
		assertThat(result.getErrorMessage(), is(emptyOrNullString()));
	}

	@Test
	public void testInvalidExpression() throws Exception {
		final ExpressionResult result = checker.parse("kontext)inline) { case [rep01] = \"0\" { \"x\" } } ");
		assertThat(result.getErrorMessage(), startsWith("Expression parse error"));
		assertThat(result.getNode(), nullValue());
	}

}
