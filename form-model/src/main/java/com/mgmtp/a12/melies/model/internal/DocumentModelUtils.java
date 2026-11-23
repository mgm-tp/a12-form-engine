// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.internal;

import com.mgmtp.a12.kernel.md.model.api.IIdNamed;

public class DocumentModelUtils {
	private DocumentModelUtils() {
	}

	public static boolean isEqual(final IIdNamed element1, final IIdNamed element2) {
		return element1 != null && element2 != null && element1.getId().equals(element2.getId());
	}

	public static boolean isNotEqual(final IIdNamed element1, final IIdNamed element2) {
		return !isEqual(element1, element2);
	}
}
