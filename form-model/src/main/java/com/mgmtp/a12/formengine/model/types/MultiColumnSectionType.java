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

import java.io.Serializable;
import java.util.Collection;

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
