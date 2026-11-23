// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;

import java.util.List;

/**
 * Checks that the column index is valid in defined columns for the control grid.
 *
 */
public class FormColumnIndexRule implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {

		final ColumnIndexChecker columnIndexChecker =
			new ColumnIndexChecker(model.getHeaderId());
		final ModelVisitor visitor = new ModelVisitor() {
			@Override
			public boolean visitControlGrid(final ControlGridType grid) {
				final String checkedElement = grid.getName();
				columnIndexChecker.checkColumnIndex(grid, checkedElement);
				return true;
			}
		};
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());

		return columnIndexChecker.getLayoutProblems();
	}

}
