// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum LabelEnumType {
	Multilingual, Expression;

	public static LabelEnumType fromValue(final String v) {
		return valueOf(v);
	}

	public String getValue() {
		return name();
	}
}
