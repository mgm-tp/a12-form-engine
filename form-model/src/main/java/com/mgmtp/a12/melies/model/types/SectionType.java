// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
