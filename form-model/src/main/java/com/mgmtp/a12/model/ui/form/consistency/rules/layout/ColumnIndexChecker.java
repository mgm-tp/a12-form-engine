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
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import com.mgmtp.a12.melies.model.types.CellType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.SizedStringType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class ColumnIndexChecker {

	private final String modelName;

	private final List<Problem> layoutProblems = new ArrayList<>();

	public ColumnIndexChecker(final String modelName) {
		this.modelName = modelName;
	}

	public void checkColumnIndex(final ControlGridType controlGrid, final String checkedElement) {
		final int numberOfColumns = getColumnCount(controlGrid);
		final List<RowType> gridRows = controlGrid.getRow();
		for (final RowType row : gridRows) {

			int usedTableColumnsLg = 0;
			int usedTableColumnsMd = 0;
			int usedTableColumnsSm = 0;

			final List<CellType> cells = row.getCell();
			for (final CellType cell : cells) {

				final int spanLg = Optional.ofNullable(cell.getSpan().getLg()).orElse(1);
				final int spanMd = Optional.ofNullable(cell.getSpan().getMd()).orElse(1);
				final int spanSm = Optional.ofNullable(cell.getSpan().getSm()).orElse(1);

				final int offsetLg = Optional.ofNullable(cell.getOffset().getLg()).orElse(0);
				final int offsetMd = Optional.ofNullable(cell.getOffset().getMd()).orElse(0);
				final int offsetSm = Optional.ofNullable(cell.getOffset().getSm()).orElse(0);

				usedTableColumnsLg += offsetLg + spanLg;
				usedTableColumnsMd += offsetMd + spanMd;
				usedTableColumnsSm += offsetSm + spanSm;

				if (usedTableColumnsLg > numberOfColumns) {
					addProblem(cell.getId(), "lg", offsetLg, numberOfColumns, checkedElement);
				}

				if (usedTableColumnsMd > numberOfColumns) {
					addProblem(cell.getId(), "md", offsetMd, numberOfColumns, checkedElement);
				}

				if (usedTableColumnsSm > numberOfColumns) {
					addProblem(cell.getId(), "sm", offsetSm, numberOfColumns, checkedElement);

				}
			}
		}
	}

	private void addProblem(
		final String cellId,
		final String sizeClass,
		final int offset,
		final int columns,
		final String checkedElement
	) {
		layoutProblems.add(new ConsistencyProblem(
			modelName,
			FormModelCategory.FORM_MODEL_WRONG_COLUMN_INDEX,
			new FormModelProblemSource(cellId),
			cellId,
			sizeClass,
			offset,
			columns,
			checkedElement
		));
	}

	public List<Problem> getLayoutProblems() {
		return layoutProblems;
	}

	private int getColumnCount(ControlGridType grid) {
		SizedStringType layout = grid.getLayout();

		if (layout != null) {
			String layoutLg = layout.getLg();
			return StringUtils.isBlank(layoutLg) ? 1 : layoutLg.split("-").length;
		}

		return 1;
	}
}
