// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class ControlIndexType implements Serializable {
	private static final long serialVersionUID = -4786003310657983535L;
	private ControlIndexEnumType type;
	private String value;

	public ControlIndexType() {
	}

	public ControlIndexType(ControlIndexEnumType type, String value) {
		this.type = type;
		this.value = value;
	}

	public ControlIndexEnumType getType() {
		return type;
	}

	public void setType(ControlIndexEnumType type) {
		this.type = type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
