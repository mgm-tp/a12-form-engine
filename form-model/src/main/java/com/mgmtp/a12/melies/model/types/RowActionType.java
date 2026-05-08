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
import java.util.ArrayList;
import java.util.List;

import com.mgmtp.a12.model.header.Annotation;

public class RowActionType implements Annotated, Serializable {

	private final static long serialVersionUID = 1469299537938180862L;

	protected ButtonStylingType buttonStyling;
	protected String event;
	protected MultilingualTextType confirmation;
	protected MultilingualTextType confirmationDialogTitle;
	protected List<Annotation> annotations;
	protected ScopeEnumType scope;

	public ButtonStylingType getButtonStyling() {
		return buttonStyling;
	}

	public void setButtonStyling(final ButtonStylingType value) {
		this.buttonStyling = value;
	}

	public boolean isButtonStylingSet() {
		return (this.buttonStyling != null);
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

	public MultilingualTextType getConfirmation() {
		return confirmation;
	}

	public void setConfirmation(final MultilingualTextType value) {
		this.confirmation = value;
	}

	public boolean isConfirmationSet() {
		return (this.confirmation != null);
	}

	public MultilingualTextType getConfirmationDialogTitle() {
		return confirmationDialogTitle;
	}

	public void setConfirmationDialogTitle(final MultilingualTextType value) {
		this.confirmationDialogTitle = value;
	}

	public boolean isConfirmationDialogTitleSet() {
		return (this.confirmationDialogTitle != null);
	}

	public ScopeEnumType getScope() {
		return scope;
	}

	public void setScope(final ScopeEnumType value) {
		this.scope = value;
	}

	public boolean isScopeSet() {
		return (this.scope != null);
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

	public RowActionType withButtonStyling(final ButtonStylingType value) {
		setButtonStyling(value);
		return this;
	}

	public RowActionType withEvent(final String value) {
		setEvent(value);
		return this;
	}

	public RowActionType withConfirmation(final MultilingualTextType value) {
		setConfirmation(value);
		return this;
	}

	public RowActionType withConfirmationDialogTitle(final MultilingualTextType value) {
		setConfirmationDialogTitle(value);
		return this;
	}

	public RowActionType withScope(final ScopeEnumType value) {
		setScope(value);
		return this;
	}
}
