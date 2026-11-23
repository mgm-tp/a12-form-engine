// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.MultiColumnSectionType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;

class LayoutModelVisitor extends ModelVisitor {

	private final LayoutChecker layoutChecker;

	public LayoutModelVisitor(final LayoutChecker layoutChecker) {
		this.layoutChecker = layoutChecker;
	}

	@Override
	public boolean visitSection(final SectionType section) {
		if (section instanceof MultiColumnSectionType) {
			final MultiColumnSectionType multiColumn = (MultiColumnSectionType) section;
			layoutChecker.checkMultiColumnLayout(multiColumn, section.getName());
		}
		return true;
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		layoutChecker.checkControlGridLayout(grid, grid.getName());
		return true;
	}

}
