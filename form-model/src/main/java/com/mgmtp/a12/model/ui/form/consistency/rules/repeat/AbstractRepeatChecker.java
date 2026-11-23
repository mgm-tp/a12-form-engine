// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.model.consistency.Problem;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractRepeatChecker {

	protected List<Problem> repeatProblems = new ArrayList<>();

	public abstract void executeChecker(final RepeatType repeat, final String checkedElement);

	public List<Problem> getRepeatProblems() {
		return repeatProblems;
	}

}
