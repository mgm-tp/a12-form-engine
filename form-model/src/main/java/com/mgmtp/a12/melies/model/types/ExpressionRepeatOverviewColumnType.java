// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ExpressionRepeatOverviewColumnType extends RepeatOverviewColumnType implements Named {

	@Serial
	private static final long serialVersionUID = -8048852506179218955L;

	protected String name;
	protected String expression;
	protected List<StyleType> style;

	public String getExpression() {
		return expression;
	}

	public void setExpression(final String value) {
		this.expression = value;
	}

	public boolean isExpressionSet() {
		return (this.expression != null);
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

	public List<StyleType> getStyle() {
		if (style == null) {
			style = new ArrayList<>();
		}
		return this.style;
	}

	public boolean isStyleSet() {
		return ((this.style != null) && (!this.style.isEmpty()));
	}

	public void unsetStyle() {
		this.style = null;
	}

	public ExpressionRepeatOverviewColumnType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	public ExpressionRepeatOverviewColumnType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	public ExpressionRepeatOverviewColumnType withExpression(final String value) {
		setExpression(value);
		return this;
	}

	public ExpressionRepeatOverviewColumnType withName(final String value) {
		setName(value);
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withLabel(final LabelType value) {
		setLabel(value);
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withWidth(final float value) {
		setWidth(value);
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withSortable(final boolean value) {
		setSortable(value);
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withFilterable(final boolean value) {
		setFilterable(value);
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withPinDirection(final PinDirectionType value) {
		setPinDirection(value);
		return this;
	}

	@Override
	public ExpressionRepeatOverviewColumnType withPreferredSorting(final PreferredSortingType value) {
		setPreferredSorting(value);
		return this;
	}

}
