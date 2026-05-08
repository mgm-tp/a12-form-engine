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
 * 1. Open-Source License – EUPL v1.2
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
