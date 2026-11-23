// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	LocalizationTree,
	LocalizationTreeMap
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

const en: LocalizationTree = {
	application: {
		title: "Form Engine Dev App",
		menu: {
			index: { label: "Index" },
			contact: { label: "Contact" },
			versions: { label: "Versions" }
		}
	},
	about: {
		contact: {
			title: "Contact",
			locations: {
				berlin: `Torstrasse 164 can also be reached via Linienstrasse 98. Both addresses connect to the
						same courtyard. To reach our office, please use entrance B.`,
				hamburg: "Our Hamburg offices are located at the Hollaendischer Brook 2."
			}
		}
	},
	server: {
		connection: {
			waiting: { title: "Waiting for server initialization", message: "Please wait..." },
			failed: { title: "Failed to connect to server", message: "Error: $ERROR$" }
		}
	},
	version: {
		info: {
			currentVersion: {
				label: "Current Version:"
			},
			dependencies: "Dependencies"
		}
	},
	cancel: "Cancel",
	settings: {
		title: "Settings"
	},
	theme: {
		title: "Theme",
		default: "Default",
		compact: "Compact",
		flat: "Flat",
		flat_compact: "Flat Compact"
	},
	language: {
		title: "Language"
	},
	data: {
		import: {
			success: "Data has been imported successfully",
			error: {
				title: "Error: The data is not applicable to the document model.",
				message: "See console for more information."
			},
			emptyData: "File Content is empty"
		},
		export: {
			success: "Data has been saved to local storage successfully"
		},
		restore: {
			noData: "No saved data in local storage"
		},
		modal: {
			overwriteForm: {
				title: "Overwrite form data",
				message: "Current form data will be overwritten. Are you sure you want to continue?",
				confirmLabel: "Overwrite"
			},
			overwriteLocalStorage: {
				title: "Overwrite local storage data",
				message:
					"Current saved data in local storage will be overwritten. Are you sure you want to continue?",
				confirmLabel: "Overwrite"
			}
		}
	}
};

export const devappTranslationSource: LocalizationTreeMap = {
	en
};
