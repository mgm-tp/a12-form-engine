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

import type { LocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";
import { initializeKeys } from "@com.mgmtp.a12.utils/utils-localization";

/**
 * The resource keys should probably stay the same as in the Form Engine.
 * This would make the migration easier for projects, that have customized Form
 * Engine resources.
 */
export const RESOURCE_KEYS = {
	/** Key of the text used for boolean value true */
	true: "",
	/** Key of the text used for boolean value false */
	false: "",
	autocomplete: {
		/**
		 * Key of the template that is used for the autocomplete widget.
		 *
		 * Available "placeholder":
		 * * `{count}` - number of matching entries
		 * * `{total}` - number of all entries
		 *
		 * FIXME: These placeholders are different from the usual localizable
		 * placeholders and will not be replaced by the localizer, but from
		 * the autocomplete widget. We should adapt the documentation here.
		 */
		hintTemplate: ""
	},
	date: {
		button: {
			open: "",
			ok: ""
		}
	},
	dateTime: {
		button: {
			open: "",
			back: "",
			ok: "",
			clear: "",
			editTime: ""
		},
		placeholderTime: ""
	},
	time: {
		button: {
			open: "",
			ok: "",
			clear: ""
		},
		placeholderTime: ""
	},
	daterange: {
		button: {
			open: "",
			ok: "",
			clear: ""
		}
	},
	multiSelect: {
		hintTemplate: "",
		selectAllText: "",
		mobileHeadingText: ""
	}
};

initializeKeys(RESOURCE_KEYS);

const en: typeof RESOURCE_KEYS = {
	true: "Yes",
	false: "No",
	autocomplete: {
		hintTemplate: "{count} out of {total} options"
	},
	date: {
		button: {
			open: "Select date",
			ok: "OK"
		}
	},
	dateTime: {
		button: {
			open: "Select date and time",
			back: "Back",
			ok: "OK",
			clear: "Clear",
			editTime: "Edit Time"
		},
		placeholderTime: "Please select"
	},
	time: {
		button: {
			open: "Select time",
			ok: "OK",
			clear: "Clear"
		},
		placeholderTime: "Please select"
	},
	daterange: {
		button: {
			open: "Select date range",
			ok: "OK",
			clear: "Clear"
		}
	},
	multiSelect: {
		hintTemplate: "{count} out of {total} options",
		selectAllText: "All",
		mobileHeadingText: "Select your options"
	}
};

const de: typeof RESOURCE_KEYS = {
	true: "Ja",
	false: "Nein",
	autocomplete: {
		hintTemplate: "{count} von {total} Optionen"
	},
	date: {
		button: {
			open: "Datum wählen",
			ok: "OK"
		}
	},
	dateTime: {
		button: {
			open: "Datum und Uhrzeit wählen",
			back: "Zurück",
			ok: "OK",
			clear: "Löschen",
			editTime: "Zeit bearbeiten"
		},
		placeholderTime: "Bitte wählen"
	},
	time: {
		button: {
			open: "Uhrzeit wählen",
			ok: "OK",
			clear: "Löschen"
		},
		placeholderTime: "Bitte wählen"
	},
	daterange: {
		button: {
			open: "Datumsbereich wählen",
			ok: "OK",
			clear: "Löschen"
		}
	},
	multiSelect: {
		hintTemplate: "{count} von {total} Optionen",
		selectAllText: "Alle",
		mobileHeadingText: "Wählen Sie ihre Optionen"
	}
};

/**
 * @internal
 */
export const DEFAULT_TRANSLATIONS: LocalizationTreeMap = { en, de };
