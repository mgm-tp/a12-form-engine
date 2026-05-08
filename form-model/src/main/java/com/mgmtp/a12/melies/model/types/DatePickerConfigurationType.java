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
 * 1. Open-Source License – EUPL v1.2
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
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.math.BigInteger;

public class DatePickerConfigurationType implements Serializable {

	private final static long serialVersionUID = -7256935876663744473L;
	protected BigInteger minYear;
	protected BigInteger maxYear;
	protected boolean absolute = false;
	protected BigInteger preselectionYear;

	public BigInteger getMinYear() {
		return minYear;
	}

	public void setMinYear(final BigInteger value) {
		this.minYear = value;
	}

	public boolean isMinYearSet() {
		return (this.minYear != null);
	}

	public BigInteger getMaxYear() {
		return maxYear;
	}

	public void setMaxYear(final BigInteger value) {
		this.maxYear = value;
	}

	public boolean isMaxYearSet() {
		return (this.maxYear != null);
	}

	public boolean isAbsolute() {
		return absolute;
	}

	public void setAbsolute(final boolean value) {
		this.absolute = value;
	}

	public boolean isAbsoluteSet() {
		return true;
	}

	public BigInteger getPreselectionYear() {
		return preselectionYear;
	}

	public void setPreselectionYear(final BigInteger value) {
		this.preselectionYear = value;
	}

	public boolean isPreselectionYearSet() {
		return (this.preselectionYear != null);
	}

	public DatePickerConfigurationType withMinYear(final BigInteger value) {
		setMinYear(value);
		return this;
	}

	public DatePickerConfigurationType withMaxYear(final BigInteger value) {
		setMaxYear(value);
		return this;
	}

	public DatePickerConfigurationType withAbsolute(final boolean value) {
		setAbsolute(value);
		return this;
	}

	public DatePickerConfigurationType withPreselectionYear(final BigInteger value) {
		setPreselectionYear(value);
		return this;
	}

}
