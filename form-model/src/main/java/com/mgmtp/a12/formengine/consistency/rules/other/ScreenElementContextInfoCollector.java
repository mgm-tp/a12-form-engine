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

import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.CustomScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Computes a map of all screen element id's in the given form model to their respective parent screen
 * and top level screen id's.
 */
class ScreenElementContextInfoCollector {

	public Map<String, ElementContextInfo> collectScreenElementContextInfos(
		final FormModel model,
		final DocumentModelAccess documentModelService
	) {
		final Map<String, ElementContextInfo> screenElements = new HashMap<>();

		final ModelVisitor visitor = new ModelVisitor() {
			private List<ScreenType> enteredScreens = new LinkedList<>();

			@Override
			public boolean visitSection(final SectionType section) {
				addScreenElement(section);
				return true;
			}

			@Override
			public boolean visitCustomScreenElement(final CustomScreenElementType customScreenElement) {
				addScreenElement(customScreenElement);
				return true;
			}

			@Override
			public boolean visitControlGrid(final ControlGridType grid) {
				addScreenElement(grid);
				return true;
			}

			private void addScreenElement(final ScreenElementType screenElement) {
				final String screenElementId = screenElement.getId();
				final ScreenType topLevelScreen = enteredScreens.size() > 0 ? enteredScreens.get(0) : null;
				final ScreenType parentScreen = enteredScreens.size() > 0 ? enteredScreens.get(enteredScreens.size() - 1) : null;

				screenElements.put(
					screenElementId,
					new ElementContextInfo(
						screenElement,
						topLevelScreen,
						parentScreen,
						documentModelService
					)
				);
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
		return screenElements;
	}

}
