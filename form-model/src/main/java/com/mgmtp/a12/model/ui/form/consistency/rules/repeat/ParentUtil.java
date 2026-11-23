// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat;

import com.mgmtp.a12.kernel.md.model.api.IGroup;

/**
 * Provides parent lookup functionality.
 */
public class ParentUtil {

	public static boolean isParent(final IGroup potentialParent, final IGroup current) {
		if (current == null) {
			return false;
		} else {
			return isEqualById(potentialParent, current.getParent())
				|| isParent(potentialParent, current.getParent());
		}
	}

	public static boolean isEqualById(final IGroup group1, final IGroup group2) {
		return group1 != null && group2 != null && group1.getId().equals(group2.getId());
	}

}
