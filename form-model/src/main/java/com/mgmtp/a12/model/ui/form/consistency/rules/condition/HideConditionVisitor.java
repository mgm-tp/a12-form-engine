// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.condition;

import com.mgmtp.a12.melies.model.types.ButtonPanelType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.CustomCellType;
import com.mgmtp.a12.melies.model.types.CustomScreenElementType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.melies.model.types.ExpressionCellType;
import com.mgmtp.a12.melies.model.types.HideConditionType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.types.TextCellType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;

public class HideConditionVisitor extends ModelVisitor {
	private final HideConditionChecker hideConditionChecker;

	public HideConditionVisitor(final HideConditionChecker hideConditionChecker) {
		this.hideConditionChecker = hideConditionChecker;
	}

	@Override
	public boolean visitSection(final SectionType section) {
		if (section.isHideConditionSet()) {
			checkElement(section.getHideCondition(), section.getName(), section.getId(), section);
		}
		return super.visitSection(section);
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		if (grid.isHideConditionSet()) {
			checkElement(grid.getHideCondition(), grid.getName(), grid.getId(), grid);
		}
		return super.visitControlGrid(grid);
	}

	@Override
	public boolean visitButtonPanel(final ButtonPanelType panel) {
		if (panel.isHideConditionSet()) {
			checkElement(panel.getHideCondition(), panel.getName(), panel.getId(), panel);
		}
		return super.visitButtonPanel(panel);
	}

	@Override
	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		if (repeat.isHideConditionSet()) {
			checkElement(repeat.getHideCondition(), repeat.getName(), repeat.getId(), repeat);
		}
		return super.visitInlineRepeat(repeat);
	}

	@Override
	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		if (repeat.isHideConditionSet()) {
			checkElement(repeat.getHideCondition(), repeat.getName(), repeat.getId(), repeat);
		}
		return super.visitDetachedRepeat(repeat);
	}

	@Override
	public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
		if (repeat.isHideConditionSet()) {
			checkElement(repeat.getHideCondition(), repeat.getName(), repeat.getId(), repeat);
		}
		return super.visitEmbeddedRepeat(repeat);
	}

	@Override
	public boolean visitCustomScreenElement(final CustomScreenElementType customScreenElement) {
		if (customScreenElement.isHideConditionSet()) {
			checkElement(
				customScreenElement.getHideCondition(),
				customScreenElement.getName(),
				customScreenElement.getId(),
				customScreenElement);
		}
		return super.visitCustomScreenElement(customScreenElement);
	}

	@Override
	public boolean visitRow(final RowType row) {
		if (row.isHideConditionSet()) {
			checkElement(row.getHideCondition(), row.getName(), row.getId(), row);
		}
		return super.visitRow(row);
	}

	@Override
	public boolean visitControl(final ControlType control) {
		if (control.isHideConditionSet()) {
			checkElement(control.getHideCondition(), control.getId(), control.getId(), control);
		}
		return super.visitControl(control);
	}

	@Override
	public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
		if (expressionCell.isHideConditionSet()) {
			checkElement(
				expressionCell.getHideCondition(),
				expressionCell.getName(),
				expressionCell.getId(),
				expressionCell);
		}
		return super.visitExpressionCell(expressionCell);
	}

	@Override
	public boolean visitTextCell(final TextCellType textCell) {
		if (textCell.isHideConditionSet()) {
			checkElement(textCell.getHideCondition(), textCell.getName(), textCell.getId(), textCell);
		}
		return super.visitTextCell(textCell);
	}

	@Override
	public boolean visitCustomCell(final CustomCellType customCell) {
		if (customCell.isHideConditionSet()) {
			checkElement(customCell.getHideCondition(), customCell.getName(), customCell.getId(), customCell);
		}
		return super.visitCustomCell(customCell);
	}

	@Override
	public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {
		if (repeatColumn.isHideConditionSet()) {
			checkElement(repeatColumn.getHideCondition(), repeatColumn.getId(), repeatColumn.getId(), repeatColumn);
		}
		return super.visitRepeatOverviewColumn(repeatColumn);
	}

	private void checkElement(
		final HideConditionType condition,
		final String elementName,
		final String elementId,
		final Object element) {
		hideConditionChecker.checkCondition(condition, elementName, elementId, element);
	}
}
