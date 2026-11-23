// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum MarkingOfRequiredFieldsEnumType {
		REQUIRED("required"),
		NONE("none"),
		ALWAYS("always");

	private final String value;

	MarkingOfRequiredFieldsEnumType(final String v) {
		value = v;
	}

	public static MarkingOfRequiredFieldsEnumType fromValue(final String v) {
		for (final MarkingOfRequiredFieldsEnumType c : MarkingOfRequiredFieldsEnumType.values()) {
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
