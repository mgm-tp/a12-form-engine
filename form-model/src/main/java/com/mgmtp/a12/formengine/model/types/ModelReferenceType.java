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
