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
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import java.util.List;

import com.mgmtp.a12.melies.model.types.ButtonPanelType;
import com.mgmtp.a12.melies.model.types.ButtonType;
import com.mgmtp.a12.melies.model.types.ConfirmationTextType;
import com.mgmtp.a12.melies.model.types.ConfirmationTextsType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.melies.model.types.ExpressionCellType;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.RepeatButtonLabelsType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.types.RowActionType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.types.TextCellType;
import com.mgmtp.a12.melies.model.types.CustomScreenElementType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.model.ui.form.consistency.rules.common.metadata.UnknownLocaleChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.language.FormLocalizationAdapter;

class LocaleModelVisitor extends ModelVisitor {

	private final UnknownLocaleChecker unknownLocaleChecker;

	public LocaleModelVisitor(final UnknownLocaleChecker unknownLocaleChecker) {
		this.unknownLocaleChecker = unknownLocaleChecker;
	}

	@Override
	public boolean visitControl(final ControlType control) {
		final String id = control.getId();
		unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(control.getHint()), id);
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(control.getLabel() != null ? control.getLabel().getMultilingualText() : null),
				id);
		return true;
	}

	@Override
	public boolean visitButton(final ButtonType button) {
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(button.isButtonStylingSet() && button.getButtonStyling().getLabel() != null
						? button.getButtonStyling().getLabel().getMultilingualText()
						: null),
				button.getName());
		return true;
	}

	@Override
	public boolean visitButtonPanel(final ButtonPanelType panel) {
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(panel.getTitle() != null ? panel.getTitle().getMultilingualText() : null),
				panel.getName());
		return true;
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(grid.getTitle() != null ? grid.getTitle().getMultilingualText() : null),
				grid.getName());
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
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(row.getTitle() != null ? row.getTitle().getMultilingualText() : null),
				row.getName());
		return true;
	}

	@Override
	public boolean visitScreen(final ScreenType screen) {
		final String id = screen.getName();
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(screen.getTitle() != null ? screen.getTitle().getMultilingualText() : null),
				id);
		return true;
	}

	@Override
	public boolean visitSection(final SectionType section) {
		final String id = section.getName();
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(section.getTitle() != null ? section.getTitle().getMultilingualText() : null),
				id);
		return true;
	}

	@Override
	public boolean visitCustomScreenElement(final CustomScreenElementType customScreenElement) {
		final String id = customScreenElement.getName();
		unknownLocaleChecker
				.check(
						FormLocalizationAdapter
								.adapterFor(customScreenElement.getTitle() != null ? customScreenElement.getTitle().getMultilingualText() : null),
						id);
		return true;
	}

	@Override
	public boolean visitTextCell(final TextCellType textCell) {
		unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(textCell.getContent()), textCell.getName());
		return true;
	}

	@Override
	public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
				.adapterFor(
					expressionCell.getLabel() != null ? expressionCell.getLabel().getMultilingualText() : null),
				expressionCell.getName());

		return true;
	}

	private void checkRepeat(final RepeatType repeat) {
		final String id = repeat.getName();

		unknownLocaleChecker
			.check(
				FormLocalizationAdapter
					.adapterFor(repeat.getTitle() != null ? repeat.getTitle().getMultilingualText() : null),
				id);

		final List<RepeatOverviewColumnType> repeatOverviewColumns = repeat.getRepeatOverviewColumn();
		for (final RepeatOverviewColumnType repeatOverviewColumn : repeatOverviewColumns) {
			unknownLocaleChecker
				.check(
					FormLocalizationAdapter.adapterFor(
						repeatOverviewColumn.getLabel() != null ? repeatOverviewColumn.getLabel().getMultilingualText()
							: null),
					id);

			if (repeatOverviewColumn instanceof FieldBasedRepeatOverviewColumnType) {
				final FieldBasedRepeatOverviewColumnType fieldBasedColumn =
					(FieldBasedRepeatOverviewColumnType) repeatOverviewColumn;
				unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(fieldBasedColumn.getHint()), id);

			}
		}

		final RepeatButtonLabelsType buttonLabels = repeat.getButtonLabels();
		if (buttonLabels != null) {
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getADD()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCOMMIT_ADD()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getAPPLY()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getEDIT()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getREMOVE()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getVIEW()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCANCEL()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getRETURN()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getUP()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getDOWN()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCOPY()), id);
			unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCLOSE()), id);
		}

		final ConfirmationTextsType confirmationTexts = repeat.getConfirmationTexts();
		if (confirmationTexts != null) {
			if (confirmationTexts.isREMOVESet()) {
				final ConfirmationTextType removeConfirmation = confirmationTexts.getREMOVE();
				unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(removeConfirmation
					.getMessage()), id);
				unknownLocaleChecker.check(
					FormLocalizationAdapter.adapterFor(removeConfirmation.getTitle()),
					id);
			}
		}

		if (repeat.getRowActionGroup() != null) {
			for (final RowActionType rowActionType : repeat.getRowActionGroup().getAction()) {
				unknownLocaleChecker.check(FormLocalizationAdapter.adapterFor(rowActionType.getConfirmation()), id);
				unknownLocaleChecker
					.check(
						FormLocalizationAdapter.adapterFor(
								rowActionType.isButtonStylingSet() && rowActionType.getButtonStyling().getLabel() != null
								? rowActionType.getButtonStyling().getLabel().getMultilingualText()
								: null),
						id);
			}
		}
	}

}
