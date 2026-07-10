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

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class GroupConfigurationEntryType implements Serializable, Annotated {

	private final static long serialVersionUID = -2594776034780586129L;
	protected DependentGroupType dependentGroup;
	protected List<Annotation> annotations;
	protected String groupRef;
	protected Integer numberOfInitialRows;

	public DependentGroupType getDependentGroup() {
		return dependentGroup;
	}

	public void setDependentGroup(final DependentGroupType value) {
		this.dependentGroup = value;
	}

	public boolean isDependentGroupSet() {
		return (this.dependentGroup != null);
	}

	public List<Annotation> getAnnotations() {
		if (annotations == null) {
			annotations = new ArrayList<Annotation>();
		}
		return this.annotations;
	}

	public boolean isAnnotationSet() {
		return ((this.annotations != null) && (!this.annotations.isEmpty()));
	}

	public void unsetAnnotation() {
		this.annotations = null;
	}

	public String getGroupRef() {
		return groupRef;
	}

	public void setGroupRef(final String value) {
		this.groupRef = value;
	}

	public boolean isGroupRefSet() {
		return (this.groupRef != null);
	}

	public Integer getNumberOfInitialRows() {
		return numberOfInitialRows;
	}

	public void setNumberOfInitialRows(final Integer value) {
		this.numberOfInitialRows = value;
	}

	public boolean isNumberOfInitialRowsSet() {
		return (this.numberOfInitialRows != null);
	}

	public GroupConfigurationEntryType withDependentGroup(final DependentGroupType value) {
		setDependentGroup(value);
		return this;
	}

	public GroupConfigurationEntryType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public GroupConfigurationEntryType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public GroupConfigurationEntryType withGroupRef(final String value) {
		setGroupRef(value);
		return this;
	}

	public GroupConfigurationEntryType withNumberOfInitialRows(final Integer value) {
		setNumberOfInitialRows(value);
		return this;
	}
}
