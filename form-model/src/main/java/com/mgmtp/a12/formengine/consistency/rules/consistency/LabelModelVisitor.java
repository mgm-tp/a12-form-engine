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
package com.mgmtp.a12.formengine.consistency.rules.consistency;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IGroup;

import com.mgmtp.a12.formengine.consistency.Granularity;
import com.mgmtp.a12.formengine.consistency.rules.expression.ModelElementInfo;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.ButtonType;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.ExpressionCellType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.FormModelContent;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.types.RowActionType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class LabelModelVisitor extends ModelVisitor {
	private final FormModel formModel;
	private final LabelConsistencyChecker checker;
	private final DocumentModelAccess documentModelAccess;

	private final List<RepeatType> enteredRepeats;

	public LabelModelVisitor(
		final FormModel formModel,
		final DocumentModelAccess documentModelAccess,
		final LabelConsistencyChecker checker
	) {
		this.formModel = formModel;
		this.checker = checker;
		this.documentModelAccess = documentModelAccess;
		enteredRepeats = new ArrayList<>();
	}

	@Override
	public boolean visitContent(final FormModelContent content) {
		checker.check(
			formModel,
			content.getSubtitle(),
			formModel,
			documentModelAccess,
			"",
			new ModelElementInfo(formModel.getHeader().getId(), "", "FormModel SubTitle")
		);
		return true;
	}

	@Override
	public boolean visitControl(final ControlType control) {
		final IElement element = documentModelAccess.findElementById(control.getElementRef()).orElse(null);

		if (element != null) {
			final String contextPath = getContextForDmElement(element);

			checker.check(control, control.getLabel(), formModel, documentModelAccess, contextPath, null);
		}

		return true;
	}

	@Override
	public boolean visitButton(final ButtonType button) {
		final String contextPath = getCurrentContextFromFmNesting();
		checker.check(
			button,
			button.isButtonStylingSet()
				? button.getButtonStyling().getLabel()
				: null,
			formModel,
			documentModelAccess,
			contextPath,
			null
		);
		return true;
	}

	@Override
	public boolean visitButtonPanel(final ButtonPanelType panel) {
		final String contextPath = getCurrentContextFromFmNesting();
		checker.check(panel, panel.getTitle(), formModel, documentModelAccess, contextPath, null);
		return true;
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		final String contextPath = getCurrentContextFromFmNesting();
		checker.check(grid, grid.getTitle(), formModel, documentModelAccess, contextPath, null);
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
		final String contextPath = getCurrentContextFromFmNesting();
		checker.check(row, row.getTitle(), formModel, documentModelAccess, contextPath, null);
		return true;
	}

	@Override
	public boolean visitScreen(final ScreenType screen) {
		final String contextPath = getCurrentContextFromFmNesting();
		checker.check(screen, screen.getTitle(), formModel, documentModelAccess, contextPath, null);
		return true;
	}

	@Override
	public boolean visitSection(final SectionType section) {
		final String contextPath = getCurrentContextFromFmNesting();
		checker.check(section, section.getTitle(), formModel, documentModelAccess, contextPath, null);
		return true;
	}

	@Override
	public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
		final String contextPath = getCurrentContextFromFmNesting();
		checker.check(expressionCell, expressionCell.getLabel(), formModel, documentModelAccess, contextPath, null);
		return true;
	}

	private void checkRepeat(RepeatType repeat) {
		final String outerContextPath = getParentContextFromFmNesting();
		final String innerContextPath = getCurrentContextFromFmNesting();

		checker.check(repeat, repeat.getTitle(), formModel, documentModelAccess, outerContextPath,
				null);

		final List<RepeatOverviewColumnType> columns = repeat.getRepeatOverviewColumn();
		for (final RepeatOverviewColumnType column : columns) {
			checker.check(
				column,
				column.getLabel(),
				formModel,
				documentModelAccess,
				outerContextPath,
				null
			);
		}

		if (repeat.getRowActionGroup() != null) {
			for (final RowActionType rowAction : repeat.getRowActionGroup().getAction()) {
				checker.check(
					rowAction,
					rowAction.isButtonStylingSet()
						? rowAction.getButtonStyling().getLabel()
						: null,
					formModel,
					documentModelAccess,
					innerContextPath,
					new ModelElementInfo("", rowAction.getEvent(), "RowAction in Repeat " + repeat.getId())
				);
			}
		}
	}

	@Override
	public boolean visitFieldConfigurationEntry(final FieldConfigurationEntryType fieldConfigurationEntry) {
		final IElement element = documentModelAccess.findElementById(fieldConfigurationEntry.getElementRef()).orElse(null);

		if (element != null) {
			final String contextPath = getContextForDmElement(element);

			checker.check(
				element,
				fieldConfigurationEntry.getLabel(),
				formModel,
				documentModelAccess,
				contextPath,
				null
			);
		}

		return true;
	}

	@Override
	public void enter(final Object obj) {
		if (obj instanceof RepeatType) {
			enteredRepeats.add((RepeatType) obj);
		}
	}

	@Override
	public void leave(final Object obj) {
		if (obj instanceof RepeatType) {
			enteredRepeats.remove(enteredRepeats.size() - 1);
		}
	}

	private RepeatType getAncestorRepeat(int index) {
		if (index >= 0) {
			return enteredRepeats.get(index);
		}

		return null;
	}

	private String getCurrentContextFromFmNesting() {
		return getContextFromFmNesting(enteredRepeats.size() - 1);
	}

	private String getParentContextFromFmNesting() {
		return getContextFromFmNesting(enteredRepeats.size() - 2);
	}

	private String getContextFromFmNesting(int index) {
		final RepeatType repeat = getAncestorRepeat(index);

		if (repeat != null) {
			final Optional<String> elementPath = documentModelAccess.getElementPath(repeat.getGroupRef());
			if (elementPath.isPresent()) {
				return elementPath.get() + "/";
			}
		}
		return "";
	}

	private String getContextForDmElement(final IElement element) {
		final Granularity granularity = Granularity.computeGranularity(element);
		final List<IGroup> repeatableGroups = granularity.getRepeatableGroups();

		return repeatableGroups.size() > 0
			? documentModelAccess.getElementPath(repeatableGroups.get(repeatableGroups.size() - 1).getId()).orElse("")
			: "";
	}
}
