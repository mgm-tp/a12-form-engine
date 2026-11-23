// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import org.apache.commons.lang3.StringUtils;

import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.MultiColumnSectionType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;

public class ResponsiveLayoutModelVisitor extends ModelVisitor {

	private boolean responsiveLayouts;

	public boolean hasResponsiveLayouts() {
		return responsiveLayouts;
	}

	public void setResponsiveLayouts(final boolean responsiveLayouts) {
		this.responsiveLayouts = responsiveLayouts;
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		if (grid.isLayoutSet()
			&& (StringUtils.isNoneEmpty(grid.getLayout().getMd())
			|| StringUtils.isNoneEmpty(grid.getLayout().getSm()))) {
			setResponsiveLayouts(true);
			return stop();
		}
		return true;
	}

	@Override
	public boolean visitSection(final SectionType section) {
		if (section instanceof MultiColumnSectionType) {
			final MultiColumnSectionType multiColumn = (MultiColumnSectionType) section;

			if (multiColumn.isLayoutSet()
			&& (StringUtils.isNoneEmpty(multiColumn.getLayout().getMd())
			|| StringUtils.isNoneEmpty(multiColumn.getLayout().getSm()))) {
				setResponsiveLayouts(true);
				return stop();
			}
		}
		return true;
	}
}
