// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.locale;

import org.apache.commons.collections4.CollectionUtils;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Converts {@link java.util.Locale} to locale strings using underscores as separators.
 */
public class LocaleConverter {

	private LocaleConverter() {}

	/**
	 * Converts {@link java.util.Locale} to a locale string using underscores as separators.
	 */
	public static String convert(final Locale locale) {
		Objects.requireNonNull(locale);
		return locale.toLanguageTag().replaceAll("-", "_");
	}

	public static List<String> convert(final List<Locale> locales) {
		return CollectionUtils.emptyIfNull(locales).stream().map(LocaleConverter::convert).collect(Collectors.toList());
	}
}
