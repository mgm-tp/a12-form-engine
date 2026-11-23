// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * This module provides functionality and resources for localization of the Form-Engine.
 *
 * @packageDocumentation
 */

import type { LocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { de } from "./internal/languages/de.js";
import { en } from "./internal/languages/en.js";

export { RESOURCE_KEYS } from "./internal/languages/keys.js";

/** @internal */
export const DEFAULT_TRANSLATIONS: LocalizationTreeMap = { en, de };
