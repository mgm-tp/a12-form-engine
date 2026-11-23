// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class DependentGroupType implements Serializable {

	private final static long serialVersionUID = 1590176921263468346L;
	protected String masterField;
	protected List<DependentGroupCaseType> _case;

	public String getMasterField() {
		return masterField;
	}

	public void setMasterField(final String value) {
		this.masterField = value;
	}

	public boolean isMasterFieldSet() {
		return (this.masterField != null);
	}

	public List<DependentGroupCaseType> getCase() {
		if (_case == null) {
			_case = new ArrayList<DependentGroupCaseType>();
		}
		return this._case;
	}

	public boolean isCaseSet() {
		return ((this._case != null) && (!this._case.isEmpty()));
	}

	public void unsetCase() {
		this._case = null;
	}

	public DependentGroupType withCase(final DependentGroupCaseType... values) {
		if (values != null) {
			for (final DependentGroupCaseType value : values) {
				getCase().add(value);
			}
		}
		return this;
	}

	public DependentGroupType withCase(final Collection<DependentGroupCaseType> values) {
		if (values != null) {
			getCase().addAll(values);
		}
		return this;
	}

	public DependentGroupType withMasterField(final String value) {
		setMasterField(value);
		return this;
	}
}
