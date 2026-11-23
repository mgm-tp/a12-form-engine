// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class DependentGroupCaseType implements Serializable {

	private final static long serialVersionUID = -466877499666658064L;
	protected String masterValue;
	protected String notRelevant;
	protected String readonly;


	public String getNotRelevant() {
		return notRelevant;
	}

	public void setNotRelevant(final String value) {
		this.notRelevant = value;
	}

	public boolean isHiddenSet() {
		return (this.notRelevant != null);
	}

	public String getReadonly() {
		return readonly;
	}

	public void setReadonly(final String value) {
		this.readonly = value;
	}

	public boolean isReadonlySet() {
		return (this.readonly != null);
	}

	public String getMasterValue() {
		return masterValue;
	}

	public void setMasterValue(final String value) {
		this.masterValue = value;
	}

	public boolean isMasterValueSet() {
		return (this.masterValue != null);
	}

	public DependentGroupCaseType withNotRelevant(final String value) {
		setNotRelevant(value);
		return this;
	}

	public DependentGroupCaseType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	public DependentGroupCaseType withMasterValue(final String value) {
		setMasterValue(value);
		return this;
	}

}
