// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.controlgrid;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ExpressionCellType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ExpressionReferenceChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ModelElementInfo;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Optional;

/**
 * Expression cells must reference fields
 */
public class ExpressionCellFieldReferenceRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problems = new ArrayList<>();
		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);
		final ExpressionCellChecker checker = new ExpressionCellChecker(model, documentModelService);
		new ModelWalker(checker).acceptScreenGroupRootElement(model.getContent().getScreens());
		problems.addAll(checker.getProblems());

		return problems;
	}

	private static class ExpressionCellChecker extends ModelVisitor {

		private final List<Problem> problems = new ArrayList<>();
		private final Model model;
		private final DocumentModelAccess documentModelAccess;

		private final Deque<RepeatType> enteredRepeats;

		ExpressionCellChecker(final Model model, final DocumentModelAccess documentModelAccess) {
			this.model = model;
			this.documentModelAccess = documentModelAccess;

			enteredRepeats = new ArrayDeque<>();
		}

		@Override
		public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
			final String contextPath = getContextPath(enteredRepeats.peekFirst());

			problems.addAll(ExpressionReferenceChecker.checkExpression(
				((MeliesModel) model).getHeaderId(),
				documentModelAccess,
				ModelElementInfo.getElementInfo(expressionCell),
				false,
				expressionCell.getExpression(),
				contextPath
			));

			return true;
		}

		@Override
		public void enter(final Object obj) {
			if (obj instanceof RepeatType) {
				enteredRepeats.push((RepeatType) obj);
			}
		}

		@Override
		public void leave(final Object obj) {
			if (obj instanceof RepeatType) {
				enteredRepeats.pop();
			}
		}

		List<Problem> getProblems() {
			return problems;
		}

		private String getContextPath(final RepeatType repeat) {
			if (repeat != null) {
				final Optional<String> elementPath = documentModelAccess.getElementPath(repeat.getGroupRef());
				if (elementPath.isPresent()) {
					return elementPath.get() + "/";
				}
			}
			return "";
		}

	}
}
