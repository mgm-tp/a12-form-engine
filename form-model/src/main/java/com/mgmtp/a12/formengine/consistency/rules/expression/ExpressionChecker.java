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
package com.mgmtp.a12.formengine.consistency.rules.expression;

import java.util.ArrayList;
import java.util.List;

import com.mgmtp.a12.expression.parser.ExpressionNode.CaseNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.FieldNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.GroupNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.MultilingualTextNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.RootNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.StringNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.TextNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.TokenNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.TokenType;
import com.mgmtp.a12.expression.parser.ExpressionParseResult;
import com.mgmtp.a12.expression.parser.NativeExpressionParser;

/**
 * Kept for external consumers of the published API, translating the {@code expression-parser}
 * artifact's typed AST back into the flat {@link ExpressionNode} shape this class has always
 * returned. {@link ExpressionReferenceChecker} no longer uses this class; it walks the artifact's
 * AST directly, which is why the artifact's types never need to appear in this class's own
 * signature.
 */
public class ExpressionChecker {

	private static final NativeExpressionParser parser = new NativeExpressionParser();

	public ExpressionResult parse(final String input) {
		final ExpressionResult result = new ExpressionResult();
		final ExpressionParseResult parseResult = parser.parse(input);
		if (parseResult.hasError()) {
			result.setErrorMessage(parseResult.errorMessage());
		} else {
			result.setNode(convertToNode(parseResult.node()));
		}
		return result;
	}

	private static ExpressionNode convertToNode(final com.mgmtp.a12.expression.parser.ExpressionNode node) {
		return switch (node) {
			case RootNode(final List<com.mgmtp.a12.expression.parser.ExpressionNode> children) ->
				new ExpressionNode("root", null, null, convertChildren(children));
			case FieldNode(final String name) ->
				new ExpressionNode("field", name, null, List.of());
			case StringNode(final String content) ->
				new ExpressionNode("string", null, content, List.of());
			case GroupNode(
				final String name, final var delimiter,
				final List<com.mgmtp.a12.expression.parser.ExpressionNode> children
			) -> new ExpressionNode("group", name, null, convertChildren(children));
			case CaseNode(
				final String name, final var operation, final String content,
				final List<com.mgmtp.a12.expression.parser.ExpressionNode> children
			) -> new ExpressionNode("case", name, content, convertChildren(children));
			case MultilingualTextNode(final List<TextNode> children) ->
				new ExpressionNode("multilingualtext", null, null, convertTextChildren(children));
			case TextNode ignored ->
				new ExpressionNode("text", null, null, List.of());
			case TokenNode(final TokenType name) ->
				new ExpressionNode("token", tokenName(name), null, List.of());
		};
	}

	private static List<ExpressionNode> convertChildren(
		final List<com.mgmtp.a12.expression.parser.ExpressionNode> children
	) {
		final List<ExpressionNode> result = new ArrayList<>();
		for (final com.mgmtp.a12.expression.parser.ExpressionNode child : children) {
			result.add(convertToNode(child));
		}
		return result;
	}

	private static List<ExpressionNode> convertTextChildren(final List<TextNode> children) {
		final List<ExpressionNode> result = new ArrayList<>();
		for (final TextNode child : children) {
			result.add(convertToNode(child));
		}
		return result;
	}

	private static String tokenName(final TokenType type) {
		return switch (type) {
			case NEW_LINE -> "newline";
			case NEW_PARAGRAPH -> "newparagraph";
		};
	}
}
