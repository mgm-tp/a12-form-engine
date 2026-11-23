// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import com.mgmtp.a12.model.header.Annotation;


import java.io.Serial;
import java.util.Collection;

public class ExpressionCellType extends CellType implements Named {

	@Serial
	private static final long serialVersionUID = -8661760267022021011L;

	protected String name;
	protected String expression;
	protected LabelType label;

	public String getExpression() {
		return expression;
	}

	public void setExpression(final String value) {
		this.expression = value;
	}

	public boolean isExpressionSet() {
		return (this.expression != null);
	}

	public LabelType getLabel() {
		return label;
	}

	public void setLabel(final LabelType value) {
		this.label = value;
	}

	public boolean isLabelSet() {
		return (this.label != null);
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

	public ExpressionCellType withExpression(final String value) {
		setExpression(value);
		return this;
	}

	public ExpressionCellType withLabel(final LabelType value) {
		setLabel(value);
		return this;
	}

	public ExpressionCellType withName(final String value) {
		setName(value);
		return this;
	}

	@Override
	public ExpressionCellType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public ExpressionCellType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public ExpressionCellType withOffset(final SizedIntegerType value) {
		setOffset(value);
		return this;
	}

	@Override
	public ExpressionCellType withSpan(final SizedIntegerType value) {
		setSpan(value);
		return this;
	}

	@Override
	public ExpressionCellType withId(final String value) {
		setId(value);
		return this;
	}

}
