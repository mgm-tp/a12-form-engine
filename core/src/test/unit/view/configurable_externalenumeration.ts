// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { IExternalEnumerationProvider } from "../../../back-end/services/external-enumeration-provider.js";

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

const masterValues = generateValues();

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
