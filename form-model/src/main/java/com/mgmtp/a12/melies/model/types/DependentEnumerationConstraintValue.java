// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class DependentEnumerationConstraintValue implements Serializable {

	private final static long serialVersionUID = -675939484614904419L;
	protected String value;

	public String getValue() {
		return value;
	}

	public void setValue(final String value) {
		this.value = value;
	}

	public boolean isValueSet() {
		return (this.value != null);
	}

	public DependentEnumerationConstraintValue withValue(final String value) {
		setValue(value);
		return this;
	}
}
