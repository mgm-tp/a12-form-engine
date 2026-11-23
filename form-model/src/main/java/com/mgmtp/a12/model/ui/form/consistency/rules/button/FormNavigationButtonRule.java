// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.button;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.ButtonType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.ScreenIdCollector;

import java.util.ArrayList;
import java.util.List;

/**
 * Check navigation/event button(s) parameters.
 * <p>
 * * Navigation buttons may only have parameters with name "target" or "validate"
 * * "target" parameters may only contain: "#previous", "#next" or a valid screen id
 * * Event buttons may only contain parameters with name "event"
 */
public class FormNavigationButtonRule implements FormModelConsistencyRule {

	private final ScreenIdCollector screenCollector = new ScreenIdCollector();

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final String modelName = model.getHeaderId();
		final List<String> screenIds = screenCollector.collectScreenIds(model);
		final NavigationButtonChecker navigationButtonChecker = new NavigationButtonChecker(modelName, screenIds);
		final EventButtonChecker eventButtonChecker = new EventButtonChecker(modelName);
		final LabelHiddenChecker labelHiddenChecker = new LabelHiddenChecker(modelName);


		final ModelVisitor visitor = new ModelVisitor() {

			@Override
			public boolean visitButton(final ButtonType button) {
				navigationButtonChecker.checkNavigationButton(button);
				eventButtonChecker.checkEventButton(button);
				labelHiddenChecker.checkLabelHidden(button);
				return true;
			}

		};
		new ModelWalker(visitor).acceptModel(model);

		final List<Problem> problems = new ArrayList<>();
		problems.addAll(navigationButtonChecker.getProblems());
		problems.addAll(eventButtonChecker.getProblems());
		problems.addAll(labelHiddenChecker.getProblems());

		return problems;
	}
}
