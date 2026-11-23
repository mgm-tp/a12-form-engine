// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class RepeatOverviewColumnRefType implements Serializable {

	private final static long serialVersionUID = -4515442319672341874L;

	protected String idref;

	public String getIdref() {
		return idref;
	}

	public void setIdref(final String value) {
		this.idref = value;
	}

	public boolean isIdrefSet() {
		return (this.idref != null);
	}

	public RepeatOverviewColumnRefType withIdref(final String value) {
		setIdref(value);
		return this;
	}

}
