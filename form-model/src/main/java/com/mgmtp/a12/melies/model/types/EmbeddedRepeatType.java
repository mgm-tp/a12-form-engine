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
 * 1. Open-Source License – EUPL v1.2
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
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.Collection;

import com.mgmtp.a12.model.header.Annotation;

public class EmbeddedRepeatType extends RepeatType implements Serializable, MultiFileUploadRepeat {

	private final static long serialVersionUID = -4345618418688421949L;
	protected ControlGridType controlGrid;
	protected DefaultRowActionType defaultRowAction;
	private Boolean multiFileUpload;
	private MultiFileUploadOptionType multiFileUploadOptions;
	private TableStyleType tableStyle;

	public ControlGridType getControlGrid() {
		return controlGrid;
	}

	public void setControlGrid(final ControlGridType value) {
		if (value.getParent() != null) {
			throw new IllegalArgumentException("cannot add a control grid whose parent is already set");
		}
		value.setParent(this);
		this.controlGrid = value;
	}

	public boolean isControlGridSet() {
		return (this.controlGrid != null);
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
	public Boolean getMultiFileUpload() {
		return multiFileUpload;
	}

	@Override
	public void setMultiFileUpload(final Boolean multiFileUpload) {
		this.multiFileUpload = multiFileUpload;
	}

	@Override
	public boolean isMultiFileUploadSet() {
		return this.multiFileUpload != null;
	}

	@Override
	public void unsetMultiFileUpload() {
		this.multiFileUpload = null;
	}

	@Override
	public MultiFileUploadOptionType getMultiFileUploadOptions() {
		return multiFileUploadOptions;
	}

	@Override
	public void setMultiFileUploadOptions(final MultiFileUploadOptionType multiFileUploadOptions) {
		this.multiFileUploadOptions = multiFileUploadOptions;
	}

	@Override
	public boolean isMultiFileUploadOptionsSet() {
		return this.multiFileUploadOptions != null;
	}

	@Override
	public void unsetMultiFileUploadOptions() {
		this.multiFileUploadOptions = null;
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

	public EmbeddedRepeatType withControlGrid(final ControlGridType value) {
		setControlGrid(value);
		return this;
	}

	public EmbeddedRepeatType withDefaultRowAction(final DefaultRowActionType value) {
		setDefaultRowAction(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withFilterExpression(final String value) {
		setFilterExpression(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withRepeatOverviewColumn(final RepeatOverviewColumnType... values) {
		if (values != null) {
			for (final RepeatOverviewColumnType value : values) {
				getRepeatOverviewColumn().add(value);
			}
		}
		return this;
	}

	@Override
	public EmbeddedRepeatType withRepeatOverviewColumn(final Collection<RepeatOverviewColumnType> values) {
		if (values != null) {
			getRepeatOverviewColumn().addAll(values);
		}
		return this;
	}

	@Override
	public EmbeddedRepeatType withInitialSorting(final RepeatOverviewColumnRefType value) {
		setInitialSorting(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withScreenReaderColumnRef(final RepeatOverviewColumnRefType value) {
		setScreenReaderColumnRef(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withRowActionGroup(final RowActionGroupType value) {
		setRowActionGroup(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withGroupRef(final String value) {
		setGroupRef(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withEnableAdd(final boolean value) {
		setEnableAdd(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withEnableRemove(final boolean value) {
		setEnableRemove(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withEnableReorder(final boolean value) {
		setEnableReorder(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withEnableCopy(final boolean value) {
		setEnableCopy(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withPageSize(final int value) {
		setPageSize(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public EmbeddedRepeatType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public EmbeddedRepeatType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public EmbeddedRepeatType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public EmbeddedRepeatType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withName(final String value) {
		setName(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withMultiFileUpload(Boolean value) {
		setMultiFileUpload(value);
		return this;
	}

	@Override
	public EmbeddedRepeatType withMultiFileUploadOptions(MultiFileUploadOptionType value) {
		setMultiFileUploadOptions(value);
		return this;
	}

	@Override
	public RepeatType withTableStyle(TableStyleType value) {
		setTableStyle(value);
		return this;
	}
}
