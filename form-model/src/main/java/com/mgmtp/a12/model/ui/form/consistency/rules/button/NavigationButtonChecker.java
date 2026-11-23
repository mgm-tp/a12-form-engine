// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.button;

import com.mgmtp.a12.melies.model.types.ButtonEnumType;
import com.mgmtp.a12.melies.model.types.ButtonType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

class NavigationButtonChecker extends AbstractButtonChecker {

	private static final List<String> TARGET_VALUES = Arrays.asList("#previous", "#next");

	private final List<String> screenIds;

	public NavigationButtonChecker(final String modelName, final List<String> screenIds) {
		super(modelName);
		this.screenIds = screenIds;
	}

	void checkNavigationButton(final ButtonType button) {
		final ButtonEnumType buttonType = button.getType();
		if (!ButtonEnumType.NAVIGATION.equals(buttonType)) {
			return;
		}
		checkButtonTarget(button);
		checkButtonEvent(button);
	}

	private void checkButtonTarget(final ButtonType button) {
		final String buttonTarget = button.getTarget();
		if (buttonTarget == null) {
			problems.add(new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_NAVIGATION_BUTTON_MISSING_TARGET,
				new FormModelProblemSource(button.getId()),
				button.getName()
			));
			return;
		}
		if ((!TARGET_VALUES.contains(buttonTarget)) && (!screenIds.contains(buttonTarget))) {
			problems.add(new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_NAVIGATION_BUTTON_WRONG_TARGET_VALUE,
				new FormModelProblemSource(button.getId()),
				button.getName(),
				buttonTarget,
				printCollection(screenIds),
				printCollection(TARGET_VALUES)
			));
		}
	}

	private void checkButtonEvent(final ButtonType button) {
		if (button.isEventSet()) {
			problems.add(new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_NAVIGATION_BUTTON_EVENT_SET,
				new FormModelProblemSource(button.getId()),
				button.getName()
			));
		}
	}

	private String printCollection(final Collection<String> values) {
		return StringUtils.join(values, ",");
	}
}
