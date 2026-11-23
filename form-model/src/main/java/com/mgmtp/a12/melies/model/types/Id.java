// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

/**
 * Exposes the ID attribute of the Melies/Common model elements.
 *
 * @date $LastChangedDate: 2012-08-13 15:12:16 +0200 (Mo, 13. Aug 2012) $
 * @revision $LastChangedRevision: 675 $
 */
public interface Id {
	String getId();

	void setId(String id);

	boolean isIdSet();
}
