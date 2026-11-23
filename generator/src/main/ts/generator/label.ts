// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	LocalizedModelText,
	LocalizedText
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { FormModel } from "../form_model.js";

/**
 * Create an FM label from the given DM element. This is useful for FM elements
 * like repeats where the Form Engine doesn't have a fallback at runtime.
 */
export function createLabelFromDMElement(locales: string[]) {
	return function (element: DocumentModel.Element): FormModel.Label {
		const labelText = element.label
			? filterLocales(locales)(element.label)
			: fallbackLocalizedModelText(locales)(element.name);
		return createLabel(labelText);
	};
}

function filterLocales(locales: string[]) {
	return function (mtext: LocalizedModelText) {
		const localeMatches = (ltext: LocalizedText) => locales.includes(ltext.locale);
		return mtext.filter(localeMatches);
	};
}

function createLabel(text: LocalizedModelText): FormModel.Label {
	const multilingualText: FormModel.MultilingualText = {
		text
	};
	return {
		type: "Multilingual",
		multilingualText
	};
}

/**
 * Creates a LocalizedModelText for the given locales and text.
 */
export function fallbackLocalizedModelText(locales: string[]) {
	return function (text: string): LocalizedModelText {
		return locales.map(entry);

		function entry(locale: string) {
			return {
				locale,
				text
			};
		}
	};
}
