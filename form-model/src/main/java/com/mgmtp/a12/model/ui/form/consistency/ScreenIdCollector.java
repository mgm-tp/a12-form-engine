// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;

import java.util.LinkedList;
import java.util.List;

/**
 * Collect all screen IDs from given {@link MeliesModel}.
 */
public class ScreenIdCollector {

	public List<String> collectScreenIds(final MeliesModel model) {
		final List<String> screenIds = new LinkedList<>();

		final ModelVisitor visitor = new ModelVisitor() {
			@Override
			public boolean visitScreen(final ScreenType screen) {
				final String screenId = screen.getId();
				screenIds.add(screenId);
				return true;
			}

		};
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());
		return screenIds;
	}

}
