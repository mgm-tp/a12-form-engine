// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum TextCellDecorationEnumType {
		INFO("info"),
		WARNING("warning"),
		ERROR("error"),
		SUCCESS("success");

	private final String value;

	TextCellDecorationEnumType(final String v) {
		value = v;
	}

	public static TextCellDecorationEnumType fromValue(final String v) {
		for (final TextCellDecorationEnumType c : TextCellDecorationEnumType.values()) {
			if (c.value.equals(v)) {
				return c;
			}
		}
		throw new IllegalArgumentException(v);
	}

	public String getValue() {
		return value;
	}

}
