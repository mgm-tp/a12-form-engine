// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum ScopeEnumType {

	ALWAYS("Always"),
	DISABLED_IN_EDIT_MODE("Disable Button in Edit Mode"),
	DISABLED_IN_READONLY_MODE("Disable Button in Readonly Mode"),
	HIDDEN_IN_EDIT_MODE("Hide Button in Edit Mode"),
	HIDDEN_IN_READONLY_MODE("Hide Button in Readonly Mode");

	private final String value;

	ScopeEnumType(final String v) {
		value = v;
	}

	public static ScopeEnumType fromValue(final String v) {
		for (final ScopeEnumType s : ScopeEnumType.values()) {
			if (s.value.equals(v)) {
				return s;
			}
		}
		throw new IllegalArgumentException(v);
	}

	public String getValue() {
		return value;
	}
}
