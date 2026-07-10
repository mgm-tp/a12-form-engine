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

import java.io.Serial;
import java.util.Collection;

public class CustomCellType extends CellType implements Named {
	@Serial
	private static final long serialVersionUID = 9159835050535094448L;

	protected String name;

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(final String name) {
		this.name = name;
	}

	@Override
	public boolean isNameSet() {
		return (this.name != null);
	}

	public CustomCellType withName(final String value) {
		setName(value);
		return this;
	}

	@Override
	public CustomCellType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public CustomCellType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public CustomCellType withOffset(final SizedIntegerType value) {
		setOffset(value);
		return this;
	}

	@Override
	public CustomCellType withSpan(final SizedIntegerType value) {
		setSpan(value);
		return this;
	}

	@Override
	public CustomCellType withId(final String value) {
		setId(value);
		return this;
	}
}
