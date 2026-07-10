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

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.MultiColumnSectionType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.SizedStringType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

class LayoutChecker {

	private final String modelName;

	private final List<Problem> layoutProblems = new ArrayList<>();

	public LayoutChecker(final String modelName) {
		this.modelName = modelName;
	}

	public List<Problem> getLayoutProblems() {
		return layoutProblems;
	}

	void checkMultiColumnLayout(final MultiColumnSectionType multicolumnSection, final String checkedElement) {
		final SizedStringType layout = multicolumnSection.getLayout();
		final int numberOfChildren = multicolumnSection.getScreenElement().size();
		checkLayout(layout, numberOfChildren, checkedElement, multicolumnSection.getId());
	}

	void checkControlGridLayout(final ControlGridType controlGrid, final String checkedElement) {
		if (controlGrid.isLayoutSet()) {
			final SizedStringType layout = controlGrid.getLayout();
			int maxCellsPerRow = 0;
			for (final RowType row : controlGrid.getRow()) {
				final int currentNumberOfCells = row.getCell().size();
				if (currentNumberOfCells > maxCellsPerRow) {
					maxCellsPerRow = currentNumberOfCells;
				}
			}
			checkLayout(layout, maxCellsPerRow, checkedElement, controlGrid.getId());
		}
	}

	private void checkLayout(
		final SizedStringType layout,
		final int numberOfChildren,
		final String checkedElement,
		final String checkedElementId) {
		final int[] layoutNumbersLg = parseNumbers(Optional.ofNullable(layout.getLg()).orElse("12"));

		// the number of columns is derived from the layout lg
		final int gridColumns = layoutNumbersLg.length;

		// there shouldn't be more columns than the layout lg allows
		checkNumberOfColumns(new int[numberOfChildren], layoutNumbersLg.length, checkedElement, checkedElementId, "lg");

		// only for lg the layout sum is checked. It must be <= 12.
		checkLgSum(layoutNumbersLg, checkedElement, checkedElementId);

		// the other layouts must have the same number of columns
		if (!StringUtils.isBlank(layout.getMd())) {
			final int[] layoutNumbersMd = parseNumbers(layout.getMd());
			checkNumberOfColumns(layoutNumbersMd, gridColumns, checkedElement, checkedElementId, "md");
		}

		if (!StringUtils.isBlank(layout.getSm())) {
			final int[] layoutNumbersSm = parseNumbers(layout.getSm());
			checkNumberOfColumns(layoutNumbersSm, gridColumns, checkedElement, checkedElementId, "sm");
		}
	}

	private void checkNumberOfColumns(
		final int[] columns,
		final int expectedColumns,
		final String checkedElement,
		final String checkedElementId,
		final String sizeClass
	) {
		if ((sizeClass.equals("lg") && columns.length > expectedColumns)
			|| (!sizeClass.equals("lg") && expectedColumns != columns.length)) {
			layoutProblems.add(new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_WRONG_LAYOUT_COLUMNS,
				new FormModelProblemSource(checkedElementId),
				checkedElement,
				sizeClass,
				expectedColumns,
				columns.length
			));
		}
	}

	private void checkLgSum(final int[] layoutNumbers, final String checkedElement, final String checkedElementId) {
		int sum = 0;
		for (final int layoutNumber : layoutNumbers) {
			sum += layoutNumber;
		}
		if (sum > 12) {
			layoutProblems.add(new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_WRONG_LAYOUT_SUM,
				new FormModelProblemSource(checkedElementId),
				checkedElement,
				sum
			));
		}
	}

	private int[] parseNumbers(final String layout) {
		return Arrays.stream(layout.split("-"))
			.map(Integer::parseInt)
			.mapToInt(x -> x)
			.toArray();
	}

}
