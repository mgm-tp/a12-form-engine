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

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mgmtp.a12.expression.parser.ExpressionNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.CaseNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.FieldNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.GroupNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.MultilingualTextNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.RootNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.StringNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.TextNode;
import com.mgmtp.a12.expression.parser.ExpressionNode.TokenNode;
import com.mgmtp.a12.expression.parser.ExpressionParseResult;
import com.mgmtp.a12.expression.parser.NativeExpressionParser;

public final class ExpressionReferenceChecker {

	private static final NativeExpressionParser PARSER = new NativeExpressionParser();

	private enum Type {
		FIELD, GROUP
	}

	private record ExpressionReference(Type type, String path) {
	}

	public static List<Problem> checkExpression(
			final String modelId,
			final DocumentModelAccess documentModelService,
			final ModelElementInfo modelElementInfo,
			final boolean isLabel,
			final String expression,
			final String contextPath) {
		final String expressionRef = isLabel
				? modelElementInfo.getType() + " expression label"
				: modelElementInfo.getType();

		final String dataContext = contextPath.endsWith("/")
				? contextPath
				: contextPath + "/";

		final List<Problem> problems = new ArrayList<>();

		final ExpressionParseResult expressionResult = PARSER.parse(expression);
		if (expressionResult.hasError()) {
			problems.add(createProblem(modelId,
										FormModelCategory.FORM_MODEL_EXPRESSION_SYNTAX,
										modelElementInfo,
										expressionRef,
										expressionResult.errorMessage()));
		} else {
			final Map<String, Problem> problemByPath = new HashMap<>();
			final List<ExpressionReference> references = extractExpressionReferences(expressionResult.node(),
					dataContext);
			references.forEach(ref -> {
				final IElement referencedElement = documentModelService.findElementByPath(ref.path).orElse(null);
				FormModelCategory category = null;
				String errorMessage = null;
				if (ref.type == Type.FIELD) {
					if (referencedElement instanceof IGroup && ((IGroup) referencedElement)
							.getUsageType()
							.isPresent()) {
						category = FormModelCategory.FORM_MODEL_EXPRESSION_FIELDREF_TO_GROUP;
						errorMessage = ((IGroup) referencedElement).getUsageType().get();
					} else if (!(referencedElement instanceof IField)) {
						category = FormModelCategory.FORM_MODEL_EXPRESSION_FIELDREF;
						errorMessage = dataContext;
					}
				} else if (ref.type == Type.GROUP) {
					if (referencedElement == null) {
						category = FormModelCategory.FORM_MODEL_EXPRESSION_INVALID_GROUP_REF;
						errorMessage = dataContext;
					}
				}

				if (category != null && errorMessage != null) {
					problemByPath.put(
								ref.path,
								createProblem(modelId,
										category,
										modelElementInfo,
										expressionRef,
										ref.path,
										errorMessage));
				}
			});
			for (final Map.Entry<String, Problem> entry : problemByPath.entrySet()) {
				if (isLeastSpecificReference(entry.getKey(), problemByPath.keySet())) {
					problems.add(entry.getValue());
				}
			}
		}
		return problems;
	}

	private static ConsistencyProblem createProblem(final String modelId, final FormModelCategory category, final ModelElementInfo modelElementInfo, final String expressionRef, final Object... parameters) {
		final Object[] allParameters = new Object[3 + parameters.length];
		allParameters[0] = expressionRef;
		allParameters[1] = modelElementInfo.getId();
		allParameters[2] = modelElementInfo.getName();
		System.arraycopy(parameters, 0, allParameters, 3, parameters.length);
		return new ConsistencyProblem(modelId, category, FormModelProblemSource.involving(modelElementInfo.getId()), allParameters);
	}

	private static List<ExpressionReference> extractExpressionReferences(
			final ExpressionNode node,
			final String currentPath) {
		final String context = currentPath.endsWith("/")
				? currentPath
				: currentPath + "/";
		final List<ExpressionReference> references = new ArrayList<>();
		switch (node) {
			case FieldNode(String name) -> references.add(new ExpressionReference(Type.FIELD, context + name));
			case CaseNode(String name, var operation, var content, List<ExpressionNode> children) -> {
				references.add(new ExpressionReference(Type.FIELD, context + name));
				for (final ExpressionNode child : children) {
					references.addAll(extractExpressionReferences(child, context));
				}
			}
			case GroupNode(String name, var delimiter, List<ExpressionNode> children) -> {
				references.add(new ExpressionReference(Type.GROUP, context + name));
				final String childPath = context + name;
				for (final ExpressionNode child : children) {
					references.addAll(extractExpressionReferences(child, childPath));
				}
			}
			case RootNode(List<ExpressionNode> children) -> {
				for (final ExpressionNode child : children) {
					references.addAll(extractExpressionReferences(child, context));
				}
			}
			case MultilingualTextNode ignored -> {
				// TextNode children only carry locale/text strings, no nested references
			}
			case StringNode ignored -> {
			}
			case TokenNode ignored -> {
			}
			case TextNode ignored -> {
			}
		}
		return references;
	}

	private static boolean isLeastSpecificReference(
			final String current,
			final Iterable<String> references) {
		for (final String reference : references) {
			if (!current.equals(reference) && current.startsWith(reference)) {
				return false;
			}
		}
		return true;
	}
}
