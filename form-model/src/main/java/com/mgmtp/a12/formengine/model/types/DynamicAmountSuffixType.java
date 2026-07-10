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

import java.io.Serializable;

public class DynamicAmountSuffixType extends AmountSuffixType implements Serializable {
	private static final long serialVersionUID = 8663378482024370004L;
	protected String fieldRef;

	@Override
	public void setType(final String type) {
		if ("dynamic".equals(type)) {
			this.type = type;
		} else {
			throw new IllegalArgumentException(type);
		}
	}

	public String getFieldRef() {
		return this.fieldRef;
	}

	public void setFieldRef(final String fieldRef) {
		this.fieldRef = fieldRef;
	}

	public boolean isFieldRefSet() {
		return (this.fieldRef != null);
	}

	public DynamicAmountSuffixType withFieldRef(final String fieldRef) {
		this.setFieldRef(fieldRef);
		return this;
	}
}
