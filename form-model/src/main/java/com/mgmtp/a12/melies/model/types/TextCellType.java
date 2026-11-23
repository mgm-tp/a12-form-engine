// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serial;
import java.util.Collection;

public class TextCellType extends CellType implements Named {

	@Serial
	private static final long serialVersionUID = -8908092308562370181L;

	protected String name;
	protected MultilingualTextType content;
	protected TextCellDecorationEnumType decoration;

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

	public MultilingualTextType getContent() {
		return content;
	}

	public void setContent(final MultilingualTextType value) {
		this.content = value;
	}

	public boolean isContentSet() {
		return (this.content != null);
	}

	public TextCellDecorationEnumType getDecoration() {
		return decoration;
	}

	public void setDecoration(final TextCellDecorationEnumType value) {
		this.decoration = value;
	}

	public boolean isDecorationSet() {
		return (this.decoration != null);
	}

	public TextCellType withName(final String value) {
		setName(value);
		return this;
	}

	public TextCellType withContent(final MultilingualTextType value) {
		setContent(value);
		return this;
	}

	public TextCellType withDecoration(final TextCellDecorationEnumType value) {
		setDecoration(value);
		return this;
	}

	@Override
	public TextCellType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public TextCellType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public TextCellType withOffset(final SizedIntegerType value) {
		setOffset(value);
		return this;
	}

	@Override
	public TextCellType withSpan(final SizedIntegerType value) {
		setSpan(value);
		return this;
	}

	@Override
	public TextCellType withId(final String value) {
		setId(value);
		return this;
	}

}
