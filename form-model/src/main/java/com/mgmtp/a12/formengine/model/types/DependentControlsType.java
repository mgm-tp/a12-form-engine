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
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class DependentControlsType implements Serializable {

	private final static long serialVersionUID = -5431296895738367079L;
	protected List<ScreenElementRefType> screenElement;

	public List<ScreenElementRefType> getScreenElement() {
		if (screenElement == null) {
			screenElement = new ArrayList<ScreenElementRefType>();
		}
		return this.screenElement;
	}

	public boolean isScreenElementSet() {
		return ((this.screenElement != null) && (!this.screenElement.isEmpty()));
	}

	public void unsetScreenElement() {
		this.screenElement = null;
	}

	public DependentControlsType withScreenElement(final ScreenElementRefType... values) {
		if (values != null) {
			for (final ScreenElementRefType value : values) {
				getScreenElement().add(value);
			}
		}
		return this;
	}

	public DependentControlsType withScreenElement(final Collection<ScreenElementRefType> values) {
		if (values != null) {
			getScreenElement().addAll(values);
		}
		return this;
	}

}
