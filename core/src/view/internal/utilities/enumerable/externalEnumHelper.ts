// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
