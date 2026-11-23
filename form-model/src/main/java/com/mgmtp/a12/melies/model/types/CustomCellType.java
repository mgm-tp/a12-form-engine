// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serial;
import java.util.Collection;

public class CustomCellType extends CellType implements Named {
	@Serial
	private static final long serialVersionUID = 9159835050535094448L;

	protected String name;

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(final String name) {
		this.name = name;
	}

	@Override
	public boolean isNameSet() {
		return (this.name != null);
	}

	public CustomCellType withName(final String value) {
		setName(value);
		return this;
	}

	@Override
	public CustomCellType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public CustomCellType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public CustomCellType withOffset(final SizedIntegerType value) {
		setOffset(value);
		return this;
	}

	@Override
	public CustomCellType withSpan(final SizedIntegerType value) {
		setSpan(value);
		return this;
	}

	@Override
	public CustomCellType withId(final String value) {
		setId(value);
		return this;
	}
}
