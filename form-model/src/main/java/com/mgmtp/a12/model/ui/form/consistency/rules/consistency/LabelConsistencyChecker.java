// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
