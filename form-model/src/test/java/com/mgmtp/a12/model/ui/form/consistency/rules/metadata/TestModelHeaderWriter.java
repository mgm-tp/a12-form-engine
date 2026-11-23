// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.model.header.Header;
import org.apache.commons.lang3.reflect.FieldUtils;

import java.util.List;
import java.util.Locale;

/**
 * <p>Can set locales on {@link Header} objects using Java's reflection API.
 * The header interface and its default implementation do not allow this.</p>
 * <p><b>Note: This class should only be used in test code!</b></p>
 */
class TestModelHeaderWriter {

	static void setLocales(final Header header, final List<Locale> locales) {
		try {
			// implicitly assumes header to be an instance of HeaderImpl from base-model-api
			FieldUtils.writeField(header, "locales", locales, true);
		} catch (final IllegalAccessException iae) {
			throw new RuntimeException(iae);
		}
	}
}
