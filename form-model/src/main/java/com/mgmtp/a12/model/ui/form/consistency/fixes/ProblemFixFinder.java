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
