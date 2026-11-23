// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class DefaultRowActionType implements Serializable {

	private final static long serialVersionUID = 218030344919684308L;
	protected String custom;
	protected String event;
	protected Boolean hideButton;

	public String getCustom() {
		return custom;
	}

	public void setCustom(final String value) {
		this.custom = value;
	}

	public boolean isCustomSet() {
		return (this.custom != null);
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(final String value) {
		this.event = value;
	}

	public boolean isEventSet() {
		return (this.event != null);
	}

	public Boolean getHideButton() {
		return hideButton;
	}

	public void setHideButton(final Boolean value) {
		this.hideButton = value;
	}

	public boolean isHideButtonSet() {
		return (this.hideButton != null);
	}

	public DefaultRowActionType withCustom(final String value) {
		setCustom(value);
		return this;
	}

	public DefaultRowActionType withEvent(final String value) {
		setEvent(value);
		return this;
	}

	public DefaultRowActionType withHideButton(final Boolean value) {
		setHideButton(value);
		return this;
	}
}
