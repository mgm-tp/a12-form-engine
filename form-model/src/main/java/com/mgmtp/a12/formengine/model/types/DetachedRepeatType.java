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

public class DetachedRepeatType extends RepeatType implements Serializable, InfiniteScrollableRepeat {

	private final static long serialVersionUID = 8119496245411459181L;
	protected ScreenType detailScreen;
	protected DefaultRowActionType defaultRowAction;
	private Boolean infiniteScrolling;
	private TableStyleType tableStyle;

	public ScreenType getScreen() {
		return detailScreen;
	}

	public void setScreen(final ScreenType value) {
		if (value.getParentScreenElement() != null) {
			throw new IllegalArgumentException("cannot add a screen group element whose screen element is already set");
		}
		value.setParentScreenElement(this);
		this.detailScreen = value;
	}

	public boolean isDetailScreenSet() {
		return (this.detailScreen != null);
	}

	public DefaultRowActionType getDefaultRowAction() {
		return defaultRowAction;
	}

	public void setDefaultRowAction(final DefaultRowActionType value) {
		this.defaultRowAction = value;
	}

	public boolean isDefaultRowActionSet() {
		return (this.defaultRowAction != null);
	}

	@Override
	public Boolean getInfiniteScrolling() {
		return infiniteScrolling;
	}

	@Override
	public void setInfiniteScrolling(final Boolean infiniteScrolling) {
		this.infiniteScrolling = infiniteScrolling;
	}

	@Override
	public void unsetInfiniteScrolling() {
		this.infiniteScrolling = null;
	}

	@Override
	public boolean isInfiniteScrollingSet() {
		return this.infiniteScrolling != null;
	}

	@Override
	public TableStyleType getTableStyle() {
		return tableStyle;
	}

	@Override
	public void setTableStyle(final TableStyleType style) {
		this.tableStyle = style;
	}

	@Override
	public void unsetTableStyle() {
		this.tableStyle = null;
	}

	@Override
	public boolean isTableStyleSet() {
		return this.tableStyle != null;
	}

	public DetachedRepeatType withDetailScreen(final ScreenType value) {
		setScreen(value);
		return this;
	}

	public DetachedRepeatType withDefaultRowAction(final DefaultRowActionType value) {
		setDefaultRowAction(value);
		return this;
	}

	@Override
	public DetachedRepeatType withFilterExpression(final String value) {
		setFilterExpression(value);
		return this;
	}

	@Override
	public DetachedRepeatType withRepeatOverviewColumn(final RepeatOverviewColumnType... values) {
		if (values != null) {
			for (final RepeatOverviewColumnType value : values) {
				getRepeatOverviewColumn().add(value);
			}
		}
		return this;
	}

	@Override
	public DetachedRepeatType withRepeatOverviewColumn(final Collection<RepeatOverviewColumnType> values) {
		if (values != null) {
			getRepeatOverviewColumn().addAll(values);
		}
		return this;
	}

	@Override
	public DetachedRepeatType withInitialSorting(final RepeatOverviewColumnRefType value) {
		setInitialSorting(value);
		return this;
	}

	@Override
	public DetachedRepeatType withScreenReaderColumnRef(final RepeatOverviewColumnRefType value) {
		setScreenReaderColumnRef(value);
		return this;
	}

	@Override
	public DetachedRepeatType withRowActionGroup(final RowActionGroupType value) {
		setRowActionGroup(value);
		return this;
	}

	@Override
	public DetachedRepeatType withGroupRef(final String value) {
		setGroupRef(value);
		return this;
	}

	@Override
	public DetachedRepeatType withEnableAdd(final boolean value) {
		setEnableAdd(value);
		return this;
	}

	@Override
	public DetachedRepeatType withEnableRemove(final boolean value) {
		setEnableRemove(value);
		return this;
	}

	@Override
	public DetachedRepeatType withEnableReorder(final boolean value) {
		setEnableReorder(value);
		return this;
	}

	@Override
	public DetachedRepeatType withEnableCopy(final boolean value) {
		setEnableCopy(value);
		return this;
	}

	@Override
	public DetachedRepeatType withPageSize(final int value) {
		setPageSize(value);
		return this;
	}

	@Override
	public DetachedRepeatType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public DetachedRepeatType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public DetachedRepeatType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public DetachedRepeatType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public DetachedRepeatType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public DetachedRepeatType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public DetachedRepeatType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public DetachedRepeatType withName(final String value) {
		setName(value);
		return this;
	}

	@Override
	public RepeatType withInfiniteScrolling(final boolean value) {
		setInfiniteScrolling(value);
		return this;
	}

	@Override
	public RepeatType withTableStyle(final TableStyleType value) {
		setTableStyle(value);
		return this;
	}
}
