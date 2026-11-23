// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.language;

public class LocalizedTextValue {

	private final String locale;
	private final String text;

	public LocalizedTextValue(final String locale, final String text) {
		this.locale = locale;
		this.text = text;
	}

	public String getLocale() {
		return locale;
	}

	public String getText() {
		return text;
	}

}
