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
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public abstract class CellType extends ControlGridNode implements Serializable, Annotated, Id, ConditionallyHidden {

	@Serial
	private static final long serialVersionUID = -1726469266825736411L;

	protected String id;
	protected List<Annotation> annotations;
	protected HideConditionType hideCondition;
	protected SizedIntegerType offset;
	protected SizedIntegerType span;

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

	public SizedIntegerType getOffset() {
		if (offset == null) {
			return new SizedIntegerType().withLg(0).withMd(0).withSm(0);
		} else {
			return offset;
		}
	}

	public void setOffset(final SizedIntegerType value) {
		this.offset = value;
	}

	public boolean isOffsetSet() {
		return (this.offset != null);
	}

	public void unsetOffset() {
		this.offset = null;
	}

	public SizedIntegerType getSpan() {
		if (span == null) {
			return new SizedIntegerType().withLg(1).withMd(1).withSm(1);
		} else {
			return span;
		}
	}

	public void setSpan(final SizedIntegerType value) {
		this.span = value;
	}

	public boolean isSpanSet() {
		return (this.span != null);
	}

	public void unsetSpan() {
		this.span = null;
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

	public CellType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public CellType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public ControlGridNode withHideCondition(final HideConditionType value) {
		setHideCondition(value);
		return this;
	}

	public CellType withOffset(final SizedIntegerType value) {
		setOffset(value);
		return this;
	}

	public CellType withSpan(final SizedIntegerType value) {
		setSpan(value);
		return this;
	}

	public CellType withId(final String value) {
		setId(value);
		return this;
	}
}
