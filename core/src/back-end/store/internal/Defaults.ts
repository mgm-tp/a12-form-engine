/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
