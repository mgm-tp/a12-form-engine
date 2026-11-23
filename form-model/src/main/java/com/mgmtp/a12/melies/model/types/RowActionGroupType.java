// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class RowActionGroupType implements Serializable {

	private final static long serialVersionUID = -5976739713007841691L;
	protected List<RowActionType> action;

	public List<RowActionType> getAction() {
		if (action == null) {
			action = new ArrayList<RowActionType>();
		}
		return this.action;
	}

	public boolean isActionSet() {
		return ((this.action != null) && (!this.action.isEmpty()));
	}

	public void unsetAction() {
		this.action = null;
	}

	public RowActionGroupType withAction(final RowActionType... values) {
		if (values != null) {
			for (final RowActionType value : values) {
				getAction().add(value);
			}
		}
		return this;
	}

	public RowActionGroupType withAction(final Collection<RowActionType> values) {
		if (values != null) {
			getAction().addAll(values);
		}
		return this;
	}

}
