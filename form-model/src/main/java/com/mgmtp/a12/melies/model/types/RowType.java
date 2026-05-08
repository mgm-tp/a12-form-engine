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

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class RowType extends ControlGridNode implements Annotated, Id, Named, ConditionallyHidden {

	@Serial
	private static final long serialVersionUID = 5598294915474393925L;

	protected String id;
	protected String name;
	protected LabelType title;
	protected List<StyleType> style;
	protected List<Annotation> annotations;
	protected HideConditionType hideCondition;
	protected List<CellType> cell;

	public RowType() {
		cell = getCell();
	}

	public List<CellType> getCell() {
		if (cell == null) {
			cell = new RowList(this);
		}
		return cell;
	}

	public LabelType getTitle() {
		return title;
	}

	public void setTitle(final LabelType value) {
		this.title = value;
	}

	public boolean isTitleSet() {
		return (this.title != null);
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

	@Override
	public List<Annotation> getAnnotations() {
		if (annotations == null) {
			annotations = new ArrayList<>();
		}
		return this.annotations;
	}

	public boolean isAnnotationSet() {
		return ((this.annotations != null) && (!this.annotations.isEmpty()));
	}

	public void unsetAnnotation() {
		this.annotations = null;
	}

	public boolean isCellSet() {
		return ((this.cell != null) && (!this.cell.isEmpty()));
	}

	public void unsetCell() {
		this.cell = null;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public void setId(final String value) {
		this.id = value;
	}

	@Override
	public boolean isIdSet() {
		return (this.id != null);
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

	@Override
	public HideConditionType getHideCondition() {
		return hideCondition;
	}

	@Override
	public void setHideCondition(final HideConditionType value) {
		this.hideCondition = value;
	}

	@Override
	public boolean isHideConditionSet() {
		return (this.hideCondition != null);
	}

	public RowType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	public RowType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	public RowType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	public RowType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public RowType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public RowType withHideCondition(final HideConditionType value) {
		setHideCondition(value);
		return this;
	}

	public RowType withCell(final CellType... values) {
		if (values != null) {
			for (final CellType value : values) {
				getCell().add(value);
			}
		}
		return this;
	}

	public RowType withCell(final Collection<CellType> values) {
		if (values != null) {
			getCell().addAll(values);
		}
		return this;
	}

	public RowType withId(final String value) {
		setId(value);
		return this;
	}

	public RowType withName(final String value) {
		setName(value);
		return this;
	}

	private static class RowList extends NodeTreeList<CellType> {
		private final RowType owner;

		public RowList(final RowType owner) {
			this.owner = owner;
		}

		@Override
		protected void onAdd(final CellType e) {
			if (e.getParent() != null) {
				throw new IllegalArgumentException("cannot add a cell whose parent is already set");
			}
			// set the parent. this only works for attached rows.
			// for detached rows: the parent will be set again in ControlGridList.onAdd
			e.setParent(owner.getParent());
		}

		@Override
		protected void onRemove(final CellType e) {
			e.setParent(null);
		}
	}
}
