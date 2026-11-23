// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.button;

import com.mgmtp.a12.melies.model.types.ButtonEnumType;
import com.mgmtp.a12.melies.model.types.ButtonType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

class EventButtonChecker extends AbstractButtonChecker {

	public EventButtonChecker(final String modelName) {
		super(modelName);
	}

	void checkEventButton(final ButtonType button) {
		final ButtonEnumType buttonType = button.getType();
		if (!ButtonEnumType.EVENT.equals(buttonType)) {
			return;
		}
		checkButtonTarget(button);
	}

	private void checkButtonTarget(final ButtonType button) {
		if (button.isTargetSet()) {
			problems.add(new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_EVENT_BUTTON_TARGET_SET,
				new FormModelProblemSource(button.getId()),
				button.getName()));
		}
	}
}
