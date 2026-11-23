// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class HeaderFooterType implements Serializable, Id {

	private final static long serialVersionUID = -3384113921395403601L;
	protected String id;
	protected ButtonListType minorButtons;
	protected ButtonListType majorButtons;

	public ButtonListType getMinorButtons() {
		return minorButtons;
	}

	public void setMinorButtons(final ButtonListType value) {
		this.minorButtons = value;
	}

	public boolean isMinorButtonsSet() {
		return (this.minorButtons != null);
	}

	public ButtonListType getMajorButtons() {
		return majorButtons;
	}

	public void setMajorButtons(final ButtonListType value) {
		this.majorButtons = value;
	}

	public boolean isMajorButtonsSet() {
		return (this.majorButtons != null);
	}

	public String getId() {
		return id;
	}

	public void setId(final String value) {
		this.id = value;
	}

	public boolean isIdSet() {
		return (this.id != null);
	}

	public HeaderFooterType withMinorButtons(final ButtonListType value) {
		setMinorButtons(value);
		return this;
	}

	public HeaderFooterType withMajorButtons(final ButtonListType value) {
		setMajorButtons(value);
		return this;
	}

	public HeaderFooterType withId(final String value) {
		setId(value);
		return this;
	}

}
