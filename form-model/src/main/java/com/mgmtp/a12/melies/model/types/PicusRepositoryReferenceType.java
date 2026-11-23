// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class PicusRepositoryReferenceType extends PicusReferenceType implements Serializable {

	private final static long serialVersionUID = 2720350675029532782L;
	protected String name;

	public String getName() {
		return name;
	}

	public void setName(final String value) {
		this.name = value;
	}

	public boolean isNameSet() {
		return (this.name != null);
	}

	public PicusRepositoryReferenceType withName(final String value) {
		setName(value);
		return this;
	}

}
