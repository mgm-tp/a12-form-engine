// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class DependentControlsType implements Serializable {

	private final static long serialVersionUID = -5431296895738367079L;
	protected List<ScreenElementRefType> screenElement;

	public List<ScreenElementRefType> getScreenElement() {
		if (screenElement == null) {
			screenElement = new ArrayList<ScreenElementRefType>();
		}
		return this.screenElement;
	}

	public boolean isScreenElementSet() {
		return ((this.screenElement != null) && (!this.screenElement.isEmpty()));
	}

	public void unsetScreenElement() {
		this.screenElement = null;
	}

	public DependentControlsType withScreenElement(final ScreenElementRefType... values) {
		if (values != null) {
			for (final ScreenElementRefType value : values) {
				getScreenElement().add(value);
			}
		}
		return this;
	}

	public DependentControlsType withScreenElement(final Collection<ScreenElementRefType> values) {
		if (values != null) {
			getScreenElement().addAll(values);
		}
		return this;
	}

}
