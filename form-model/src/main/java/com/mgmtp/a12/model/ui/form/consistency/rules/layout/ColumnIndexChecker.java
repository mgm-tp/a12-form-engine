// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
