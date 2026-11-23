// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	Localizable,
	LocalizableArgs
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { DEFAULT_TRANSLATIONS } from "./resources.js";

/**
 * @internal
 */
export function createResourceLocalizable(key: string, values: LocalizableArgs = {}): Localizable {
	return localizableFromLocalizationTreeMap(key, DEFAULT_TRANSLATIONS, values);
}
