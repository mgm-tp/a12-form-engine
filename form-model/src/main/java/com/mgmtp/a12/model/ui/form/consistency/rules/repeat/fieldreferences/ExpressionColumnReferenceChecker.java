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
