// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
