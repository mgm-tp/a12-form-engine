// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
