// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.ScreenElementType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.types.CustomScreenElementType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;

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
		final MeliesModel model,
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
