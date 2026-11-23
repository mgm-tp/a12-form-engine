// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class DynamicAmountSuffixType extends AmountSuffixType implements Serializable {
	private static final long serialVersionUID = 8663378482024370004L;
	protected String fieldRef;

	@Override
	public void setType(final String type) {
		if ("dynamic".equals(type)) {
			this.type = type;
		} else {
			throw new IllegalArgumentException(type);
		}
	}

	public String getFieldRef() {
		return this.fieldRef;
	}

	public void setFieldRef(final String fieldRef) {
		this.fieldRef = fieldRef;
	}

	public boolean isFieldRefSet() {
		return (this.fieldRef != null);
	}

	public DynamicAmountSuffixType withFieldRef(final String fieldRef) {
		this.setFieldRef(fieldRef);
		return this;
	}
}
