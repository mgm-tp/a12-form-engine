// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.button;

import com.mgmtp.a12.melies.model.types.ButtonStylingType;
import com.mgmtp.a12.melies.model.types.ButtonType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import org.apache.commons.lang3.StringUtils;

public class LabelHiddenChecker extends AbstractButtonChecker {

	public LabelHiddenChecker(String modelName) {
		super(modelName);
	}

	void checkLabelHidden(final ButtonType button) {
		final ButtonStylingType buttonStyling = button.getButtonStyling();
		if (buttonStyling != null
			&& buttonStyling.isLabelHidden()
			&& (!buttonStyling.isIconSet() || StringUtils.isBlank(buttonStyling.getIcon().getName()))) {
			problems.add(new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_BUTTON_INVALID_LABEL_HIDDEN_SET,
				new FormModelProblemSource(button.getId()),
				button.getName()));
		}
	}
}
