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
package com.mgmtp.a12.formengine.consistency.rules.repeat.columnWidth;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;

import com.mgmtp.a12.kernel.md.model.api.IGroup;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RepeatType;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

class RepeatColumnWidthChecker extends AbstractRepeatChecker {

	private final String modelName;
	private final DocumentModelAccess documentModelService;

	RepeatColumnWidthChecker(final String modelName, final DocumentModelAccess documentModelService) {
		this.modelName = modelName;
		this.documentModelService = documentModelService;
	}

	@Override
	public void executeChecker(final RepeatType repeat, final String checkedElement) {
		final Optional<IGroup> group = documentModelService.findGroupById(repeat.getGroupRef());
		if (!group.isPresent()) {
			// error will be covered by RepeatNestingRule
			return;
		}

		final List<RepeatOverviewColumnType> fieldColumns = repeat.getRepeatOverviewColumn()
			.stream()
			.filter(c -> c instanceof RepeatOverviewColumnType)
			.map(RepeatOverviewColumnType.class::cast)
			.collect(Collectors.toList());

		checkColumns(repeat, group.get(), fieldColumns);
	}

	private void checkColumns(
		final RepeatType repeat,
		final IGroup boundGroup,
		final List<RepeatOverviewColumnType> fieldColumns
	) {
		for (final RepeatOverviewColumnType fieldColumn : fieldColumns) {
			final float width = fieldColumn.getWidth();
			FormModelCategory errorMessage = null;
			if (0.3 > width) {
				errorMessage = FormModelCategory.FORM_MODEL_COLUMN_WIDTH_TOO_SMALL;
			}
			if (width * 10 % 1 != 0) {
				errorMessage = FormModelCategory.FORM_MODEL_COLUMN_WIDTH_TOO_MANY_DECIMAL_PLACES;
			}
			if (errorMessage != null) {
				repeatProblems.add(new ConsistencyProblem(
					modelName,
					errorMessage,
					new FormModelProblemSource(fieldColumn.getId()),
					fieldColumn.getId(),
					repeat.getId(),
					repeat.getName()
				));
			}

		}
	}
}
