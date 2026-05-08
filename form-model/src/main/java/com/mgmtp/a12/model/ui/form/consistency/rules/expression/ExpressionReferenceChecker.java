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
package com.mgmtp.a12.model.ui.form.consistency.rules.expression;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class ExpressionReferenceChecker {

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
		final String contextPath
	) {
		final String expressionRef = isLabel
			? modelElementInfo.getType() + " expression label"
			: modelElementInfo.getType();

		final String dataContext = contextPath.endsWith("/")
			? contextPath
			: contextPath + "/";

		final List<Problem> problems = new ArrayList<>();

		final ExpressionChecker expressionChecker = new ExpressionChecker();
		final ExpressionResult expressionResult = expressionChecker.parse(expression);
		if (expressionResult.hasError()) {
			problems.add(new ConsistencyProblem(
				modelId,
				FormModelCategory.FORM_MODEL_EXPRESSION_SYNTAX,
				modelElementInfo.getId(),
				expressionRef,
				modelElementInfo.getId(),
				modelElementInfo.getName(),
				expressionResult.getErrorMessage()
			));
		} else {
			final Map<String, Problem> problemByPath = new HashMap<>();
			final List<ExpressionReference>
				references =
				extractExpressionReferences(expressionResult.getNode(), dataContext);
			references.forEach(ref -> {
				final IElement referencedElement = documentModelService.findElementByPath(ref.path).orElse(null);
				if (ref.type == Type.FIELD) {
					if (referencedElement instanceof IGroup && ((IGroup) referencedElement)
						.getUsageType()
						.isPresent()) {
						problemByPath.put(
							ref.path,
							new ConsistencyProblem(
								modelId,
								FormModelCategory.FORM_MODEL_EXPRESSION_FIELDREF_TO_GROUP,
								modelElementInfo.getId(),
								expressionRef,
								modelElementInfo.getId(),
								modelElementInfo.getName(),
								ref.path,
								((IGroup) referencedElement).getUsageType().get()
							));
					} else if (!(referencedElement instanceof IField)) {
						problemByPath.put(
							ref.path,
							new ConsistencyProblem(
								modelId,
								FormModelCategory.FORM_MODEL_EXPRESSION_FIELDREF,
								modelElementInfo.getId(),
								expressionRef,
								modelElementInfo.getId(),
								modelElementInfo.getName(),
								ref.path,
								dataContext
							));
					}
				} else if (ref.type == Type.GROUP) {
					if (referencedElement == null) {
						problemByPath.put(
							ref.path,
							new ConsistencyProblem(
								modelId,
								FormModelCategory.FORM_MODEL_EXPRESSION_INVALID_GROUP_REF,
								modelElementInfo.getId(),
								expressionRef,
								modelElementInfo.getId(),
								modelElementInfo.getName(),
								ref.path,
								dataContext
							));
					}
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

	private static List<ExpressionReference> extractExpressionReferences(
		final ExpressionNode node,
		final String currentPath
	) {
		final String context = currentPath.endsWith("/")
			? currentPath
			: currentPath + "/";
		final List<ExpressionReference> references = new ArrayList<>();
		if ("field".equals(node.getType()) || "case".equals(node.getType())) {
			references.add(new ExpressionReference(Type.FIELD, context + node.getName()));
		} else if ("group".equals(node.getType())) {
			references.add(new ExpressionReference(Type.GROUP, context + node.getName()));
		}
		final String childPath = "group".equals(node.getType())
			? context + node.getName()
			: context;
		for (final ExpressionNode childNode : node.getChildren()) {
			references.addAll(extractExpressionReferences(childNode, childPath));
		}
		return references;
	}

	private static boolean isLeastSpecificReference(
		final String current,
		final Iterable<String> references
	) {
		for (final String reference : references) {
			if (!current.equals(reference) && current.startsWith(reference)) {
				return false;
			}
		}
		return true;
	}
}
