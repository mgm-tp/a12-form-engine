// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class GroupConfigurationType implements Serializable {

	private final static long serialVersionUID = 6561765077636324969L;
	protected List<GroupConfigurationEntryType> group;

	public List<GroupConfigurationEntryType> getGroup() {
		if (group == null) {
			group = new ArrayList<GroupConfigurationEntryType>();
		}
		return this.group;
	}

	public boolean isGroupSet() {
		return ((this.group != null) && (!this.group.isEmpty()));
	}

	public void unsetGroup() {
		this.group = null;
	}

	public GroupConfigurationType withGroup(final GroupConfigurationEntryType... values) {
		if (values != null) {
			for (final GroupConfigurationEntryType value : values) {
				getGroup().add(value);
			}
		}
		return this;
	}

	public GroupConfigurationType withGroup(final Collection<GroupConfigurationEntryType> values) {
		if (values != null) {
			getGroup().addAll(values);
		}
		return this;
	}

}
