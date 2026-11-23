// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class ScreenElementRefType implements Serializable {

	private final static long serialVersionUID = -348859636732185292L;

	protected String idref;
	protected String masterValue;

	public String getIdref() {
		return idref;
	}

	public void setIdref(final String value) {
		this.idref = value;
	}

	public boolean isIdrefSet() {
		return (this.idref != null);
	}

	public String getMasterValue() {
		return masterValue;
	}

	public void setMasterValue(final String value) {
		this.masterValue = value;
	}

	public boolean isMasterValueSet() {
		return (this.masterValue != null);
	}

	public ScreenElementRefType withIdref(final String value) {
		setIdref(value);
		return this;
	}

	public ScreenElementRefType withMasterValue(final String value) {
		setMasterValue(value);
		return this;
	}

}
