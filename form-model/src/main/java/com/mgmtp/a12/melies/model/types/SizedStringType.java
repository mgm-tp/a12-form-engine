// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

/**
 * Holds distinct string values for the three size classes lg, md and sm.
 */
public class SizedStringType implements Serializable {

	private static final long serialVersionUID = 611716947627195042L;

	private String lg;
	private String md;
	private String sm;

	public String getLg() {
		return lg;
	}

	public void setLg(final String lg) {
		this.lg = lg;
	}

	public String getMd() {
		return md;
	}

	public void setMd(final String md) {
		this.md = md;
	}

	public String getSm() {
		return sm;
	}

	public void setSm(final String sm) {
		this.sm = sm;
	}

	public SizedStringType withLg(final String lg) {
		setLg(lg);
		return this;
	}

	public SizedStringType withMd(final String md) {
		setMd(md);
		return this;
	}

	public SizedStringType withSm(final String sm) {
		setSm(sm);
		return this;
	}
}
