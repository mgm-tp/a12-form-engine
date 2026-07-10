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
package com.mgmtp.a12.formengine.consistency.rules.other;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.DependentControlsType;
import com.mgmtp.a12.formengine.model.types.ScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Screen element ref may only point to control grids, sections, multi column sections or custom screen elements, that -
 * are on the same top-level screen as the control (not necessarily the same detail screen) and - have a compatible data
 * context with the control
 *
 * Indexed controls and their dependent screen elements always need to be on the same screen or detail screen.
 */
public class FormDependentControlRule implements ConsistencyRule {
	private final ScreenElementContextInfoCollector
		screenElementInfoCollector =
		new ScreenElementContextInfoCollector();

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) {
		final List<Problem> problems = new ArrayList<>();

		final Map<String, ElementContextInfo> screenElementContextInfo =
			screenElementInfoCollector.collectScreenElementContextInfos(model, documentModelAccess);
		final DependentControlReferenceChecker refChecker =
			new DependentControlReferenceChecker(model.getHeaderId(), screenElementContextInfo);

		final ModelVisitor visitor = new ModelVisitor() {
			private List<ScreenType> enteredScreens = new LinkedList<>();

			@Override
			public boolean visitControl(final ControlType control) {
				final DependentControlsType dependentControls = control.getDependentControls();
				if (dependentControls != null) {

					if (dependentControls.getScreenElement() == null
						|| dependentControls.getScreenElement().isEmpty()) {
						problems.add(new ConsistencyProblem(
							model.getHeader().getId(),
							FormModelCategory.FORM_MODEL_DEPENDENT_CONTROL_NO_SCREEN_ELEMENT,
							new FormModelProblemSource(control.getId()),
							control.getId()));
					}

					final List<String> parentIds = collectParentIds(control);

					final ScreenType topLevelScreen = enteredScreens.size() > 0 ? enteredScreens.get(0) : null;
					final ScreenType
						parentScreen =
						enteredScreens.size() > 0 ? enteredScreens.get(enteredScreens.size() - 1) : null;

					final List<Problem> referenceProblems =
						refChecker.checkScreenReferences(
							dependentControls,
							parentIds,
							control,
							new ElementContextInfo(
								control,
								topLevelScreen,
								parentScreen,
								documentModelAccess
							)
						);
					problems.addAll(referenceProblems);
				}
				return true;
			}

			@Override
			public void enter(final Object obj) {
				if (obj instanceof ScreenType) {
					enteredScreens.add((ScreenType) obj);
				}
			}

			@Override
			public void leave(final Object obj) {
				if (obj instanceof ScreenType) {
					enteredScreens.remove(enteredScreens.size() - 1);
				}
			}
		};
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());

		return problems;
	}

	private List<String> collectParentIds(final ControlType control) {
		final ControlGridType gridType = control.getParent();
		List<String> parentIds = new LinkedList<>();
		parentIds.add(control.getId());
		parentIds = traverseParent(gridType, parentIds);
		return parentIds;
	}

	private List<String> traverseParent(final ScreenElementType screenElement, final List<String> ids) {
		final ScreenElementType parent = screenElement.getParent();
		ids.add(screenElement.getId());
		if (parent != null) {
			return traverseParent(parent, ids);
		}
		return ids;

	}

}
