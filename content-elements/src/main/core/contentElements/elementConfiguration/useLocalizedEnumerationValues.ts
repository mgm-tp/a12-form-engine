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

import { useContext } from "react";
import { useSelector } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DataReference } from "@com.mgmtp.a12.client/client-data/lib/core/api/data-reference.js";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data/lib/core/api/path/documentPath.js";
import { DocumentModelLocalizableFactory } from "@com.mgmtp.a12.client/client-data/lib/kernel-extension/documentModelLocalizableFactory.js";
import {
	useDocumentContext,
	useDocumentPathContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createResourceLocalizable } from "../../localization/createResourceLocalizable.js";
import { RESOURCE_KEYS } from "../../localization/resources.js";

import { arraysDeepEqual } from "../arraysDeepEqual.js";

// TODO: internal? => other hooks like this are currently used in EEP
// (useCommonControlSettings, useCommonWidgetSettings)
export const USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER = {
	useLocalizedEnumerationValues
};

// TODO: internal?
export type EnumerationItem = { value: string; label: string };

// TODO: internal?
// Note: This is subject to change
export function useLocalizedEnumerationValues(dataReference: DataReference): EnumerationItem[] {
	const { getDocumentModelName, getElementByPath } = useDocumentContext(c => c.model);
	const { getEnumerationValues } = useDocumentContext(c => c.document);
	const { localizer, locale } = useContext(LocalizerContext);
	const dataContextString = useDocumentPathContext(c => c.groupPath);
	const dataContext = DocumentPath.fromString(dataContextString);

	const enumValues = useSelector(
		state => getEnumerationValues(state, dataReference, dataContext),
		arraysDeepEqual
	);

	const documentModelName = useSelector(getDocumentModelName) ?? "";
	const dmElement = useSelector(state =>
		getElementByPath(state, DocumentPath.fromString(dataReference))
	);

	if (dmElement?.type === "Field") {
		if (dmElement.fieldType.type === "EnumerationType") {
			/**
			 * (also pre-sort the list in the data component? => requires
			 * localization)
			 */
			const { alphabeticalSorting } = dmElement.fieldType;

			const enumValueWithLocalization = enumValues.map(o => {
				return {
					value: o.value,
					label:
						localizer(
							...DocumentModelLocalizableFactory.enumerationValue(
								documentModelName,
								o,
								ModelPath.fromString(dataReference)
							)
						) ?? ""
				};
			});

			return alphabeticalSorting
				? enumValueWithLocalization.sort(byLabel(locale.language))
				: enumValueWithLocalization;
		} else if (dmElement.fieldType.type === "BooleanType") {
			return [
				{
					value: "true",
					label: localizer(createResourceLocalizable(RESOURCE_KEYS.true)) ?? ""
				},
				{
					value: "false",
					label: localizer(createResourceLocalizable(RESOURCE_KEYS.false)) ?? ""
				}
			];
		} else if (dmElement.fieldType.type === "StringType" && dmElement.fieldType.hintList) {
			const localizedHintList = dmElement.fieldType.hintList.find(
				list => list.locale === Locale.toString(locale)
			) ??
				dmElement.fieldType.hintList.find(list => list.locale === locale.language) ?? {
					values: []
				};

			const enumValues = localizedHintList.values.map(e => ({ value: e, label: e }));

			return dmElement.fieldType.alphabeticalSorting
				? enumValues.sort(byLabel(locale.language))
				: enumValues;
		}

		// TODO: external enumerations
	}

	return [];
}

function byLabel(
	languageForComparison: string
): (v1: EnumerationItem, v2: EnumerationItem) => number {
	return (v1, v2) => v1.label.localeCompare(v2.label, languageForComparison);
}
