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
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.infinitescrolling;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.InfiniteScrollableRepeat;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.types.TableStyleType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatRule;

import java.util.List;

import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_CONFIG;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_NO_ROW_HEIGHT;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_PAGING;

public class InfiniteScrollingRule extends AbstractRepeatRule {

	@Override
	public AbstractRepeatChecker getRuleChecker(final MeliesModel model, final List<Problem> problems) {
		return new VirtualScrollingChecker(model.getHeaderId(), problems);
	}

	private static class VirtualScrollingChecker extends AbstractRepeatChecker {

		private final String modelName;
		private final List<Problem> problems;

		VirtualScrollingChecker(final String modelName, final List<Problem> problems) {
			this.modelName = modelName;
			this.problems = problems;
		}

		@Override
		public void executeChecker(final RepeatType repeat, final String checkedElement) {
			Boolean virtualScrolling = null;
			boolean tableHeightSet = false;
			Float actionColumnWidth = null;
			Integer rowHeight = null;
			Integer cardHeight = null;

			if (repeat instanceof InfiniteScrollableRepeat) {
				virtualScrolling = ((InfiniteScrollableRepeat) repeat).getInfiniteScrolling();
			}

			if (repeat.isTableStyleSet()) {
				final TableStyleType tableStyle = repeat.getTableStyle();
				actionColumnWidth = tableStyle.getActionColumnWidth();
				rowHeight = tableStyle.getRowHeight();
				cardHeight = tableStyle.getCardHeight();
				tableHeightSet = tableStyle.isTableHeightSet();
			}

			if (repeat.isPageSizeSet()
				&& (isVirtualScrolling(virtualScrolling) || tableHeightSet)) {
				problems.add(
					new ConsistencyProblem(
						modelName,
						FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_PAGING,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId(),
						repeat.getName()));
			} else if (isVirtualScrolling(virtualScrolling) ^ tableHeightSet) { // ^ -> xor
				// operator
				problems.add(
					new ConsistencyProblem(
						modelName,
						FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_CONFIG,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId(),
						repeat.getName()));
			}

			if (isVirtualScrolling(virtualScrolling) && rowHeight == null) {
				problems.add(
					new ConsistencyProblem(
						modelName,
						FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_NO_ROW_HEIGHT,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId(),
						repeat.getName()));
			}

			if (isVirtualScrolling(virtualScrolling) && actionColumnWidth != null) {
				final float width = actionColumnWidth;
				FormModelCategory errorMessage = null;
				if (0.3 > width) {
					errorMessage = FormModelCategory.FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_SMALL;
				}
				if (width * 10 % 1 != 0) {
					errorMessage = FormModelCategory.FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_MANY_DECIMAL_PLACES;
				}
				if (errorMessage != null) {
					repeatProblems.add(new ConsistencyProblem(
						modelName,
						errorMessage,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId(),
						repeat.getName()));
				}
			}
		}

		private boolean isVirtualScrolling(final Boolean input) {
			return input != null && input;
		}
	}
}
