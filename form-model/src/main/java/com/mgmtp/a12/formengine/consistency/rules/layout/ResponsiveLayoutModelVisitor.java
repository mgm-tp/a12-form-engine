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
package com.mgmtp.a12.formengine.consistency.rules.layout;

import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.MultiColumnSectionType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;

import org.apache.commons.lang3.StringUtils;

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
