// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public abstract class AncestorUtil {

	private AncestorUtil() {
	}

	public static <T> T findAncestorOfType(final TreeNode element, final Class<T> type) {
		TreeNode current = element.getParentNode();
		while (current != null && !(type.isAssignableFrom(current.getClass()))) {
			current = current.getParentNode();
		}
		return type.cast(current);
	}
}
