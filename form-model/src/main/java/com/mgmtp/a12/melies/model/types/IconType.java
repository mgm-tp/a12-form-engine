// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class IconType implements Serializable {

	private static final long serialVersionUID = 5300477677390609616L;

	protected String name;
	protected String theme;

	public String getName() {
		return name;
	}

	public void setName(final String value) {
		this.name = value;
	}

	public boolean isNameSet() {
		return (this.name != null);
	}

	public String getTheme() {
		return theme;
	}

	public void setTheme(final String value) {
		this.theme = value;
	}

	public boolean isThemeSet() {
		return (this.theme != null);
	}

	public IconType withName(final String value) {
		setName(value);
		return this;
	}

	public IconType withTheme(final String value) {
		setTheme(value);
		return this;
	}
}
