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

public class InlineRepeatType extends RepeatType implements Serializable, InfiniteScrollableRepeat, MultiFileUploadRepeat {

	private final static long serialVersionUID = -2398073072019117227L;
	private Boolean infiniteScrolling;
	private TableStyleType tableStyle;
	private ReadonlyPresentationEnumType readonlyPresentation;
	private Boolean multiFileUpload;
	private MultiFileUploadOptionType multiFileUploadOptions;

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

	public ReadonlyPresentationEnumType getReadonlyPresentation() {
		return readonlyPresentation;
	}

	public void setReadonlyPresentation(final ReadonlyPresentationEnumType readonlyPresentation) {
		this.readonlyPresentation = readonlyPresentation;
	}

	public void unsetReadonlyPresentation() {
		this.readonlyPresentation = null;
	}

	public boolean isReadonlyPresentationSet() {
		return this.readonlyPresentation != null;
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
	public void unsetMultiFileUpload() {
		this.multiFileUpload = null;
	}

	@Override
	public boolean isMultiFileUploadSet() {
		return this.multiFileUpload != null;
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
	public void unsetMultiFileUploadOptions() {
		this.multiFileUploadOptions = null;
	}

	@Override
	public boolean isMultiFileUploadOptionsSet() {
		return this.multiFileUploadOptions != null;
	}

	@Override
	public InlineRepeatType withFilterExpression(final String value) {
		setFilterExpression(value);
		return this;
	}

	@Override
	public InlineRepeatType withRepeatOverviewColumn(final RepeatOverviewColumnType... values) {
		if (values != null) {
			for (final RepeatOverviewColumnType value : values) {
				getRepeatOverviewColumn().add(value);
			}
		}
		return this;
	}

	@Override
	public InlineRepeatType withRepeatOverviewColumn(final Collection<RepeatOverviewColumnType> values) {
		if (values != null) {
			getRepeatOverviewColumn().addAll(values);
		}
		return this;
	}

	@Override
	public InlineRepeatType withInitialSorting(final RepeatOverviewColumnRefType value) {
		setInitialSorting(value);
		return this;
	}

	@Override
	public InlineRepeatType withScreenReaderColumnRef(final RepeatOverviewColumnRefType value) {
		setScreenReaderColumnRef(value);
		return this;
	}

	@Override
	public InlineRepeatType withRowActionGroup(final RowActionGroupType value) {
		setRowActionGroup(value);
		return this;
	}

	@Override
	public InlineRepeatType withGroupRef(final String value) {
		setGroupRef(value);
		return this;
	}

	@Override
	public InlineRepeatType withEnableAdd(final boolean value) {
		setEnableAdd(value);
		return this;
	}

	@Override
	public InlineRepeatType withEnableRemove(final boolean value) {
		setEnableRemove(value);
		return this;
	}

	@Override
	public InlineRepeatType withEnableReorder(final boolean value) {
		setEnableReorder(value);
		return this;
	}

	@Override
	public InlineRepeatType withEnableCopy(final boolean value) {
		setEnableCopy(value);
		return this;
	}

	@Override
	public InlineRepeatType withPageSize(final int value) {
		setPageSize(value);
		return this;
	}

	@Override
	public InlineRepeatType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public InlineRepeatType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public InlineRepeatType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public InlineRepeatType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public InlineRepeatType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public InlineRepeatType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public InlineRepeatType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public InlineRepeatType withName(final String value) {
		setName(value);
		return this;
	}

	@Override
	public RepeatType withInfiniteScrolling(final boolean value) {
		setInfiniteScrolling(value);
		return this;
	}

	@Override
	public RepeatType withTableStyle(TableStyleType value) {
		setTableStyle(value);
		return this;
	}

	public InlineRepeatType withReadonlyPresentation(ReadonlyPresentationEnumType value) {
		setReadonlyPresentation(value);
		return this;
	}

	@Override
	public InlineRepeatType withMultiFileUpload(Boolean value) {
		setMultiFileUpload(value);
		return this;
	}

	@Override
	public InlineRepeatType withMultiFileUploadOptions(MultiFileUploadOptionType value) {
		setMultiFileUploadOptions(value);
		return this;
	}
}
