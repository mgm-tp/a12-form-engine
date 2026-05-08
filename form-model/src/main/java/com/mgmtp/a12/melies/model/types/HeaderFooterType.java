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
