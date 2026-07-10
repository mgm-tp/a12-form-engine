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
package com.mgmtp.a12.formengine.model.types;

import java.io.Serializable;

public class TableStyleType implements Serializable {
	private static final long serialVersionUID = 5776584464965446474L;
	private Integer rowHeight;
	private Float actionColumnWidth;
	private Integer tableHeight;
	private Integer cardHeight;

	public Integer getRowHeight() {
		return rowHeight;
	}

	public void setRowHeight(final Integer rowHeight) {
		this.rowHeight = rowHeight;
	}

	public void unsetRowHeight() {
		this.rowHeight = null;
	}

	public boolean isRowHeightSet() {
		return this.rowHeight != null;
	}

	public Float getActionColumnWidth() {
		return actionColumnWidth;
	}

	public void setActionColumnWidth(final Float actionColumnWidth) {
		this.actionColumnWidth = actionColumnWidth;
	}

	public void unsetActionColumnWidth() {
		this.actionColumnWidth = null;
	}

	public boolean isActionColumnWidthSet() {
		return this.actionColumnWidth != null;
	}

	public Integer getTableHeight() {
		return tableHeight;
	}

	public void setTableHeight(final Integer tableHeight) {
		this.tableHeight = tableHeight;
	}

	public void unsetTableHeight() {
		this.tableHeight = null;
	}

	public boolean isTableHeightSet() {
		return this.tableHeight != null;
	}

	public Integer getCardHeight() {
		return cardHeight;
	}

	public void setCardHeight(final Integer cardHeight) {
		this.cardHeight = cardHeight;
	}

	public void unsetCardHeight() {
		this.cardHeight = null;
	}

	public boolean isCardHeightSet() {
		return this.cardHeight != null;
	}

	public TableStyleType withRowHeight(final Integer value) {
		setRowHeight(value);
		return this;
	}

	public TableStyleType withActionColumnWidth(final Float value) {
		setActionColumnWidth(value);
		return this;
	}

	public TableStyleType withTableHeight(final int value) {
		setTableHeight(value);
		return this;
	}

	public TableStyleType withCardHeight(final int value) {
		setCardHeight(value);
		return this;
	}
}
