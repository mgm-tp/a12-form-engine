// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { Commands } from "../../actions.js";

/** @internal */
export function handleSetLocale(_state: Locale, action: Action<Commands.SetLocalePayload>): Locale {
	return action.payload.locale;
}
