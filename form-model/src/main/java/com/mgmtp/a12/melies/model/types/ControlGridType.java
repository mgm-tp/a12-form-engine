// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import com.mgmtp.a12.model.header.Annotation;

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
