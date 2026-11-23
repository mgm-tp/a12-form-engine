// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class StyleType implements Serializable {
	private static final long serialVersionUID = 8799355377230899443L;
	protected String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public StyleType withName(final String name) {
		if (name != null) {
			setName(name);
		}
		return this;
	}

}
