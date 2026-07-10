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
package com.mgmtp.a12.formengine.consistency.rules.button;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.ScreenIdCollector;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ButtonType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayList;
import java.util.List;

/**
 * Check navigation/event button(s) parameters.
 * <p>
 * * Navigation buttons may only have parameters with name "target" or "validate"
 * * "target" parameters may only contain: "#previous", "#next" or a valid screen id
 * * Event buttons may only contain parameters with name "event"
 */
public class FormNavigationButtonRule implements ConsistencyRule {

	private final ScreenIdCollector screenCollector = new ScreenIdCollector();

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) {
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
