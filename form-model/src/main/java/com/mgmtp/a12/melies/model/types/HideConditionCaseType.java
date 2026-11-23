// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serial;
import java.io.Serializable;

public class HideConditionCaseType implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String masterValue;

    public String getMasterValue() {
        return masterValue;
    }

    public void setMasterValue(String masterValue) {
        this.masterValue = masterValue;
    }

	public boolean isMasterValueSet() {
		return (this.masterValue != null);
	}

    public HideConditionCaseType withMasterValue(final String masterValue) {
        setMasterValue(masterValue);
        return this;
    }
}
