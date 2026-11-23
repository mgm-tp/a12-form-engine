// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.Collection;

import com.mgmtp.a12.model.header.Annotation;

public class MultiColumnSectionType extends SectionType implements Serializable, Layoutable {

	private final static long serialVersionUID = 33072544572992100L;
	protected SizedStringType layout;

	/**
	 * Gets the value of the layout property.
	 *
	 * @return possible object is {@link SizedStringType }
	 */
	public SizedStringType getLayout() {
		return layout;
	}

	/**
	 * Sets the value of the layout property.
	 *
	 * @param value allowed object is {@link SizedStringType }
	 */
	public void setLayout(final SizedStringType value) {
		this.layout = value;
	}

	public boolean isLayoutSet() {
		return (this.layout != null);
	}

	public MultiColumnSectionType withLayout(final SizedStringType value) {
		setLayout(value);
		return this;
	}

	@Override
	public MultiColumnSectionType withScreenElement(final ScreenElementType... values) {
		if (values != null) {
			for (final ScreenElementType value : values) {
				getScreenElement().add(value);
			}
		}
		return this;
	}

	@Override
	public MultiColumnSectionType withScreenElement(final Collection<ScreenElementType> values) {
		if (values != null) {
			getScreenElement().addAll(values);
		}
		return this;
	}

	@Override
	public MultiColumnSectionType withCollapsible(final String value) {
		setCollapsible(value);
		return this;
	}

	@Override
	public MultiColumnSectionType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public MultiColumnSectionType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public MultiColumnSectionType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public MultiColumnSectionType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public MultiColumnSectionType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public MultiColumnSectionType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public MultiColumnSectionType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public MultiColumnSectionType withName(final String value) {
		setName(value);
		return this;
	}

}
