// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

export const US_LOCALE = { language: "en", country: "US" } as const satisfies Locale;

export const DE_LOCALE = { language: "de", country: "DE" } as const satisfies Locale;

export type TestLocale = typeof US_LOCALE | typeof DE_LOCALE;
