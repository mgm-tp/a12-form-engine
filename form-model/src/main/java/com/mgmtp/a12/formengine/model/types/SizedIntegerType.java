/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
package com.mgmtp.a12.formengine.model.types;

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
