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
