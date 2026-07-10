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
 * 1. Open-Source License - EUPL v1.2
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
package com.mgmtp.a12.formengine.model.types;

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang3.SerializationUtils;

public abstract class ScreenElementType implements TreeNode, Serializable, Annotated, Id, Named, ConditionallyHidden {

	@Serial
	private static final long serialVersionUID = -6149154932620259522L;

	protected String id;
	protected String name;
	protected LabelType title;
	protected List<StyleType> style;
	protected String readonly;
	protected List<Annotation> annotations;
	protected HideConditionType hideCondition;

	protected String includeId;
	protected String formModelRef;
	protected String hostDocumentModelPath;

	// for nested screen elements
	private ScreenElementType parent;

	// for top-level screen elements of a screen
	private ScreenType parentScreen;

	public ScreenElementType getParent() {
		return parent;
	}

	/**
	 * Not part of the API. Do not use.
	 */
	public void setParent(final ScreenElementType parent) {
		this.parent = parent;
	}

	public ScreenType getContainingScreen() {
		if (parentScreen != null) {
			return parentScreen;
		} else if (parent != null) {
			return parent.getContainingScreen();
		} else {
			return null;
		}
	}

	public ScreenType getParentScreen() {
		return parentScreen;
	}

	/**
	 * Not part of the API. Do not use.
	 */
	public void setParentScreen(final ScreenType parentScreen) {
		this.parentScreen = parentScreen;
	}

	@Override
	public TreeNode getParentNode() {
		if (parent != null) {
			return parent;
		} else {
			return parentScreen;
		}
	}

	@Override
	public TreeNode copy() {
		final ScreenElementType clone = SerializationUtils.clone(this);
		clone.setParent(null);
		clone.setParentScreen(null);
		return clone;
	}

	public LabelType getTitle() {
		return title;
	}

	public void setTitle(final LabelType value) {
		this.title = value;
	}

	public boolean isTitleSet() {
		return (this.title != null);
	}

	public List<StyleType> getStyle() {
		if (style == null) {
			style = new ArrayList<StyleType>();
		}
		return this.style;
	}

	public boolean isStyleSet() {
		return ((this.style != null) && (!this.style.isEmpty()));
	}

	public void unsetStyle() {
		this.style = null;
	}

	public String getReadonly() {
		return readonly;
	}

	public void setReadonly(final String value) {
		this.readonly = value;
	}

	public boolean isReadonlySet() {
		return (this.readonly != null);
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

	@Override
	public HideConditionType getHideCondition() {
		return hideCondition;
	}

	@Override
	public void setHideCondition(final HideConditionType value) {
		this.hideCondition = value;
	}

	@Override
	public boolean isHideConditionSet() {
		return (this.hideCondition != null);
	}

	public String getIncludeId() {
		return includeId;
	}

	public void setIncludeId(final String value) {
		this.includeId = value;
	}

	public String getFormModelRef() {
		return formModelRef;
	}

	public void setFormModelRef(final String value) {
		this.formModelRef = value;
	}

	public boolean isFormModelRefSet() {
		return (this.formModelRef != null);
	}

	public String getHostDocumentModelPath() {
		return hostDocumentModelPath;
	}

	public void setHostDocumentModelPath(final String value) {
		this.hostDocumentModelPath = value;
	}

	public boolean isHostDocumentModelPath() {
		return (this.hostDocumentModelPath != null);
	}

	public ScreenElementType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	public ScreenElementType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	public ScreenElementType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	public ScreenElementType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	public ScreenElementType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public ScreenElementType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public ScreenElementType withId(final String value) {
		setId(value);
		return this;
	}

	public ScreenElementType withName(final String value) {
		setName(value);
		return this;
	}

	public ScreenElementType withHideCondition(final HideConditionType value) {
		setHideCondition(value);
		return this;
	}

	public ScreenElementType withIncludeId(final String value) {
		setIncludeId(value);
		return this;
	}

	public ScreenElementType withFormModelRef(final String value) {
		setFormModelRef(value);
		return this;
	}

	public ScreenElementType withHostDocumentModelPath(final String value) {
		setHostDocumentModelPath(value);
		return this;
	}
}
