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
