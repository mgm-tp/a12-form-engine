// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

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
