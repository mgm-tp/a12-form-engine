// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class FieldConfigurationType implements Serializable {

	private final static long serialVersionUID = 1994555066693743423L;
	protected List<FieldConfigurationEntryType> field;

	public List<FieldConfigurationEntryType> getField() {
		if (field == null) {
			field = new ArrayList<FieldConfigurationEntryType>();
		}
		return this.field;
	}

	public boolean isFieldSet() {
		return ((this.field != null) && (!this.field.isEmpty()));
	}

	public void unsetField() {
		this.field = null;
	}

	public FieldConfigurationType withField(final FieldConfigurationEntryType... values) {
		if (values != null) {
			for (final FieldConfigurationEntryType value : values) {
				getField().add(value);
			}
		}
		return this;
	}

	public FieldConfigurationType withField(final Collection<FieldConfigurationEntryType> values) {
		if (values != null) {
			getField().addAll(values);
		}
		return this;
	}

}
