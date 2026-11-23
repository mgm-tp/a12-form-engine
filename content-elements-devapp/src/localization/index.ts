// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	Localizable,
	LocalizableArgs
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type {
	Locale,
	LocalizationTreeMap
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { en_US } from "./resources/en_US.js";

export const DEFAULT_TRANSLATIONS: LocalizationTreeMap = {
	en: en_US
};
/**
 * Locale with name of country
 */
type LocaleWithName = Locale & { name?: string };
const supportedLocalesWithName: LocaleWithName[] = [
	{
		name: "English",
		language: "en",
		country: "US"
	}
];

export const supportedLocales: Locale[] = supportedLocalesWithName.map(({ country, language }) => ({
	country,
	language
}));

/** @internal */
export function createResourceLocalizable(key: string, values: LocalizableArgs = {}): Localizable {
	return localizableFromLocalizationTreeMap(key, DEFAULT_TRANSLATIONS, values);
}
