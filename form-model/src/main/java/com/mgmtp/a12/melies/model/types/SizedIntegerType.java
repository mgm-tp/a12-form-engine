// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

/**
 * Holds distinct integer values for the three size classes lg, md and sm.
 */
public class SizedIntegerType implements Serializable {

	private static final long serialVersionUID = 4858325364313973117L;

	private Integer lg;
	private Integer md;
	private Integer sm;

	public Integer getLg() {
		return lg;
	}

	public void setLg(final Integer lg) {
		this.lg = lg;
	}

	public Integer getMd() {
		return md;
	}

	public void setMd(final Integer md) {
		this.md = md;
	}

	public Integer getSm() {
		return sm;
	}

	public void setSm(final Integer sm) {
		this.sm = sm;
	}

	public SizedIntegerType withLg(final Integer lg) {
		setLg(lg);
		return this;
	}

	public SizedIntegerType withMd(final Integer md) {
		setMd(md);
		return this;
	}

	public SizedIntegerType withSm(final Integer sm) {
		setSm(sm);
		return this;
	}
}
