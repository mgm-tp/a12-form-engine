// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class DependentFieldType implements Serializable {

	private final static long serialVersionUID = -7422698562916905109L;
	protected String masterField;
	protected List<DependentFieldCaseType> _case;

	public String getMasterField() {
		return masterField;
	}

	public void setMasterField(final String value) {
		this.masterField = value;
	}

	public boolean isMasterFieldSet() {
		return (this.masterField != null);
	}

	public List<DependentFieldCaseType> getCase() {
		if (_case == null) {
			_case = new ArrayList<DependentFieldCaseType>();
		}
		return this._case;
	}

	public boolean isCaseSet() {
		return ((this._case != null) && (!this._case.isEmpty()));
	}

	public void unsetCase() {
		this._case = null;
	}

	public DependentFieldType withMasterField(final String value) {
		setMasterField(value);
		return this;
	}

	public DependentFieldType withCase(final DependentFieldCaseType... values) {
		if (values != null) {
			for (final DependentFieldCaseType value : values) {
				getCase().add(value);
			}
		}
		return this;
	}

	public DependentFieldType withCase(final Collection<DependentFieldCaseType> values) {
		if (values != null) {
			getCase().addAll(values);
		}
		return this;
	}

}
