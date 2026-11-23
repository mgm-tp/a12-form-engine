// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.button;

import com.mgmtp.a12.model.consistency.Problem;

import java.util.LinkedList;
import java.util.List;

class AbstractButtonChecker {
	final String modelName;
	final List<Problem> problems = new LinkedList<>();

	public AbstractButtonChecker(final String modelName) {
		this.modelName = modelName;
	}

	public List<Problem> getProblems() {
		return problems;
	}
}
