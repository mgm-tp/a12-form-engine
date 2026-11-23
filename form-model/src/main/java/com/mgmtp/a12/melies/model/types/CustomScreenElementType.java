// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serializable;
import java.util.Collection;

public class CustomScreenElementType extends ScreenElementType implements Serializable {

	private static final long serialVersionUID = 2254936105162502155L;
	protected Number height;

	public boolean isHeightSet() {
		return (this.height != null);
	}

	public Number getHeight() {
		return height;
	}

	public void setHeight(Number height) {
		this.height = height;
	}

	@Override
	public CustomScreenElementType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public CustomScreenElementType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public CustomScreenElementType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public CustomScreenElementType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public CustomScreenElementType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public CustomScreenElementType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public CustomScreenElementType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public CustomScreenElementType withName(final String value) {
		setName(value);
		return this;
	}
}
