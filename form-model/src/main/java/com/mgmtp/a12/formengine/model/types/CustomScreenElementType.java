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

public class CustomScreenElementType extends ScreenElementType implements Serializable, Referencing {

	private static final long serialVersionUID = 2254936105162502155L;
	protected String reference;
	protected Number height;

	@Override
	public String getReference() {
		return reference;
	}

	@Override
	public void setReference(final String reference) {
		this.reference = reference;
	}

	@Override
	public void unsetReference() {
		this.reference = null;
	}

	@Override
	public boolean isReferenceSet() {
		return this.reference != null;
	}

	public CustomScreenElementType withReference(final String value) {
		setReference(value);
		return this;
	}

	public boolean isHeightSet() {
		return (this.height != null);
	}

	public Number getHeight() {
		return height;
	}

	public void setHeight(Number height) {
		this.height = height;
	}

	@Override
	public CustomScreenElementType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public CustomScreenElementType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public CustomScreenElementType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public CustomScreenElementType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public CustomScreenElementType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public CustomScreenElementType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public CustomScreenElementType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public CustomScreenElementType withName(final String value) {
		setName(value);
		return this;
	}
}
