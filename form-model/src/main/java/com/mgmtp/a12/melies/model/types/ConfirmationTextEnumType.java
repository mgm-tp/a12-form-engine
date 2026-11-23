// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.util.Locale;
import java.util.ResourceBundle;

public enum ConfirmationTextEnumType {

	REMOVE("remove");
	private final String value;

	ConfirmationTextEnumType(final String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}
}
