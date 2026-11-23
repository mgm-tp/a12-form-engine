// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.json;

import com.fasterxml.jackson.databind.util.StdConverter;

public class EmptyStringToNullConverter extends StdConverter<String, String> {
	@Override
	public String convert(final String value) {
		return value != null && !value.isEmpty() ? value : null;
	}
}
