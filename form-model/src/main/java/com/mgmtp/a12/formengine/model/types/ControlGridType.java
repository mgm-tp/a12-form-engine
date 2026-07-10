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

public class ControlGridType extends ScreenElementType implements Serializable, Layoutable {

	private final static long serialVersionUID = 3854672851975786556L;
	protected SizedStringType layout;
	protected List<RowType> row;
	protected ReadonlyPresentationEnumType readonlyPresentation;
	protected ControlGridVerticalAlignmentEnumType verticalAlignment;

	public ControlGridType() {
		this.row = getRow();
	}

	public SizedStringType getLayout() {
		return layout;
	}

	public void setLayout(final SizedStringType value) {
		this.layout = value;
	}

	public boolean isLayoutSet() {
		return (this.layout != null);
	}

	public List<RowType> getRow() {
		if (this.row == null) {
			this.row = new ControlGridList(this);
		}
		return this.row;
	}

	public boolean isRowSet() {
		return ((this.row != null) && (!this.row.isEmpty()));
	}

	public void unsetRow() {
		this.row = null;
	}

	public ReadonlyPresentationEnumType getReadonlyPresentation() {
		return readonlyPresentation;
	}

	public void setReadonlyPresentation(final ReadonlyPresentationEnumType value) {
		this.readonlyPresentation = value;
	}

	public boolean isReadonlyPresentationSet() {
		return (this.readonlyPresentation != null);
	}

	public ControlGridVerticalAlignmentEnumType getVerticalAlignment() {
		return verticalAlignment;
	}

	public void setVerticalAlignment(ControlGridVerticalAlignmentEnumType verticalAlignment) {
		this.verticalAlignment = verticalAlignment;
	}

	public ControlGridType withLayout(final SizedStringType value) {
		setLayout(value);
		return this;
	}

	public ControlGridType withRow(final RowType... values) {
		if (values != null) {
			for (final RowType value : values) {
				getRow().add(value);
			}
		}
		return this;
	}

	public ControlGridType withRow(final Collection<RowType> values) {
		if (values != null) {
			getRow().addAll(values);
		}
		return this;
	}

	@Override
	public ControlGridType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public ControlGridType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public ControlGridType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public ControlGridType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public ControlGridType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public ControlGridType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public ControlGridType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public ControlGridType withName(final String value) {
		setName(value);
		return this;
	}

	public ControlGridType withVerticalAlignment(final ControlGridVerticalAlignmentEnumType value) {
		setVerticalAlignment(value);
		return this;
	}

	public ControlGridType withReadonlyPresentation(final ReadonlyPresentationEnumType value) {
		setReadonlyPresentation(value);
		return this;
	}

	public static class ControlGridList extends NodeTreeList<RowType> {

		private final ControlGridType owner;

		public ControlGridList(final ControlGridType owner) {
			this.owner = owner;
		}

		@Override
		protected void onAdd(final RowType e) {
			if (e.getParent() != null) {
				throw new IllegalArgumentException("cannot add a row whose parent is already set");
			}
			// set parent of row
			e.setParent(owner);

			// set the grid as parent for cells, too
			// this is necessary for newly created rows
			// for attached rows, RowList sets the parent
			for (final CellType element : e.getCell()) {
				element.setParent(owner);
			}
		}

		@Override
		protected void onRemove(final RowType e) {
			e.setParent(null);
			for (final CellType element : e.getCell()) {
				element.setParent(null);
			}
		}
	}
}
