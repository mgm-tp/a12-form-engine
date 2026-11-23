// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Example implementation for an external enumeration, where custom values are allowed.
 */
import type { Middleware } from "redux";

import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import type { IExternalEnumerationProvider } from "@com.mgmtp.a12.formengine/formengine-core";
import { Events, FormEngineActions } from "@com.mgmtp.a12.formengine/formengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

// dummy data generator
function generateValues(): DocumentModel.ReadonlyObjectMap<{ [key: string]: string | undefined }> {
	let values: { [key: string]: { [key: string]: string | undefined } | undefined } = {};

	const entriesEnglish = [
		"Munich",
		"Aachen",
		"Bamberg",
		"Berlin",
		"Đà Nẵng",
		"Dresden",
		"Grenoble",
		"Hamburg",
		"Cologne",
		"Leipzig"
	];
	const entriesGerman = [
		"München",
		"Aachen",
		"Bamberg",
		"Berlin",
		"Đà Nẵng",
		"Dresden",
		"Grenoble",
		"Hamburg",
		"Köln",
		"Leipzig"
	];

	for (let i = 0; i < 10; i++) {
		const text: { [key: string]: string | undefined } = {
			de_DE: entriesGerman[i],
			en_US: entriesEnglish[i]
		};

		values = {
			...values,
			[entriesEnglish[i] + "_key"]: text
		};
	}

	return values;
}

let masterValues = generateValues();

const watchedFields = [
	["Root", "Config", "ExternalEnumerationAllowCustom"],
	["Root", "Config", "ExternalEnumerationCaseSensitive"],
	["Root", "Config", "NewGroup_1", "ExternalEnumerationAllowCustom"],
	["Root", "Config", "NewGroup_1", "ExternalEnumerationCaseSensitive"]
];

/**
 * External enumeration provider that initially only provides the list of generated values.
 * This list is extended by entering custom values via respectively configured autocomplete controls.
 */
export const externalEnumerationProvider: IExternalEnumerationProvider = (
	source: string
): DocumentModel.ReadonlyObjectMap<{ [key: string]: string | undefined }> => {
	switch (source) {
		case "config": {
			return masterValues;
		}
		default:
			throw new Error("unknown external enumeration source: " + source);
	}
};

/**
 * Adds new custom values that have been entered into the respectively configured autocomplete controls
 * of watched fields to the list of enumeration values.
 */
export const onValueSelected: Middleware = api => next => action => {
	const result = next(action);
	if (
		FormEngineActions.event.match(action) &&
		Events.valueChange.match(action.payload.engineEvent)
	) {
		const state = api.getState();
		const locale = LocaleSelectors.locale()(state);

		const path = action.payload.engineEvent.payload.path;
		const value = action.payload.engineEvent.payload.value;

		// only process the two fields of interest
		// for better maintainability in real projects, use annotations
		if (watchedFields.some(wf => wf.join("/") === path.map(pe => pe.elementName).join("/"))) {
			// ignore no-value
			if (value === null) {
				return;
			}

			// values of (external) enumerations must be strings
			if (typeof value !== "string") {
				throw new Error("external enumeration value is not a string");
			}

			// check if the value already exists
			// note: make sure to take custom l10n into account, if you have it
			let valuePresent = false;
			for (const [key, entry] of Object.entries(masterValues)) {
				const label = entry ? entry[Locale.toString(locale)] || "" : "";
				if (key === value || label === value) {
					valuePresent = true;
					break;
				}
			}

			if (!valuePresent) {
				masterValues = {
					...masterValues,
					[value]: { de: value, en: value }
				};
			}
		}
	}

	return result;
};
