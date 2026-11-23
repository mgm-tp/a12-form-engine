// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class DependentEnumerationType implements Serializable {

	private final static long serialVersionUID = 3285152494073384329L;
	protected String masterField;
	protected List<DependentEnumerationConstraint> constraint;

	public String getMasterField() {
		return masterField;
	}

	public void setMasterField(final String value) {
		this.masterField = value;
	}

	public boolean isMasterFieldSet() {
		return (this.masterField != null);
	}

	public List<DependentEnumerationConstraint> getConstraint() {
		if (constraint == null) {
			constraint = new ArrayList<DependentEnumerationConstraint>();
		}
		return this.constraint;
	}

	public boolean isConstraintSet() {
		return ((this.constraint != null) && (!this.constraint.isEmpty()));
	}

	public void unsetConstraint() {
		this.constraint = null;
	}

	public DependentEnumerationType withMasterField(final String value) {
		setMasterField(value);
		return this;
	}

	public DependentEnumerationType withConstraint(final DependentEnumerationConstraint... values) {
		if (values != null) {
			for (final DependentEnumerationConstraint value : values) {
				getConstraint().add(value);
			}
		}
		return this;
	}

	public DependentEnumerationType withConstraint(final Collection<DependentEnumerationConstraint> values) {
		if (values != null) {
			getConstraint().addAll(values);
		}
		return this;
	}

}
