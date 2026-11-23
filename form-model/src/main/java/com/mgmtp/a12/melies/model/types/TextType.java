// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class TextType implements Serializable {

	private final static long serialVersionUID = 9193139693172212611L;

	protected String locale;
	protected String text;

	public String getText() {
		return text;
	}

	public void setText(final String text) {
		this.text = text;
	}

	public boolean isTextSet() {
		return (this.text != null);
	}

	public String getLocale() {
		return locale;
	}

	public void setLocale(final String value) {
		this.locale = value;
	}

	public boolean isLocaleSet() {
		return (this.locale != null);
	}

	public TextType withText(final String value) {
		setText(value);
		return this;
	}

	public TextType withLocale(final String value) {
		setLocale(value);
		return this;
	}

}
