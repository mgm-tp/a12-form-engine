// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
