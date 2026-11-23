// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class StaticAmountSuffixType extends AmountSuffixType implements Serializable {
	private static final long serialVersionUID = 8663378482024370004L;
	protected String value;

	@Override
	public void setType(final String type) {
		if ("static".equals(type)) {
			this.type = type;
		} else {
			throw new IllegalArgumentException(type);
		}
	}

	public String getValue() {
		return this.value;
	}

	public void setValue(final String value) {
		this.value = value;
	}

	public boolean isValueSet() {
		return (this.value != null);
	}

	public StaticAmountSuffixType withValue(final String value) {
		this.setValue(value);
		return this;
	}
}
