// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { ModelSelectors } from "../../../back-end/store/index.js";
import { assertCondition } from "../../../back-end/utils/internal/assertions.js";
import { isMultiSelectData } from "../../../models/internal/utils/document-model-utils.js";
import { DocumentModelUtils } from "../../../shared/internal/document-model-utils.js";

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
	const group = DocumentModelUtils.findByPath(documentModel, modelPath);
	assertCondition(DocumentModelUtils.isMultiSelect(group));

	return EnumerableHelper.getLocalizedEnumerationValues(
		renderOptions,
		[...modelPath, { elementName: group.elements[0].name }],
		localizer
	);
}
