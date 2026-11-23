// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class ConfirmationTextsType implements Serializable {
	private static final long serialVersionUID = -7910607784477124812L;

	protected ConfirmationTextType REMOVE;

	public ConfirmationTextType getREMOVE() {
		return REMOVE;
	}

	public void setREMOVE(final ConfirmationTextType REMOVE) {
		this.REMOVE = REMOVE;
	}

	public boolean isREMOVESet() {
		return (this.REMOVE != null);
	}

	public ConfirmationTextsType withREMOVE(final ConfirmationTextType value) {
		this.setREMOVE(value);
		return this;
	}
}
