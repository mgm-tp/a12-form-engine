// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;

class RepeatModelVisitor extends ModelVisitor {

	private final AbstractRepeatChecker ruleChecker;

	public RepeatModelVisitor(final AbstractRepeatChecker ruleChecker) {
		this.ruleChecker = ruleChecker;
	}

	@Override
	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		ruleChecker.executeChecker(repeat, repeat.getName());
		return true;
	}

	@Override
	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		ruleChecker.executeChecker(repeat, repeat.getName());
		return true;
	}

	@Override
	public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
		ruleChecker.executeChecker(repeat, repeat.getName());
		return true;
	}
}
