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

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.CellType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.SizedIntegerType;
import com.mgmtp.a12.melies.model.types.SizedStringType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

/**
 * Checks that the offset and span of a cell each doesn't take up more than 12 grid slots in md and sm layouts
 */
public class FormOffsetSpanRule implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {

		final OffsetSpanModelVisitor visitor = new OffsetSpanModelVisitor(model.getHeaderId());
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());

		return visitor.getOffsetSpanProblems();
	}

	private static class OffsetSpanModelVisitor extends ModelVisitor {

		private final String modelName;
		private final List<Problem> offsetSpanProblems = new ArrayList<>();

		public OffsetSpanModelVisitor(final String modelName) {
			this.modelName = modelName;
		}

		@Override
		public boolean visitControlGrid(final ControlGridType grid) {
			checkControlGridOffsetsSpans(grid, grid.getName());
			return true;
		}

		public List<Problem> getOffsetSpanProblems() {
			return offsetSpanProblems;
		}

		private void checkControlGridOffsetsSpans(final ControlGridType controlGrid, final String checkedElement) {
			if (controlGrid.isLayoutSet()) {
				final SizedStringType layout = controlGrid.getLayout();

				checkSizeClassOffsetsSpans(new MdValueGetter(), controlGrid, layout, checkedElement);
				checkSizeClassOffsetsSpans(new SmValueGetter(), controlGrid, layout, checkedElement);
			}
		}

		private void checkSizeClassOffsetsSpans(
			final ValueGetter valueGetter,
			final ControlGridType controlGrid,
			final SizedStringType layout,
			final String checkedElement
		) {
			if (valueGetter.getLayoutValue(layout) != null) {
				final int[] layoutNumbers = parseNumbers(valueGetter.getLayoutValue(layout));
				for (final RowType row : controlGrid.getRow()) {
					final List<Integer> rowSpans = new ArrayList<>();
					final List<Integer> rowOffsets = new ArrayList<>();

					for (final CellType cell : row.getCell()) {
						final SizedIntegerType span = cell.getSpan();
						final SizedIntegerType offset = cell.getOffset();
						rowSpans.add(valueGetter.getSpanValue(span) != null
							? valueGetter.getSpanValue(span)
							: 1);
						rowOffsets.add(valueGetter.getOffsetValue(offset) != null
							? valueGetter.getOffsetValue(offset)
							: 0);
					}

					checkOffsetsSpans(layoutNumbers, rowSpans, rowOffsets, valueGetter.getSize(), checkedElement, row);
				}
			}
		}

		private void checkOffsetsSpans(
			final int[] layoutNumbers,
			final List<Integer> spans,
			final List<Integer> offsets,
			final String size,
			final String checkedElement,
			final RowType row
		) {
			try {
				int startIndex = 0;
				int endIndex = 0;
				for (int i = 0; i < spans.size(); i++) {
					final Integer currentOffset = offsets.get(i);
					final Integer currentSpan = spans.get(i);

					endIndex += currentOffset;

					final int offsetSum = IntStream.of(Arrays.copyOfRange(layoutNumbers, startIndex, endIndex)).sum();

					startIndex += currentOffset;
					endIndex += currentSpan;

					final int spanSum = IntStream.of(Arrays.copyOfRange(layoutNumbers, startIndex, endIndex)).sum();

					startIndex += currentSpan;

					final String cellId = row.getCell().get(i).getId();

					if (offsetSum > 12) {
						offsetSpanProblems.add(new ConsistencyProblem(
							modelName,
							FormModelCategory.FORM_MODEL_WRONG_LAYOUT_OFFSET_SUM,
							new FormModelProblemSource(cellId),
							cellId,
							checkedElement,
							size
						));
					}

					if (spanSum > 12) {
						offsetSpanProblems.add(new ConsistencyProblem(
							modelName,
							FormModelCategory.FORM_MODEL_WRONG_LAYOUT_SPAN_SUM,
							new FormModelProblemSource(cellId),
							cellId,
							checkedElement,
							size
						));
					}
				}
			} catch (final ArrayIndexOutOfBoundsException e) {
				// This can happen when the offsets and spans summed up are
				// larger than the number of columns in the layout.
				// This is caught by the FormColumnIndexRule.
			}
		}

		private int[] parseNumbers(final String layout) {
			return Arrays.stream(layout.split("-"))
				.map(Integer::parseInt)
				.mapToInt(x -> x)
				.toArray();
		}

		private interface ValueGetter {
			Integer getSpanValue(final SizedIntegerType span);

			Integer getOffsetValue(final SizedIntegerType offset);

			String getLayoutValue(final SizedStringType layout);

			String getSize();
		}

		private static class MdValueGetter implements ValueGetter {

			@Override
			public Integer getSpanValue(final SizedIntegerType span) {
				return span.getMd();
			}

			@Override
			public Integer getOffsetValue(final SizedIntegerType offset) {
				return offset.getMd();
			}

			@Override
			public String getLayoutValue(final SizedStringType layout) {
				return layout.getMd();
			}

			@Override
			public String getSize() {
				return "md";
			}
		}

		private static class SmValueGetter implements ValueGetter {

			@Override
			public Integer getSpanValue(final SizedIntegerType span) {
				return span.getSm();
			}

			@Override
			public Integer getOffsetValue(final SizedIntegerType offset) {
				return offset.getSm();
			}

			@Override
			public String getLayoutValue(final SizedStringType layout) {
				return layout.getSm();
			}

			@Override
			public String getSize() {
				return "sm";
			}
		}
	}

}
