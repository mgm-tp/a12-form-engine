// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
