// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.util.Locale;
import java.util.ResourceBundle;

public enum RepeatButtonLabelEnumType {

	ADD("add"),
	COMMIT_ADD("commitAdd"),
	APPLY("apply"),
	EDIT("edit"),
	REMOVE("remove"),
	VIEW("view"),
	CANCEL("cancel"),
	CONFIRM("confirm"),
	RETURN("return"),
	UP("up"),
	DOWN("down"),
	COPY("copy"),
	CLOSE("close"),
	DOWNLOAD("download"),
	SKIP("skip"),
	REPLACE("replace"),
	UPLOAD_AS_COPY("uploadAsCopy");
	private final String value;

	RepeatButtonLabelEnumType(final String v) {
		value = v;
	}

	public static RepeatButtonLabelEnumType fromValue(final String v) {
		for (final RepeatButtonLabelEnumType c : RepeatButtonLabelEnumType.values()) {
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
