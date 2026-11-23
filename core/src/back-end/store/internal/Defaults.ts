// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	DataFormats,
	Locale,
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { MiddlewareOptions } from "./middleware/middleware-options.js";
import { UiStateSelectors } from "./selectors/ui-state.js";
import type { EngineStore } from "./store.js";

/**
 * Function to create default middleware options.
 * @param options Partial {@link MiddlewareOptions}.
 *
 * Defaults are used for all options which are not set.
 */
export function createDefaultMiddlewareOptions(
	options: Partial<MiddlewareOptions> = {}
): MiddlewareOptions {
	const { externalEnumerationProvider, disableRepeatValidationOnLeaving, nowProvider } = options;

	const converter =
		options.converter ||
		(state => defaultValueConversion(defaultDataFormats(UiStateSelectors.locale()(state))));

	const localizer = options.localizer || defaultLocalizerProvider(converter);

	return {
		converter,
		localizer,
		externalEnumerationProvider,
		nowProvider,
		disableRepeatValidationOnLeaving
	};

	function defaultLocalizerProvider(
		converterProvider: EngineStore.Provider<ValueConversion>
	): EngineStore.Provider<Localizer> {
		return state => {
			const locale = UiStateSelectors.locale()(state);
			const dataFormats = defaultDataFormatsProvider(locale);
			const conversion = converterProvider(state);

			return defaultLocalizerFactory({ locale, dataFormats, conversion });
		};
	}
}

/**
 * Provider for `DataFormats`.
 * @returns a `DataFormats` object for a given locale.
 */
export interface DataFormatsProvider {
	(locale: Locale): Partial<DataFormats>;
}

/**
 * Default presentation information, which contains the formats for
 * en_US and de_DE
 * @throws if the given locale is none of the above.
 */
export const defaultDataFormatsProvider: DataFormatsProvider = locale => {
	return defaultDataFormats(locale);
};
