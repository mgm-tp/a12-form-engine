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
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang3.SerializationUtils;

import com.mgmtp.a12.model.header.Annotation;

public class ScreenType implements TreeNode, Serializable, Annotated, Id, Named {

	private final static long serialVersionUID = 1290751007527333469L;
	protected String id;
	protected String name;
	protected LabelType title;
	protected List<Annotation> annotations;
	protected HeaderFooterType subHeaderBox;
	protected HeaderFooterType footerBox;
	protected List<ScreenElementType> screenElements;
	protected String initiallyFocusedElementId;

	private DetachedRepeatType parentScreenElement;

	public DetachedRepeatType getParentScreenElement() {
		return parentScreenElement;
	}

	/**
	 * Not part of the API. Do not use.
	 */
	public void setParentScreenElement(final DetachedRepeatType containingScreenElement) {
		assert this.parentScreenElement == null;
		this.parentScreenElement = containingScreenElement;
	}

	@Override
	public TreeNode getParentNode() {
		return parentScreenElement;
	}

	@Override
	public TreeNode copy() {
		return SerializationUtils.clone(this);
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

	public List<Annotation> getAnnotations() {
		if (annotations == null) {
			annotations = new ArrayList<>();
		}
		return this.annotations;
	}

	public boolean isAnnotationSet() {
		return ((this.annotations != null) && (!this.annotations.isEmpty()));
	}

	public void unsetAnnotation() {
		this.annotations = null;
	}

	public HeaderFooterType getSubHeaderBox() {
		return subHeaderBox;
	}

	public void setSubHeaderBox(final HeaderFooterType value) {
		this.subHeaderBox = value;
	}

	public boolean isSubHeaderBoxSet() {
		return (this.subHeaderBox != null);
	}

	public HeaderFooterType getFooterBox() {
		return footerBox;
	}

	public void setFooterBox(final HeaderFooterType value) {
		this.footerBox = value;
	}

	public boolean isFooterBoxSet() {
		return (this.footerBox != null);
	}

	public List<ScreenElementType> getScreenElements() {
		if (screenElements == null) {
			screenElements = new ScreenElementList(this);
		}
		return screenElements;
	}

	public void setScreenElements(final List<ScreenElementType> value) {
		getScreenElements().addAll(value);
	}

	public boolean isScreenElementsSet() {
		return (this.screenElements != null);
	}

	public void unsetScreenElements() {
		this.screenElements = null;
	}

	public String getInitiallyFocusedElementId() {
		return initiallyFocusedElementId;
	}


	public void setInitiallyFocusedElementId(final String value) {
		this.initiallyFocusedElementId = value;
	}

	public boolean isInitiallyFocusedElementIdSet() {
		return (this.initiallyFocusedElementId != null);
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

	public String getName() {
		return name;
	}

	public void setName(final String value) {
		this.name = value;
	}

	public boolean isNameSet() {
		return (this.name != null);
	}

	public ScreenType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	public ScreenType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public ScreenType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public ScreenType withSubHeaderBox(final HeaderFooterType value) {
		setSubHeaderBox(value);
		return this;
	}

	public ScreenType withFooterBox(final HeaderFooterType value) {
		setFooterBox(value);
		return this;
	}

	public ScreenType withScreenElements(final List<ScreenElementType> value) {
		setScreenElements(value);
		return this;
	}

	public ScreenType withScreenElements(final ScreenElementType... value) {
		setScreenElements(Arrays.asList(value));
		return this;
	}

	public ScreenType withId(final String value) {
		setId(value);
		return this;
	}

	public ScreenType withName(final String value) {
		setName(value);
		return this;
	}

	private static class ScreenElementList extends NodeTreeList<ScreenElementType> {

		private final ScreenType owner;

		public ScreenElementList(final ScreenType owner) {
			this.owner = owner;
		}

		@Override
		protected void onAdd(final ScreenElementType e) {
			if (e.getParent() != null) {
				throw new IllegalArgumentException("cannot add an element whose parent is already set");
			}
			if (e.getParentScreen() != null) {
				throw new IllegalArgumentException("cannot add an element whose screen is already set");
			}
			e.setParentScreen(owner);
		}

		@Override
		protected void onRemove(final ScreenElementType e) {
			e.setParentScreen(null);
		}
	}
}
