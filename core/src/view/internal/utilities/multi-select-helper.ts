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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization";

import { ModelSelectors } from "../../../back-end/store/index.js";
import { assertCondition } from "../../../back-end/utils/internal/assertions.js";
import {
	findByPath,
	isMultiSelect,
	isMultiSelectData
} from "../../../models/internal/utils/document-model-utils.js";

import type { FormModelMap } from "../configuration/engine-configuration.js";

import { EnumerableHelper } from "./enumerable/enumerableHelper.js";
import type { EnumerationValue } from "./enumerable/enumValue.js";
import type { Value } from "./value.js";

/** @internal */
export function mapSelectedValues(data: unknown): string[] {
	return isMultiSelectData(data) ? data.map(d => Object.values(d)[0]) : [];
}

/** @internal */
export function getLocalizedMultiSelectUiValue(
	renderOptions: FormModelMap.RenderOptions,
	value: Value,
	localizer: Localizer
): string[] {
	const values = mapSelectedValues(value.data);
	const enumerationOptions = getLocalizedMultiSelectValue(renderOptions, value.path, localizer);

	const uiValue = values.map(v => {
		const enumOption = enumerationOptions.find(e => e.value === v);
		if (enumOption === undefined) {
			throw new Error("Invalid MultiSelect option with key " + v);
		}

		return enumOption.label;
	});
	return uiValue;
}

/** @internal */
export function getLocalizedMultiSelectValue(
	renderOptions: FormModelMap.RenderOptions,
	modelPath: ModelPath,
	localizer: Localizer
): EnumerationValue[] {
	const documentModel = ModelSelectors.documentModel()(renderOptions.state);
	const group = findByPath(documentModel, modelPath);
	assertCondition(isMultiSelect(group));

	return EnumerableHelper.getLocalizedEnumerationValues(
		renderOptions,
		[...modelPath, { elementName: group.elements[0].name }],
		localizer
	);
}
