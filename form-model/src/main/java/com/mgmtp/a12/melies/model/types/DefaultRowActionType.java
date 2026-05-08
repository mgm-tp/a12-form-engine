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
 * 1. Open-Source License – EUPL v1.2
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
