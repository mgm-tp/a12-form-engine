// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

/**
 * Exposes the Name attribute of the Melies/Common model elements.
 *
 * @date $LastChangedDate: 2013-01-11 01:50:55 +0100 (Fr, 11. Jan 2013) $
 * @revision $LastChangedRevision: 1467 $
 */
public interface Named {

	String getName();

	void setName(String name);

	boolean isNameSet();
}
