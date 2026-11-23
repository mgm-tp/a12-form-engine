// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum ExpositionPresentationEnumType {

	AREA("area"),
	COMPACT("compact"),
	AUTOCOMPLETE("autocomplete"),
	FULL("full"),
	INLINE("inline"),
	BOOLEAN_SELECT("boolean-select"),
	CHECKBOX("checkbox"),
	SWITCH("switch"),
	SWITCH_WITH_VALUES("switch-with-values"),
	THUMBNAIL_OR_ICON("thumbnail-or-icon");
	private final String value;

	ExpositionPresentationEnumType(final String v) {
		value = v;
	}

	public static ExpositionPresentationEnumType fromValue(final String v) {
		for (final ExpositionPresentationEnumType c : ExpositionPresentationEnumType.values()) {
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
