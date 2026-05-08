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
