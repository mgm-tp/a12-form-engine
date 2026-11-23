// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { LocalizationKeyTreeType } from "../keys.js";

export const en_US: LocalizationKeyTreeType = {
	header: {
		debugDocument: {
			title: "Document",
			button: "Show document",
			checkbox: "Show non-relevant data"
		},
		editorSettings: {
			button: "Settings",
			input: {
				baseGroup: {
					label: "Base Group",
					hintTemplate: "{count} matched group(s)",
					placeholder: "Please select or start typing"
				},
				dmReference: {
					label: "Document Model Reference"
				}
			}
		},
		validation: {
			button: "Validate"
		}
	}
};
