// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class DependentFieldCaseType implements Serializable {

	private final static long serialVersionUID = 6008898696136080762L;
	protected String notRelevant;
	protected String readonly;
	protected String value;
	protected String masterValue;
	protected String fieldRef;

	public String getNotRelevant() {
		return notRelevant;
	}

	public void setNotRelevant(final String value) {
		this.notRelevant = value;
	}

	public boolean isNotRelevantSet() {
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

	public String getValue() {
		return value;
	}

	public void setValue(final String value) {
		this.value = value;
	}

	public boolean isValueSet() {
		return (this.value != null);
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

	public String getFieldRef() {
		return fieldRef;
	}

	public void setFieldRef(final String value) {
		this.fieldRef = value;
	}

	public boolean isFieldRefSet() {
		return (this.fieldRef != null);
	}

	public DependentFieldCaseType withNotRelevant(final String value) {
		setNotRelevant(value);
		return this;
	}

	public DependentFieldCaseType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	public DependentFieldCaseType withValue(final String value) {
		setValue(value);
		return this;
	}

	public DependentFieldCaseType withMasterValue(final String value) {
		setMasterValue(value);
		return this;
	}

	public DependentFieldCaseType withFieldRef(final String value) {
		setFieldRef(value);
		return this;
	}

}
