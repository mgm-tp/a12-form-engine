// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import org.apache.commons.lang3.SerializationUtils;

import java.io.Serial;
import java.io.Serializable;

public class ControlGridNode implements TreeNode, Serializable {
	@Serial
	private static final long serialVersionUID = -2340756301411672622L;

	ControlGridType parent;

	public ControlGridType getParent() {
		return parent;
	}

	/**
	 * Not part of the API. Do not use.
	 */
	public void setParent(final ControlGridType parent) {
		this.parent = parent;
	}

	@Override
	public TreeNode getParentNode() {
		return parent;
	}

	@Override
	public TreeNode copy() {
		final ControlGridNode clone = SerializationUtils.clone(this);
		clone.setParent(null);
		return clone;
	}
}
