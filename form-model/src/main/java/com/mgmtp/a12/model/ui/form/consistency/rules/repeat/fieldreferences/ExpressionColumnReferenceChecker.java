// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.fieldreferences;

import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ExpressionRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ExpressionReferenceChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.expression.ModelElementInfo;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;

import java.util.Optional;
import java.util.stream.Stream;

class ExpressionColumnReferenceChecker extends AbstractRepeatChecker {

	private final MeliesModel model;
	private final DocumentModelAccess documentModelAccess;

	ExpressionColumnReferenceChecker(final MeliesModel model, final DocumentModelAccess documentModelAccess) {
		this.model = model;
		this.documentModelAccess = documentModelAccess;
	}

	@Override
	public void executeChecker(final RepeatType repeat, final String checkedElement) {
		final Optional<IGroup> group = documentModelAccess.findGroupById(repeat.getGroupRef());
		if (group.isEmpty()) {
			// error will be covered by RepeatNestingRule
			return;
		}

		getExpressionColumns(repeat).forEach(expressionColumn -> repeatProblems.addAll(ExpressionReferenceChecker.checkExpression(
			model.getHeaderId(),
			documentModelAccess,
			ModelElementInfo.getElementInfo(expressionColumn),
			false,
			expressionColumn.getExpression(),
			documentModelAccess.getElementPath(repeat.getGroupRef()).orElse("")
		)));
	}

	private Stream<ExpressionRepeatOverviewColumnType> getExpressionColumns(final RepeatType repeat) {
		return repeat.getRepeatOverviewColumn()
					 .stream()
					 .filter(ExpressionRepeatOverviewColumnType.class::isInstance)
					 .map(ExpressionRepeatOverviewColumnType.class::cast);
	}
}
