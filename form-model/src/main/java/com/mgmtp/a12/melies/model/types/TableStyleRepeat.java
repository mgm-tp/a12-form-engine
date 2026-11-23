// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public interface TableStyleRepeat {
	public TableStyleType getTableStyle();

	public void setTableStyle(final TableStyleType tableStyle);

	public void unsetTableStyle();

	public boolean isTableStyleSet();

	public RepeatType withTableStyle(final TableStyleType value);
}
