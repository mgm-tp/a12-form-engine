// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.consistency.rules.ModelConsistencyRule;

import java.util.List;

/**
 * Concrete interface for {@link MeliesModel} consistency rule.
 */
public interface FormModelConsistencyRule extends ModelConsistencyRule<MeliesModel> {

	@Override
	List<Problem> executeRule(MeliesModel model) throws FatalRuleProblemException;
}
