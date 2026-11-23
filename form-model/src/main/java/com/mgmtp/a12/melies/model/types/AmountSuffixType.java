// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public abstract class AmountSuffixType implements Serializable {
	private static final long serialVersionUID = 8663378482024370004L;

	protected String type;

	public String getType() {
		return this.type;
	}

	public void setType(final String type) {
		this.type = type;
	}

	public boolean isTypeSet() {
		return (this.type != null);
	}

	public AmountSuffixType withType(final String type) {
		setType(type);
		return this;
	}
}
