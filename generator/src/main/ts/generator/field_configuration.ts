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
