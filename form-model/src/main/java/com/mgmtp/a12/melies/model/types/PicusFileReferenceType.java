// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class PicusFileReferenceType extends PicusReferenceType implements Serializable {

	private final static long serialVersionUID = 5550275591003434976L;
	protected String path;

	/**
	 * Gets the value of the path property.
	 *
	 * @return possible object is
	 * {@link String }
	 */
	public String getPath() {
		return path;
	}

	/**
	 * Sets the value of the path property.
	 *
	 * @param value allowed object is
	 *              {@link String }
	 */
	public void setPath(final String value) {
		this.path = value;
	}

	public boolean isPathSet() {
		return (this.path != null);
	}

	public PicusFileReferenceType withPath(final String value) {
		setPath(value);
		return this;
	}

}
