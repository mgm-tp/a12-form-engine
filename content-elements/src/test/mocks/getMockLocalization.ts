// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

export function getMockLocalization(conversion?: Partial<ValueConversion>): LocalizerContext.Type {
	return {
		locale: { language: "en", country: "US" },
		localizer: localizable => localizable.key,
		conversion: {
			parseValue: () => ({
				value: ""
			}),
			formatValue: () => "",
			...conversion
		},
		dataFormats: {}
	};
}
