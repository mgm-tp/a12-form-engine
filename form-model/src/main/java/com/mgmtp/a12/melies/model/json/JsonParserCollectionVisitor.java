// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.json;

import com.mgmtp.a12.melies.model.types.CellType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.ScreenElementType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;

import java.util.List;

/**
 * Traverses the form model that was parsed from json and replaces all standard collection instances (ArrayList)
 * with NodeTreeList instances that manage parent pointers between form model elements.
 */
public class JsonParserCollectionVisitor extends ModelVisitor {

	public boolean visitScreen(final ScreenType screen) {
		final List<ScreenElementType> screenElements = screen.getScreenElements();
		screenElements.forEach(screenElementType -> screenElementType.setParentScreen(null));
		screen.unsetScreenElements();
		screen.getScreenElements().addAll(screenElements);
		return true;
	}

	public boolean visitSection(final SectionType section) {
		final List<ScreenElementType> screenElements = section.getScreenElement();
		screenElements.forEach(screenElementType -> screenElementType.setParent(null));
		section.unsetScreenElement();
		section.getScreenElement().addAll(screenElements);
		return true;
	}

	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		final List<RepeatOverviewColumnType> columns = repeat.getRepeatOverviewColumn();
		columns.forEach(column -> column.setParent(null));
		repeat.unsetRepeatOverviewColumn();
		repeat.getRepeatOverviewColumn().addAll(columns);
		return true;
	}

	public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
		final List<RepeatOverviewColumnType> columns = repeat.getRepeatOverviewColumn();
		columns.forEach(column -> column.setParent(null));
		repeat.unsetRepeatOverviewColumn();
		repeat.getRepeatOverviewColumn().addAll(columns);
		return true;
	}

	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		final List<RepeatOverviewColumnType> columns = repeat.getRepeatOverviewColumn();
		columns.forEach(column -> column.setParent(null));
		repeat.unsetRepeatOverviewColumn();
		repeat.getRepeatOverviewColumn().addAll(columns);
		return true;
	}

	public boolean visitControlGrid(final ControlGridType grid) {
		final List<RowType> rows = grid.getRow();
		rows.forEach(row -> row.setParent(null));
		grid.unsetRow();
		grid.getRow().addAll(rows);
		return true;
	}

	public boolean visitRow(final RowType row) {
		final List<CellType> cells = row.getCell();
		cells.forEach(cell -> cell.setParent(null));
		row.unsetCell();
		row.getCell().addAll(cells);
		return true;
	}

}
