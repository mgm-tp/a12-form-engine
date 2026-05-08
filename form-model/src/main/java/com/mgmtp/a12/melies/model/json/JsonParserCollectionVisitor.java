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
