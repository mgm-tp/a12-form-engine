// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.fixes;

import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

/**
 * <p>
 * <b>Note: This is an internal API and not intended for public use.</b>
 * </p>
 * <p>
 * Provides a mapping between {@link com.mgmtp.a12.model.ui.form.consistency.FormModelCategory} and {@link ProblemFix}.
 * </p>
 */
public class ProblemFixFinder {

	public static Optional<ProblemFix> find(final FormModelCategory problemCategory) {
		return Optional.ofNullable(KNOWN_FIXES.get(problemCategory));
	}

	private static final Map<FormModelCategory, ProblemFix> KNOWN_FIXES = Collections.singletonMap(
		FormModelCategory.FORM_MODEL_DUPLICATE_ELEMENT_NAME, new DuplicateSiblingNameFix()
	);
}
