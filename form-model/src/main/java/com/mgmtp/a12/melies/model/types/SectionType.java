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
import java.util.Collection;
import java.util.List;

import com.mgmtp.a12.model.header.Annotation;

public class SectionType extends ScreenElementType implements Serializable {

	private final static long serialVersionUID = -2947957131554442350L;
	protected List<ScreenElementType> screenElement;
	protected String collapsible;
	protected String initiallyCollapsed;

	public SectionType() {
		screenElement = getScreenElement();
	}

	public List<ScreenElementType> getScreenElement() {
		if (screenElement == null) {
			screenElement = new SectionList(this);
		}
		return this.screenElement;
	}

	public boolean isScreenElementSetSet() {
		return ((this.screenElement != null) && (!this.screenElement.isEmpty()));
	}

	public void unsetScreenElement() {
		this.screenElement = null;
	}

	public String getCollapsible() {
		return collapsible;
	}

	public void setCollapsible(final String value) {
		this.collapsible = value;
	}

	public boolean isCollapsibleSet() {
		return (this.collapsible != null);
	}

	public String getInitiallyCollapsed() {
		return initiallyCollapsed;
	}

	public void setInitiallyCollapsed(final String value) {
		this.initiallyCollapsed = value;
	}

	public boolean isInitiallyCollapsedSet() {
		return (this.initiallyCollapsed != null);
	}

	public SectionType withScreenElement(final ScreenElementType... values) {
		if (values != null) {
			for (final ScreenElementType value : values) {
				getScreenElement().add(value);
			}
		}
		return this;
	}

	public SectionType withScreenElement(final Collection<ScreenElementType> values) {
		if (values != null) {
			getScreenElement().addAll(values);
		}
		return this;
	}

	public SectionType withCollapsible(final String value) {
		setCollapsible(value);
		return this;
	}

	public SectionType withInitiallyCollapsed(final String value) {
		setInitiallyCollapsed(value);
		return this;
	}

	@Override
	public SectionType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public SectionType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public SectionType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public SectionType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public SectionType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public SectionType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public SectionType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public SectionType withName(final String value) {
		setName(value);
		return this;
	}

	private static class SectionList extends NodeTreeList<ScreenElementType> {

		private SectionType owner;

		public SectionList(final SectionType owner) {
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
			e.setParent(owner);
		}

		@Override
		protected void onRemove(final ScreenElementType e) {
			e.setParent(null);
		}
	}
}
