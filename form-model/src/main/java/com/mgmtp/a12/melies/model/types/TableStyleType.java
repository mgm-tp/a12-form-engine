// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

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
