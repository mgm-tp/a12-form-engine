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
package com.mgmtp.a12.formengine.consistency.rules.metadata;

import com.mgmtp.a12.formengine.consistency.rules.common.metadata.UnknownLocaleChecker;
import com.mgmtp.a12.formengine.consistency.rules.language.FormLocalizationAdapter;
import com.mgmtp.a12.formengine.consistency.rules.language.LocalizedTextAdapter;
import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.ButtonType;
import com.mgmtp.a12.formengine.model.types.ConfirmationTextType;
import com.mgmtp.a12.formengine.model.types.ConfirmationTextsType;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.CustomScreenElementType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.ExpressionCellType;
import com.mgmtp.a12.formengine.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.Named;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.types.RowActionType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.types.TextCellType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

class LocaleModelVisitor extends ModelVisitor {

	private final UnknownLocaleChecker unknownLocaleChecker;

	public LocaleModelVisitor(final UnknownLocaleChecker unknownLocaleChecker) {
		this.unknownLocaleChecker = unknownLocaleChecker;
	}

	@Override
	public boolean visitControl(final ControlType control) {
		final String id = control.getId();
		check(FormLocalizationAdapter.adapterFor(control.getHint()), id, id);
		check(
				FormLocalizationAdapter
					.adapterFor(control.getLabel() != null ? control.getLabel().getMultilingualText() : null),
				id,
				id);
		return true;
	}

	@Override
	public boolean visitButton(final ButtonType button) {
		check(
				FormLocalizationAdapter
					.adapterFor(button.isButtonStylingSet() && button.getButtonStyling().getLabel() != null
						? button.getButtonStyling().getLabel().getMultilingualText()
						: null),
				button.getName(), button.getId());
		return true;
	}

	@Override
	public boolean visitButtonPanel(final ButtonPanelType panel) {
		check(
				FormLocalizationAdapter
					.adapterFor(panel.getTitle() != null ? panel.getTitle().getMultilingualText() : null),
				panel.getName(), panel.getId());
		return true;
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		check(
				FormLocalizationAdapter
					.adapterFor(grid.getTitle() != null ? grid.getTitle().getMultilingualText() : null),
				grid.getName(), grid.getId());
		return true;
	}

	@Override
	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		checkRepeat(repeat);
		return true;
	}

	@Override
	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		checkRepeat(repeat);
		return true;
	}

	@Override
	public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
		checkRepeat(repeat);
		return true;
	}

	@Override
	public boolean visitRow(final RowType row) {
		check(
				FormLocalizationAdapter
					.adapterFor(row.getTitle() != null ? row.getTitle().getMultilingualText() : null),
				row.getName(), row.getId());
		return true;
	}

	@Override
	public boolean visitScreen(final ScreenType screen) {
		final String name = screen.getName();
		final String id = screen.getId();
		check(
				FormLocalizationAdapter
					.adapterFor(screen.getTitle() != null ? screen.getTitle().getMultilingualText() : null),
				name,
				id);
		return true;
	}

	@Override
	public boolean visitSection(final SectionType section) {
		final String name = section.getName();
		final String id = section.getId();
		check(
				FormLocalizationAdapter
					.adapterFor(section.getTitle() != null ? section.getTitle().getMultilingualText() : null),
				name,
				id);
		return true;
	}

	@Override
	public boolean visitCustomScreenElement(final CustomScreenElementType customScreenElement) {
		final String name = customScreenElement.getName();
		final String id = customScreenElement.getId();
		check(
						FormLocalizationAdapter
								.adapterFor(customScreenElement.getTitle() != null ? customScreenElement.getTitle().getMultilingualText() : null),
						name,
						id);
		return true;
	}

	@Override
	public boolean visitTextCell(final TextCellType textCell) {
		check(
			FormLocalizationAdapter.adapterFor(textCell.getContent()),
			textCell.getName(),
			textCell.getId());
		return true;
	}

	@Override
	public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
		check(
				FormLocalizationAdapter
				.adapterFor(
					expressionCell.getLabel() != null ? expressionCell.getLabel().getMultilingualText() : null),
				expressionCell.getName(), expressionCell.getId());

		return true;
	}

	/**
	 * Checks the locales of the given texts, naming the element that holds them by its id where it has no name.
	 */
	private void check(final LocalizedTextAdapter texts, final String name, final String id) {
		unknownLocaleChecker.check(texts, elementName(name, id), id);
	}

	private static String elementName(final String name, final String id) {
		return StringUtils.defaultIfBlank(name, id);
	}

	private void checkRepeat(final RepeatType repeat) {
		final String name = repeat.getName();
		final String id = repeat.getId();

		check(
				FormLocalizationAdapter
					.adapterFor(repeat.getTitle() != null ? repeat.getTitle().getMultilingualText() : null),
				name,
				id);

		final List<RepeatOverviewColumnType> repeatOverviewColumns = repeat.getRepeatOverviewColumn();
		for (final RepeatOverviewColumnType repeatOverviewColumn : repeatOverviewColumns) {
			// the column owns its texts, so they are reported for the column and not for the repeat around it
			final String columnName = repeatOverviewColumn instanceof Named named ? named.getName() : null;
			check(
					FormLocalizationAdapter.adapterFor(
						repeatOverviewColumn.getLabel() != null ? repeatOverviewColumn.getLabel().getMultilingualText()
							: null),
					columnName,
					repeatOverviewColumn.getId());

			if (repeatOverviewColumn instanceof FieldBasedRepeatOverviewColumnType) {
				final FieldBasedRepeatOverviewColumnType fieldBasedColumn =
					(FieldBasedRepeatOverviewColumnType) repeatOverviewColumn;
				check(
					FormLocalizationAdapter.adapterFor(fieldBasedColumn.getHint()),
					columnName,
					fieldBasedColumn.getId());
			}
		}

		RepeatButtonLabelsLocaleCheck
			.checkLocales(unknownLocaleChecker, repeat.getButtonLabels(), elementName(name, id), id);

		final ConfirmationTextsType confirmationTexts = repeat.getConfirmationTexts();
		if (confirmationTexts != null) {
			if (confirmationTexts.isREMOVESet()) {
				final ConfirmationTextType removeConfirmation = confirmationTexts.getREMOVE();
				check(FormLocalizationAdapter.adapterFor(removeConfirmation
					.getMessage()), name, id);
				check(
					FormLocalizationAdapter.adapterFor(removeConfirmation.getTitle()),
					name,
					id);
			}
		}

		if (repeat.getRowActionGroup() != null) {
			for (final RowActionType rowActionType : repeat.getRowActionGroup().getAction()) {
				check(
					FormLocalizationAdapter.adapterFor(rowActionType.getConfirmation()),
					name,
					id);
				check(
						FormLocalizationAdapter.adapterFor(
								rowActionType.isButtonStylingSet() && rowActionType.getButtonStyling().getLabel() != null
								? rowActionType.getButtonStyling().getLabel().getMultilingualText()
								: null),
						name,
						id);
			}
		}
	}

}
