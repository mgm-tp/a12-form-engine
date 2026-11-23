// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class ExternalEnumerationType implements Serializable {

	private final static long serialVersionUID = 3107049649762053071L;
	protected String caseSensitive;
	protected String customValuesAllowed;
	protected String src;

	public String getCaseSensitive() {
		return caseSensitive;
	}

	public void setCaseSensitive(final String value) {
		this.caseSensitive = value;
	}

	public boolean isCaseSensitiveSet() {
		return (this.caseSensitive != null);
	}

	public String getCustomValuesAllowed() {
		return customValuesAllowed;
	}

	public void setCustomValuesAllowed(final String value) {
		this.customValuesAllowed = value;
	}

	public boolean isCustomValuesAllowedSet() {
		return (this.customValuesAllowed != null);
	}

	public String getSrc() {
		return src;
	}

	public void setSrc(final String value) {
		this.src = value;
	}

	public boolean isSrcSet() {
		return (this.src != null);
	}

	public ExternalEnumerationType withCaseSensitive(final String value) {
		setCaseSensitive(value);
		return this;
	}

	public ExternalEnumerationType withCustomValuesAllowed(final String value) {
		setCustomValuesAllowed(value);
		return this;
	}

	public ExternalEnumerationType withSrc(final String value) {
		setSrc(value);
		return this;
	}

}
