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
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.showCommaSeparated;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.ReadonlyPresentationEnumType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.types.TableStyleType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.ElementReferenceFinder;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;

import java.util.List;

import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_NO_MULTI_SELECT_COLUMN;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_ROW_HEIGHT_GIVEN;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_UNNECESSARY;

public class ShowCommaSeparatedChecker extends AbstractRepeatChecker {

	private final MeliesModel model;
	private final ElementReferenceFinder finder;

	public ShowCommaSeparatedChecker(final MeliesModel model, final DocumentModelAccess documentModelAccess) {
		this.model = model;
		this.finder = new ElementReferenceFinder(documentModelAccess);
	}

	@Override
	public void executeChecker(final RepeatType repeat, final String checkedElement) {
		final List<FieldBasedRepeatOverviewColumnType> columns = repeat.getRepeatOverviewColumn().stream()
			.filter((column) -> column instanceof FieldBasedRepeatOverviewColumnType)
			.map(FieldBasedRepeatOverviewColumnType.class::cast)
			.filter(FieldBasedRepeatOverviewColumnType::isShowCommaSeparatedSet)
			.toList();

		final TableStyleType tableStyle = repeat.getTableStyle();
		for (final FieldBasedRepeatOverviewColumnType column : columns) {
			if (tableStyle != null && tableStyle.isRowHeightSet()) {
				repeatProblems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_ROW_HEIGHT_GIVEN,
					new FormModelProblemSource(repeat.getId()),
					column.getId(),
					repeat.getId(),
					repeat.getName()
				));
			}
		}

		if (repeat instanceof InlineRepeatType inlineRepeat) {
			for (final FieldBasedRepeatOverviewColumnType column : columns) {
				if (!isTextReadonlyPresentation(inlineRepeat, column)) {
					repeatProblems.add(new ConsistencyProblem(
						model.getHeaderId(),
						FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_UNNECESSARY,
						new FormModelProblemSource(column.getId()),
						column.getId(),
						repeat.getId(),
						repeat.getName()
					));
				}
			}
		}

		columns.stream()
			.filter((column) -> !finder.isMultiSelectGroup(column.getElementRef()))
			.forEach((column) -> repeatProblems.add(new ConsistencyProblem(
				model.getHeaderId(),
				FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_NO_MULTI_SELECT_COLUMN,
				new FormModelProblemSource(column.getId()),
				column.getId(),
				repeat.getId(),
				repeat.getName()
			)));
	}

	private boolean isTextReadonlyPresentation(
		final InlineRepeatType repeat,
		final FieldBasedRepeatOverviewColumnType column) {
		if (ReadonlyPresentationEnumType.TEXT.equals(column.getReadonlyPresentation())) {
			return true;
		}
		if (
			ReadonlyPresentationEnumType.TEXT.equals(repeat.getReadonlyPresentation())
				&& !column.isReadonlyPresentationSet()
		) {
			return true;
		}
		return ReadonlyPresentationEnumType.TEXT.equals(model.getContent().getInlineRepeatReadonlyPresentation())
			&& !repeat.isReadonlyPresentationSet()
			&& !column.isReadonlyPresentationSet();
	}
}
