// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
