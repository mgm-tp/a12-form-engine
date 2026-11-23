// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ButtonListType implements Serializable {

	private final static long serialVersionUID = 1840945417831254436L;
	protected List<ButtonType> button;

	public List<ButtonType> getButton() {
		if (button == null) {
			button = new ArrayList<ButtonType>();
		}
		return this.button;
	}

	public boolean isButtonSet() {
		return ((this.button != null) && (!this.button.isEmpty()));
	}

	public void unsetButton() {
		this.button = null;
	}

	public ButtonListType withButton(final ButtonType... values) {
		if (values != null) {
			for (final ButtonType value : values) {
				getButton().add(value);
			}
		}
		return this;
	}

	public ButtonListType withButton(final Collection<ButtonType> values) {
		if (values != null) {
			getButton().addAll(values);
		}
		return this;
	}

}
