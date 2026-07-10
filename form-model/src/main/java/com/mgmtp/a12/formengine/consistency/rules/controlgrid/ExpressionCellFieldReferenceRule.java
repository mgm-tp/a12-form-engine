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
package com.mgmtp.a12.formengine.consistency.rules.controlgrid;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.ConsistencyValidationException;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.consistency.rules.expression.ExpressionReferenceChecker;
import com.mgmtp.a12.formengine.consistency.rules.expression.ModelElementInfo;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ExpressionCellType;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Optional;

/**
 * Expression cells must reference fields
 */
public class ExpressionCellFieldReferenceRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problems = new ArrayList<>();

		final ExpressionCellChecker checker = new ExpressionCellChecker(model, documentModelAccess);
		new ModelWalker(checker).acceptScreenGroupRootElement(model.getContent().getScreens());
		problems.addAll(checker.getProblems());

		return problems;
	}

	private static class ExpressionCellChecker extends ModelVisitor {

		private final List<Problem> problems = new ArrayList<>();
		private final FormModel formModel;
		private final DocumentModelAccess documentModelAccess;

		private final Deque<RepeatType> enteredRepeats;

		ExpressionCellChecker(final FormModel formModel, final DocumentModelAccess documentModelAccess) {
			this.formModel = formModel;
			this.documentModelAccess = documentModelAccess;

			enteredRepeats = new ArrayDeque<>();
		}

		@Override
		public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
			final String contextPath = getContextPath(enteredRepeats.peekFirst());

			problems.addAll(ExpressionReferenceChecker.checkExpression(
				formModel.getHeaderId(),
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
