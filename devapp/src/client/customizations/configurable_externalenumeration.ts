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

/**
 * Example implementation for an external enumeration, where custom values are allowed.
 */
import type { Middleware } from "redux";

import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core";
import type { IExternalEnumerationProvider } from "@com.mgmtp.a12.formengine/formengine-core";
import { Events, FormEngineActions } from "@com.mgmtp.a12.formengine/formengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";

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
