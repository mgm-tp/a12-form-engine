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
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang3.SerializationUtils;

import com.mgmtp.a12.model.header.Annotation;

public class ButtonType implements TreeNode, Serializable, Annotated, Id, Named {

	private final static long serialVersionUID = -1780272374232844754L;
	protected ButtonEnumType type;
	protected String id;
	protected String name;
	protected ButtonStylingType buttonStyling;
	protected String event;
	protected String target;
	protected ButtonValidationEnumType validation;
	protected ScopeEnumType scope;
	protected List<Annotation> annotations;
	private ButtonPanelType parent;
	private EnablementEnumType enablement;

	public ButtonPanelType getParent() {
		return parent;
	}

	/**
	 * Not part of the API. Do not use.
	 */
	public void setParent(final ButtonPanelType parent) {
		this.parent = parent;
	}

	@Override
	public TreeNode getParentNode() {
		return parent;
	}

	public <T extends TreeNode> T findAncestorOfType(final Class<T> type) {
		return AncestorUtil.findAncestorOfType(this, type);
	}

	@Override
	public TreeNode copy() {
		final ButtonType clone = SerializationUtils.clone(this);
		clone.setParent(null);
		return clone;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(final String event) {
		this.event = event;
	}

	public boolean isEventSet() {
		return (this.event != null);
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(final String target) {
		this.target = target;
	}

	public boolean isTargetSet() {
		return (this.target != null);
	}

	public ButtonValidationEnumType getValidation() {
		return validation;
	}

	public void setValidation(final ButtonValidationEnumType validation) {
		this.validation = validation;
	}

	public boolean isValidationSet() {
		return (this.validation != null);
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

	@Override
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

	public ButtonEnumType getType() {
		return type;
	}

	public void setType(final ButtonEnumType value) {
		this.type = value;
	}

	public boolean isTypeSet() {
		return (this.type != null);
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public void setId(final String value) {
		this.id = value;
	}

	@Override
	public boolean isIdSet() {
		return (this.id != null);
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(final String value) {
		this.name = value;
	}

	@Override
	public boolean isNameSet() {
		return (this.name != null);
	}

	public ButtonStylingType getButtonStyling() {
		return buttonStyling;
	}

	public void setButtonStyling(final ButtonStylingType value) {
		this.buttonStyling = value;
	}

	public boolean isButtonStylingSet() {
		return (this.buttonStyling != null);
	}

	public EnablementEnumType getEnablement() {
		return enablement;
	}

	public Boolean isEnablementSet() {
		return this.enablement != null;
	}

	public void setEnablement(final EnablementEnumType enablementEnumType) {
		this.enablement = enablementEnumType;
	}

	public ButtonType withEvent(final String value) {
		setEvent(value);
		return this;
	}

	public ButtonType withTarget(final String value) {
		setTarget(value);
		return this;
	}

	public ButtonType withValidation(final ButtonValidationEnumType value) {
		setValidation(value);
		return this;
	}

	public ButtonType withScope(final ScopeEnumType value) {
		setScope(value);
		return this;
	}

	public ButtonType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public ButtonType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public ButtonType withType(final ButtonEnumType value) {
		setType(value);
		return this;
	}

	public ButtonType withId(final String value) {
		setId(value);
		return this;
	}

	public ButtonType withName(final String value) {
		setName(value);
		return this;
	}

	public ButtonType withButtonStyling(final ButtonStylingType value) {
		setButtonStyling(value);
		return this;
	}

	public ButtonType withEnablementEnumType(final EnablementEnumType value) {
		setEnablement(value);
		return this;
	}

}
