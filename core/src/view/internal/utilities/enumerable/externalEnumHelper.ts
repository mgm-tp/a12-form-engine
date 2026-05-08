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

import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	LocalizedText,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type IExternalEnumerationProvider from "../../../../back-end/services/external-enumeration-provider.js";
import { MissingExternalEnumerationProvider } from "../../../../back-end/services/external-enumeration-provider.js";
import type { FormModel } from "../../../../models/internal/form-model.js";
import type { ReadonlyObjectMap } from "../../../../models/internal/utils/json.js";

import { localizeEnumerationValue } from "./localizeEnumerationValue.js";

function getValueForExternalEnumeration(options: {
	localizer: Localizer;
	externalEnumerationProvider?: IExternalEnumerationProvider;
	documentModel: DocumentModel;
	formModel: FormModel;
	path: EntityInstancePath;
	externalEnumeration: FormModel.ExternalEnumeration;
	value: string;
}): string {
	const { externalEnumeration, path, value } = options;
	const externalEnumerationProvider = options.externalEnumerationProvider
		? options.externalEnumerationProvider
		: MissingExternalEnumerationProvider;

	// TODO: Do we need to rewrite the Provider Interface? - Label is not the same
	const externalValues = externalEnumerationProvider(externalEnumeration.src);
	const convertedValues = convertExternalEnumerationValues(externalValues);

	const enumerationValue = localizeEnumerationValue({
		...options,
		value: value,
		enumValues: convertedValues,
		path
	});
	return enumerationValue.label;
}

/**
 * converts the map-based data structure into an array-based data structure as used for localized texts and enum values
 */
function convertExternalEnumerationValues(
	externalValues: ReadonlyObjectMap<{ [key: string]: string | undefined }>
): DocumentModel.EnumValue[] {
	return Object.entries(externalValues).reduce((acc: DocumentModel.EnumValue[], [value, label]) => {
		if (label) {
			const convertedLabel = Object.entries(label).reduce(
				(internalAcc: LocalizedText[], [locale, text]) => {
					if (text) {
						internalAcc.push({ locale, text });
					}
					return internalAcc;
				},
				[]
			);
			acc.push({ value, label: convertedLabel });
		}
		return acc;
	}, []);
}

/**
 * @internal
 */
export const ExternalEnumHelper = {
	getValue: getValueForExternalEnumeration,
	convertValues: convertExternalEnumerationValues
};
