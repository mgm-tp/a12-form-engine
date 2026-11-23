// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import com.mgmtp.a12.model.header.ModelReference;

import java.io.Serializable;

public class ModelReferenceType implements ModelReference, Serializable {

	private final static long serialVersionUID = 964719997805026227L;
	protected String alias;
	protected String modelType;
	protected String purpose;
	protected String reference;

	public String getAlias() {
		return alias;
	}

	public void setAlias(final String value) {
		this.alias = value;
	}

	public boolean isAliasSet() {
		return (this.alias != null);
	}

	public String getModelType() {
		return modelType;
	}

	public void setModelType(final String value) {
		this.modelType = value;
	}

	public boolean isModelTypeSet() {
		return (this.modelType != null);
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(final String value) {
		this.purpose = value;
	}

	public boolean isPurposeSet() {
		return (this.purpose != null);
	}

	public String getReference() {
		return reference;
	}

	public void setReference(final String value) {
		this.reference = value;
	}

	public boolean isReferenceSet() {
		return (this.reference != null);
	}

	public ModelReferenceType withAlias(final String value) {
		setAlias(value);
		return this;
	}

	public ModelReferenceType withModelType(final String value) {
		setModelType(value);
		return this;
	}

	public ModelReferenceType withPurpose(final String value) {
		setPurpose(value);
		return this;
	}

	public ModelReferenceType withReference(final String value) {
		setReference(value);
		return this;
	}

}
