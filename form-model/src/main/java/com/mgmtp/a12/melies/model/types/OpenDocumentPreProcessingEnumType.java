// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public enum OpenDocumentPreProcessingEnumType {
	NONE("none"),
	COMPUTATIONS("computations"),
	COMPUTATIONS_AND_DEPENDENCIES("computations-and-dependencies");

	private final String value;

	OpenDocumentPreProcessingEnumType(final String v) { value = v;}

	public static OpenDocumentPreProcessingEnumType fromValue(final String v) {
		for (OpenDocumentPreProcessingEnumType c : OpenDocumentPreProcessingEnumType.values()) {
			if (c.value.equals(v)) {
				return c;
			}
		}
		throw new IllegalArgumentException(v);
	}

	public String getValue() { return value; }
}
