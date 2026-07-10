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

public class ExternalEnumerationType implements Serializable {

	private final static long serialVersionUID = 3107049649762053071L;
	protected String caseSensitive;
	protected String customValuesAllowed;
	protected String src;

	public String getCaseSensitive() {
		return caseSensitive;
	}

	public void setCaseSensitive(final String value) {
		this.caseSensitive = value;
	}

	public boolean isCaseSensitiveSet() {
		return (this.caseSensitive != null);
	}

	public String getCustomValuesAllowed() {
		return customValuesAllowed;
	}

	public void setCustomValuesAllowed(final String value) {
		this.customValuesAllowed = value;
	}

	public boolean isCustomValuesAllowedSet() {
		return (this.customValuesAllowed != null);
	}

	public String getSrc() {
		return src;
	}

	public void setSrc(final String value) {
		this.src = value;
	}

	public boolean isSrcSet() {
		return (this.src != null);
	}

	public ExternalEnumerationType withCaseSensitive(final String value) {
		setCaseSensitive(value);
		return this;
	}

	public ExternalEnumerationType withCustomValuesAllowed(final String value) {
		setCustomValuesAllowed(value);
		return this;
	}

	public ExternalEnumerationType withSrc(final String value) {
		setSrc(value);
		return this;
	}

}
