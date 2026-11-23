// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum MessageExpositionEnumType {

	TOOLTIP("tooltip");
	private final String value;

	MessageExpositionEnumType(final String v) {
		value = v;
	}

	public static MessageExpositionEnumType fromValue(final String v) {
		for (final MessageExpositionEnumType c : MessageExpositionEnumType.values()) {
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
