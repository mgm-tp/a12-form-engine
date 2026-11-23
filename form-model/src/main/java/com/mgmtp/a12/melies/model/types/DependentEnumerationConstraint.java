// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class DependentEnumerationConstraint implements Serializable {

	private final static long serialVersionUID = -675939484614904418L;
	protected String masterValue;
	protected List<DependentEnumerationConstraintValue> constraintValues;
	protected String valueForMasterChange;

	public List<DependentEnumerationConstraintValue> getConstraintValues() {
		if (constraintValues == null) {
			constraintValues = new ArrayList<DependentEnumerationConstraintValue>();
		}
		return this.constraintValues;
	}

	public boolean isConstraintValuesSet() {
		return ((this.constraintValues != null) && (!this.constraintValues.isEmpty()));
	}

	public void unsetConstraintValues() {
		this.constraintValues = null;
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

	public String getValueForMasterChange() {
		return valueForMasterChange;
	}

	public void setValueForMasterChange(final String value) {
		this.valueForMasterChange = value;
	}

	public boolean isValueForMasterChangeSet() {
		return (this.valueForMasterChange != null);
	}

	public DependentEnumerationConstraint withConstraintValues(final DependentEnumerationConstraintValue... constraintValues) {
		if (constraintValues != null) {
			for (final DependentEnumerationConstraintValue constraintValue : constraintValues) {
				getConstraintValues().add(constraintValue);
			}
		}
		return this;
	}

	public DependentEnumerationConstraint withConstraintValues(final Collection<DependentEnumerationConstraintValue> constraintValues) {
		if (constraintValues != null) {
			getConstraintValues().addAll(constraintValues);
		}
		return this;
	}

	public DependentEnumerationConstraint withMasterValue(final String value) {
		setMasterValue(value);
		return this;
	}

	public DependentEnumerationConstraint withValueForMasterChange(final String value) {
		setValueForMasterChange(value);
		return this;
	}
}
