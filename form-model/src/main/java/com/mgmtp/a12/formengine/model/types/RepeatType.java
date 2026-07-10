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
import java.util.List;

public abstract class RepeatType extends ScreenElementType implements TableStyleRepeat, Serializable {

	private static final long serialVersionUID = 8307685353220789412L;
	protected String filterExpression;
	protected RepeatButtonLabelsType buttonLabels;
	protected ConfirmationTextsType confirmationTexts;
	protected List<RepeatOverviewColumnType> repeatOverviewColumn;
	protected RepeatOverviewColumnRefType initialSorting;
	protected RepeatOverviewColumnRefType screenReaderColumnRef;
	protected RowActionGroupType rowActionGroup;
	protected String groupRef;
	protected Boolean enableAdd;
	protected Boolean enableRemove;
	protected Boolean enableReorder;
	protected Boolean enableCopy;
	protected Integer pageSize;
	protected Boolean enableColumnsResize;

	protected Boolean titleHidden;

	public RepeatType() {
		repeatOverviewColumn = getRepeatOverviewColumn();
	}

	public String getFilterExpression() {
		return filterExpression;
	}

	public void setFilterExpression(final String value) {
		this.filterExpression = value;
	}

	public boolean isFilterExpressionSet() {
		return this.filterExpression != null;
	}

	public RepeatButtonLabelsType getButtonLabels() {
		return this.buttonLabels;
	}

	public void setButtonLabels(RepeatButtonLabelsType value) {
		this.buttonLabels = value;
	}

	public boolean isButtonLabelsSet() {
		return this.buttonLabels != null;
	}

	public void unsetButtonLabels() {
		this.buttonLabels = null;
	}

	public ConfirmationTextsType getConfirmationTexts() {
		return this.confirmationTexts;
	}

	public void setConfirmationTexts(ConfirmationTextsType value) {
		this.confirmationTexts = value;
	}

	public boolean isConfirmationTextsSet() {
		return this.confirmationTexts != null;
	}

	public void unsetConfirmationTexts() {
		this.confirmationTexts = null;
	}

	public List<RepeatOverviewColumnType> getRepeatOverviewColumn() {
		if (repeatOverviewColumn == null) {
			repeatOverviewColumn = new RepeatNodeList(this);
		}
		return this.repeatOverviewColumn;
	}

	public boolean isRepeatOverviewColumnSet() {
		return this.repeatOverviewColumn != null && !this.repeatOverviewColumn.isEmpty();
	}

	public void unsetRepeatOverviewColumn() {
		this.repeatOverviewColumn = null;
	}

	public RepeatOverviewColumnRefType getInitialSorting() {
		return initialSorting;
	}

	public void setInitialSorting(final RepeatOverviewColumnRefType value) {
		this.initialSorting = value;
	}

	public boolean isInitialSortingSet() {
		return this.initialSorting != null;
	}

	public RepeatOverviewColumnRefType getScreenReaderColumnRef() {
		return screenReaderColumnRef;
	}

	public void setScreenReaderColumnRef(final RepeatOverviewColumnRefType value) {
		this.screenReaderColumnRef = value;
	}

	public boolean isScreenReaderColumnRefSet() {
		return this.screenReaderColumnRef != null;
	}

	public RowActionGroupType getRowActionGroup() {
		return rowActionGroup;
	}

	public void setRowActionGroup(final RowActionGroupType value) {
		this.rowActionGroup = value;
	}

	public boolean isRowActionGroupSet() {
		return this.rowActionGroup != null;
	}

	public String getGroupRef() {
		return groupRef;
	}

	public void setGroupRef(final String value) {
		this.groupRef = value;
	}

	public boolean isGroupRefSet() {
		return this.groupRef != null;
	}

	public boolean isEnableAdd() {
		if (enableAdd == null) {
			return false;
		} else {
			return enableAdd;
		}
	}

	public void setEnableAdd(final boolean value) {
		this.enableAdd = value;
	}

	public boolean isEnableAddSet() {
		return this.enableAdd != null;
	}

	public void unsetEnableAdd() {
		this.enableAdd = null;
	}

	public boolean isEnableRemove() {
		if (enableRemove == null) {
			return false;
		} else {
			return enableRemove;
		}
	}

	public void setEnableRemove(final boolean value) {
		this.enableRemove = value;
	}

	public boolean isEnableRemoveSet() {
		return this.enableRemove != null;
	}

	public void unsetEnableRemove() {
		this.enableRemove = null;
	}

	public boolean isEnableReorder() {
		if (enableReorder == null) {
			return false;
		} else {
			return enableReorder;
		}
	}

	public void setEnableReorder(final boolean value) {
		this.enableReorder = value;
	}

	public boolean isEnableReorderSet() {
		return this.enableReorder != null;
	}

	public void unsetEnableReorder() {
		this.enableReorder = null;
	}

	public boolean isEnableCopy() {
		if (enableCopy == null) {
			return false;
		} else {
			return enableCopy;
		}
	}

	public void setEnableCopy(final boolean value) {
		this.enableCopy = value;
	}

	public boolean isEnableCopySet() {
		return this.enableCopy != null;
	}

	public void unsetEnableCopy() {
		this.enableCopy = null;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(final int value) {
		this.pageSize = value;
	}

	public boolean isPageSizeSet() {
		return this.pageSize != null;
	}

	public void unsetPageSize() {
		this.pageSize = null;
	}

	public boolean getTitleHidden() {
		return titleHidden;
	}

	public void setTitleHidden(final boolean value) {
		this.titleHidden = value;
	}

	public void unsetTitleHidden() {
		this.titleHidden = null;
	}

	public boolean isTitleHiddenSet() {
		return this.titleHidden != null;
	}

	public boolean isEnableColumnsResize() {
		if (enableColumnsResize == null) {
			return false;
		} else {
			return enableColumnsResize;
		}
	}

	public void setEnableColumnsResize(final boolean value) {
		this.enableColumnsResize = value;
	}

	public boolean isEnableColumnsResizeSet() {
		return (this.enableColumnsResize != null);
	}

	public void unsetEnableColumnsResize() {
		this.enableColumnsResize = null;
	}

	public RepeatType withFilterExpression(final String value) {
		setFilterExpression(value);
		return this;
	}

	public RepeatType withButtonLabels(final RepeatButtonLabelsType value) {
		this.buttonLabels = value;
		return this;
	}

	public RepeatType withConfirmationTexts(final ConfirmationTextsType value) {
		this.confirmationTexts = value;
		return this;
	}

	public RepeatType withRepeatOverviewColumn(final RepeatOverviewColumnType... values) {
		if (values != null) {
			for (final RepeatOverviewColumnType value : values) {
				getRepeatOverviewColumn().add(value);
			}
		}
		return this;
	}

	public RepeatType withRepeatOverviewColumn(final Collection<RepeatOverviewColumnType> values) {
		if (values != null) {
			getRepeatOverviewColumn().addAll(values);
		}
		return this;
	}

	public RepeatType withInitialSorting(final RepeatOverviewColumnRefType value) {
		setInitialSorting(value);
		return this;
	}

	public RepeatType withScreenReaderColumnRef(final RepeatOverviewColumnRefType value) {
		setScreenReaderColumnRef(value);
		return this;
	}

	public RepeatType withRowActionGroup(final RowActionGroupType value) {
		setRowActionGroup(value);
		return this;
	}

	public RepeatType withGroupRef(final String value) {
		setGroupRef(value);
		return this;
	}

	public RepeatType withEnableAdd(final boolean value) {
		setEnableAdd(value);
		return this;
	}

	public RepeatType withEnableRemove(final boolean value) {
		setEnableRemove(value);
		return this;
	}

	public RepeatType withEnableReorder(final boolean value) {
		setEnableReorder(value);
		return this;
	}

	public RepeatType withEnableCopy(final boolean value) {
		setEnableCopy(value);
		return this;
	}

	public RepeatType withPageSize(final int value) {
		setPageSize(value);
		return this;
	}

	@Override
	public RepeatType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public RepeatType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public RepeatType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public RepeatType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public RepeatType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public RepeatType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public RepeatType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public RepeatType withName(final String value) {
		setName(value);
		return this;
	}

	public RepeatType withTitleHidden(final boolean value) {
		setTitleHidden(value);
		return this;
	}

	public RepeatType withEnableColumnsResize(final boolean value) {
		setEnableColumnsResize(value);
		return this;
	}

	private static class RepeatNodeList extends NodeTreeList<RepeatOverviewColumnType> {

		private final RepeatType owner;

		public RepeatNodeList(final RepeatType owner) {
			this.owner = owner;
		}

		@Override
		protected void onAdd(final RepeatOverviewColumnType e) {
			if (e.getParent() != null) {
				throw new IllegalArgumentException("cannot add a column whose parent is already set");
			}
			e.setParent(owner);
		}

		@Override
		protected void onRemove(final RepeatOverviewColumnType e) {
			e.setParent(null);
		}
	}
}
