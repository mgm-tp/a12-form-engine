// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { documentModelDFS } from "../dm/dm_dfs.js";
import { isField } from "../dm/dm_types.js";
import type { FormModel } from "../form_model.js";

import { fallbackLocalizedModelText } from "./label.js";

/**
 * Creates a field configuration for the given DM.
 *
 * Currently only sets suffixes for percent / permille fields.
 */
export function createFieldConfiguration(
	documentModel: DocumentModel,
	locales: string[]
): FormModel.FieldConfiguration {
	// number fields with these traits get the respective suffix symbol
	const TRAIT_SUFFIXES: Record<string, string> = {
		percent: "%",
		permille: "‰"
	};

	// get all percent / permille fields
	const elements = documentModelDFS(documentModel.content.modelRoot).filter(
		isFieldWithPercentOrPermilleTrait
	);

	// ... and create an entry for each of them
	return elements.length > 0 ? { field: elements.map(createFCE) } : {};

	function createFCE(element: DocumentModel.Element): FormModel.FieldConfigurationEntry {
		const suffixValue = createSuffix(element);
		const suffix = suffixValue ? { text: suffixValue } : undefined;
		return {
			...(suffix ? { suffix } : {}),
			elementRef: element.id
		};
	}

	// create a suffix entry for the given field
	function createSuffix(field: DocumentModel.Element): LocalizedModelText | undefined {
		const fieldTrait = getNumberTrait(field);
		const suffix = fieldTrait ? TRAIT_SUFFIXES[fieldTrait] : undefined;

		return suffix ? fallbackLocalizedModelText(locales)(suffix) : undefined;
	}

	function isFieldWithPercentOrPermilleTrait(
		element: DocumentModel.Element
	): element is DocumentModel.Field {
		const trait = getNumberTrait(element);
		return trait === "percent" || trait === "permille";
	}

	function getNumberTrait(element: DocumentModel.Element) {
		return isField(element) && element.fieldType.type === "NumberType"
			? element.fieldType.trait
			: undefined;
	}
}
