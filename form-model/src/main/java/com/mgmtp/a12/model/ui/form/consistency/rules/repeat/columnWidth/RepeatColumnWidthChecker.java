// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.columnWidth;

import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;

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
