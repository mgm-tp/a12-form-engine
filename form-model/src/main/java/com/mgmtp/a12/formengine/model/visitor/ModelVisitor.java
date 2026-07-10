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
package com.mgmtp.a12.formengine.model.visitor;

import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.ButtonType;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.CustomCellType;
import com.mgmtp.a12.formengine.model.types.CustomScreenElementType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.ExpressionCellType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.FormModelContent;
import com.mgmtp.a12.formengine.model.types.HeaderFooterType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RowActionType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.types.TextCellType;

/**
 * Extension to the common form model visitor.
 */
@SuppressWarnings("UnusedParameters")
public abstract class ModelVisitor {

	boolean stopped = false;

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param content visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitContent(final FormModelContent content) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param screen visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitScreen(final ScreenType screen) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param section visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitSection(final SectionType section) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param repeat visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param repeat visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param grid visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitControlGrid(final ControlGridType grid) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param row visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitRow(final RowType row) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param control visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitControl(final ControlType control) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param textCell visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitTextCell(final TextCellType textCell) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param customCell visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitCustomCell(final CustomCellType customCell) { return true; }

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param customScreenElement visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitCustomScreenElement(final CustomScreenElementType customScreenElement) {
		return true;
	}

	public void enter(final Object obj) {
	}

	public void leave(final Object obj) {
	}

	public final boolean hasStopped() {
		return stopped;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param repeat visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param repeatColumn visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitRepeatOverviewColumn(final RepeatOverviewColumnType repeatColumn) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param panel visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitButtonPanel(final ButtonPanelType panel) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param headerFooter visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitHeaderFooter(final HeaderFooterType headerFooter) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param button visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitButton(final ButtonType button) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param expressionCell visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitExpressionCell(final ExpressionCellType expressionCell) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param action visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitRowAction(final RowActionType action) {
		return true;
	}

	/**
	 * Visits the given element. You can call stop() to end the visiting.
	 *
	 * @param fieldConfigurationEntry visited object
	 * @return false to just prevent from visiting into the children of the current node
	 */
	public boolean visitFieldConfigurationEntry(final FieldConfigurationEntryType fieldConfigurationEntry) {
		return true;
	}

	/**
	 * Call stop() to end the visiting, e.g. when you've found the element you were looking for.
	 *
	 * @return false to just prevent from visiting into the children of the current node
	 */
	protected boolean stop() {
		stopped = true;
		return false;
	}
}
