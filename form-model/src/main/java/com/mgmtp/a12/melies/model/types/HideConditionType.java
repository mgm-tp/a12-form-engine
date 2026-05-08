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

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class HideConditionType implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

	private String masterField;
	private List<HideConditionCaseType> cases;

	public String getMasterField() {
		return masterField;
	}

	public void setMasterField(final String masterField) {
		this.masterField = masterField;
	}

	public boolean isMasterFieldSet() {
		return masterField != null;
	}

	public List<HideConditionCaseType> getCases() {
		return cases;
	}

	public void setCases(final List<HideConditionCaseType> cases) {
		this.cases = cases;
	}

	public boolean isCasesSet() {
		return (this.cases != null) && (!this.cases.isEmpty());
	}

	public void unsetCases() {
		this.cases = null;
	}

	public HideConditionType withMasterField(final String masterField) {
		setMasterField(masterField);
		return this;
	}

	public HideConditionType withCases(final HideConditionCaseType... values) {
		if (values != null) {
			if (this.cases == null) {
				this.cases = new ArrayList<>();
			}
			Collections.addAll(this.cases, values);
		}
		return this;
	}

	public HideConditionType withCases(final java.util.Collection<HideConditionCaseType> values) {
		if (values != null) {
			if (this.cases == null) {
				this.cases = new ArrayList<>();
			}
			this.cases.addAll(values);
		}
		return this;
	}
}
