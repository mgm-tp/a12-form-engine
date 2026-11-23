// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
