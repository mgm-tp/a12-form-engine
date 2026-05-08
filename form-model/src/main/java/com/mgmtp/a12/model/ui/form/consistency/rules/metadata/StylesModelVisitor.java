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
 * 1. Open-Source License – EUPL v1.2
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
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.types.ButtonPanelType;
import com.mgmtp.a12.melies.model.types.ButtonType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.CustomScreenElementType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.types.RowActionGroupType;
import com.mgmtp.a12.melies.model.types.RowActionType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.ScreenElementType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.types.StyleType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;

import java.util.List;

class StylesModelVisitor extends ModelVisitor {

	private final StyleChecker styleChecker;

	public StylesModelVisitor(final StyleChecker styleChecker) {
		this.styleChecker = styleChecker;
	}

	@Override
	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		checkRowActionGroup(repeat);
		return visitScreenElement(repeat);
	}

	@Override
	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		checkRowActionGroup(repeat);
		return visitScreenElement(repeat);
	}

	@Override
	public boolean visitButtonPanel(final ButtonPanelType panel) {
		return visitScreenElement(panel);
	}

	@Override
	public boolean visitSection(final SectionType section) {
		return visitScreenElement(section);
	}

	@Override
	public boolean visitCustomScreenElement(final CustomScreenElementType customScreenElement) {
		return visitScreenElement(customScreenElement);
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		return visitScreenElement(grid);
	}

	@Override
	public boolean visitRow(final RowType row) {
		final List<StyleType> styles = row.getStyle();
		styleChecker.checkElementStyles(styles, row.getName(), row.getId());
		return true;
	}

	@Override
	public boolean visitControl(final ControlType control) {
		final List<StyleType> styles = control.getStyle();
		styleChecker.checkElementStyles(styles, control.getId(), control.getId());
		return true;
	}

	@Override
	public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {
		if (repeatColumn instanceof FieldBasedRepeatOverviewColumnType) {
			final FieldBasedRepeatOverviewColumnType
				fieldBasedRepeatOverviewColumn =
				(FieldBasedRepeatOverviewColumnType) repeatColumn;
			final List<StyleType> styles = fieldBasedRepeatOverviewColumn.getStyle();
			styleChecker.checkElementStyles(
				styles,
				fieldBasedRepeatOverviewColumn.getId(),
				fieldBasedRepeatOverviewColumn.getId());
		}
		return true;
	}

	@Override
	public boolean visitButton(final ButtonType button) {
		final List<StyleType> styles = button.isButtonStylingSet() ? button.getButtonStyling().getStyle() : null;
		styleChecker.checkElementStyles(styles, button.getName(), button.getId());
		return true;
	}

	private void checkRowActionGroup(final RepeatType repeat) {
		final String elementName = repeat.getName();
		final RowActionGroupType rowActionGroup = repeat.getRowActionGroup();
		if (rowActionGroup != null) {
			final List<RowActionType> actions = rowActionGroup.getAction();
			for (final RowActionType rowAction : actions) {
				final List<StyleType>
					styles =
					rowAction.isButtonStylingSet() ? rowAction.getButtonStyling().getStyle() : null;
				styleChecker.checkElementStyles(
					styles,
					String.format("%s/%s", elementName, rowAction.getEvent()),
					repeat.getId());
			}
		}
	}

	private boolean visitScreenElement(final ScreenElementType element) {
		final List<StyleType> styles = element.getStyle();
		styleChecker.checkElementStyles(styles, element.getName(), element.getId());
		return true;
	}

}
