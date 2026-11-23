// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.common;

public interface IdGenerator {

	/*
	 * (non-Javadoc)
	 *
	 * @see com.mgmtp.a12.melies.modelsupport.id.IIdGenerator#generate(java.lang.Class)
	 */
	<T> String generate(Class<T> clazz);

}
