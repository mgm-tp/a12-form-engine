/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import type {
	LocalizationTree,
	LocalizationTreeMap
} from "@com.mgmtp.a12.utils/utils-localization";

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
		base: "Base",
		base_flat: "Base Flat"
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
