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

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.LabelEnumType;
import com.mgmtp.a12.melies.model.types.LabelType;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ExpressionReferenceChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ModelElementInfo;

import java.util.LinkedList;
import java.util.List;

public class LabelConsistencyChecker {
	private final String modelName;

	private final List<Problem> problems = new LinkedList<Problem>();

	public LabelConsistencyChecker(final String modelName) {
		this.modelName = modelName;
	}

	public void check(
		final Object modelElement,
		final LabelType labelType,
		final Model model,
		final DocumentModelAccess documentModelAccess,
		final String contextPath,
		final ModelElementInfo customElementInfo
	) {
		ModelElementInfo modelElementInfo = customElementInfo != null
			? customElementInfo
			: ModelElementInfo.getElementInfo(modelElement);

		if (labelType != null) {
			final LabelEnumType type = labelType.getType();
			final String typeOrId = customElementInfo != null ? customElementInfo.getType() : modelElementInfo.getId();

			// no type set
			if (type == null) {
				problems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_MISSING_LABEL_TYPE,
					new FormModelProblemSource(typeOrId),
					typeOrId
				));
			}

			// no text set
			if (!(labelType.isMultilingualTextSet() || labelType.isExpressionTextSet())) {
				problems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_MISSING_LABEL_TEXT,
					new FormModelProblemSource(typeOrId),
					typeOrId
				));
			}

			// wrong type
			if (
				type != null &&
					(
						("Multilingual".equals(type.getValue()) && labelType.isExpressionTextSet()) ||
							("Expression".equals(type.getValue()) && labelType.isMultilingualTextSet())
					)
			) {
				final String text = "Multilingual".equals(type.getValue()) ? "expressionText" : "multilingualText";
				problems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_WRONG_LABEL_TYPE,
					new FormModelProblemSource(typeOrId),
					typeOrId,
					text,
					type.getValue()
				));
			}

			// both texts set
			if (labelType.isMultilingualTextSet() && labelType.isExpressionTextSet()) {
				problems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_MULTILINGUAL_AND_EXPRESSION_LABEL_SET,
					new FormModelProblemSource(typeOrId),
					typeOrId
				));
			}

			if (labelType.isExpressionTextSet()) {
				problems.addAll(ExpressionReferenceChecker.checkExpression(
					((MeliesModel) model).getHeaderId(),
					documentModelAccess,
					modelElementInfo,
					true,
					labelType.getExpressionText(),
					contextPath
				));
			}
		}
	}

	public List<Problem> getProblems() {
		return problems;
	}
}
