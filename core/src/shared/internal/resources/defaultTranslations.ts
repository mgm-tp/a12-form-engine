// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { LocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { PREVIEW_RESOURCE_KEYS } from "./keys.js";

const en: typeof PREVIEW_RESOURCE_KEYS = {
	preview: {
		middleware: {
			eventButton: {
				title: "Event button clicked",
				message: "Event: $EVENT_BUTTON_NAME$"
			},
			rowAction: {
				title: "Row action button clicked",
				message:
					"Custom Row Event: Event $ROW_ACTION_NAME$ triggered on row $ROW_IDX$ of $ROW_PATH$"
			},
			save: {
				title: "Document saved",
				message: "Document $DOCUMENT_NAME$ was saved successfully."
			}
		},
		modal: {
			reset: {
				title: "Reset your data",
				message:
					"Current data will be reset to the initial state. Are you sure you want to continue?",
				confirmLabel: "Reset"
			}
		}
	}
};

export const DEFAULT_PREVIEW_TRANSLATIONS: LocalizationTreeMap = { en };
