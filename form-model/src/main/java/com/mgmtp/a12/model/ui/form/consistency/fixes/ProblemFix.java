// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.fixes;

import com.mgmtp.a12.melies.model.MeliesModel;

/**
 * <p>
 * <b>Note: This is an internal API and not intended for public use.</b>
 * </p>
 * <p>
 * Provides an automated solution to fix a specific type of {@link com.mgmtp.a12.model.ui.form.FormModel} inconsistency represented by a {@link com.mgmtp.a12.model.ui.form.consistency.FormModelCategory}.
 * </p>
 */
public interface ProblemFix {

	/**
	 * <p>
	 * <b>Note: This is an internal API and not intended for public use.</b>
	 * </p>
	 * <p>
	 * Fix the given model.
	 * </p>
	 */
	void fix(MeliesModel model);
}
