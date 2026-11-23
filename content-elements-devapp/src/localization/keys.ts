// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { initializeKeys } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

export const RESOURCE_KEYS = {
	header: {
		debugDocument: {
			title: "",
			button: "",
			checkbox: ""
		},
		editorSettings: {
			button: "",
			input: {
				dmReference: {
					label: ""
				},
				baseGroup: {
					label: "",
					hintTemplate: "",
					placeholder: ""
				}
			}
		},
		validation: {
			button: ""
		}
	}
};

initializeKeys(RESOURCE_KEYS);

export type LocalizationKeyTreeType = typeof RESOURCE_KEYS;
