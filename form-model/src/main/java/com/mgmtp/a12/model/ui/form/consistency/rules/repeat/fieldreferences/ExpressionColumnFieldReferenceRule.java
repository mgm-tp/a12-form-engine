// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.fieldreferences;

import java.util.List;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatRule;

/**
 * Repeat expression columns must reference fields which are accessible from the bound group of the repeat.
 */
public class ExpressionColumnFieldReferenceRule extends AbstractRepeatRule {

	@Override
	public AbstractRepeatChecker getRuleChecker(final MeliesModel model, final List<Problem> problems) {

		return new ExpressionColumnReferenceChecker(model, createDocumentModelService(model, problems));
	}
}
