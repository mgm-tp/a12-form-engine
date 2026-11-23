// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.rowaction;

import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.types.RowActionGroupType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;

import org.apache.commons.lang3.StringUtils;

class CustomRowActionsChecker extends AbstractRepeatChecker {

	private final String modelName;

	public CustomRowActionsChecker(final String modelName) {
		this.modelName = modelName;
	}

	@Override
	public void executeChecker(final RepeatType repeat, final String checkedElement) {
		final RowActionGroupType rowActionGroup = repeat.getRowActionGroup();
		if (rowActionGroup != null) {

			if (actionEventIsEmpty(rowActionGroup)) {
				repeatProblems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_CUSTOM_ROW_ACTIONS_MISSING_EVENT,
					new FormModelProblemSource(repeat.getId()),
					checkedElement
				));

			}
		}
	}

	private boolean actionEventIsEmpty(final RowActionGroupType rowActionGroup) {
		return rowActionGroup.getAction().stream().anyMatch(action -> StringUtils.isBlank(action.getEvent()));
	}

}
