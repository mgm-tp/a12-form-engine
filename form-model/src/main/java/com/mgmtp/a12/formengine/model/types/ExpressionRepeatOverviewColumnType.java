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
