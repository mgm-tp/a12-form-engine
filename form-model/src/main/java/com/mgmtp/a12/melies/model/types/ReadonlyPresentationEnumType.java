// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum ReadonlyPresentationEnumType {
		INPUT("input"),
		TEXT("text-output");

	private final String value;

	ReadonlyPresentationEnumType(final String v) {
		value = v;
	}

	public static ReadonlyPresentationEnumType fromValue(final String v) {
		for (final ReadonlyPresentationEnumType c : ReadonlyPresentationEnumType.values()) {
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
