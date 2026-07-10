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
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization";

import { createLocalizableFactory } from "../../../../back-end/localization/internal/localization.js";
import { DataSelectors } from "../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import { getDocumentPath } from "../../../../back-end/utils/internal/path.js";
import type { FormModel } from "../../../../models/internal/form-model.js";
import * as DocumentModelUtils from "../../../../models/internal/utils/document-model-utils.js";
import { DocumentUtils } from "../../../../models/internal/utils/document-utils.js";
import type { FormModelMap } from "../../configuration/engine-configuration.js";

import type { EnumerationValue } from "./enumValue.js";

/**
 * @internal
 */
export function localizeAndFilterEnumerationValues(options: {
	renderOptions: FormModelMap.RenderOptions;
	enumValues: readonly DocumentModel.EnumValue[];
	modelPath: ModelPath;
	context: EntityInstancePath;
	localizer: Localizer;
	fieldConfigurationEntry?: FormModel.FieldConfigurationEntry;
}): EnumerationValue[] {
	const { renderOptions, enumValues, fieldConfigurationEntry, modelPath, context, localizer } =
		options;

	const filteredOptions = filter(renderOptions, enumValues, context, fieldConfigurationEntry);

	const enumerationValues: EnumerationValue[] = [];

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);

	const localizableFactory = createLocalizableFactory(
		documentModel,
		ModelSelectors.formModel()(renderOptions.state)
	);

	for (const enumValue of filteredOptions) {
		const label = localizer(...localizableFactory.enumerationValue(modelPath, enumValue));
		enumerationValues.push({
			value: enumValue.value,
			label: label ?? ""
		});
	}

	return hasAlphabeticalSorting(documentModel, modelPath)
		? enumerationValues.sort(byLabel(UiStateSelectors.locale()(renderOptions.state).language))
		: enumerationValues;
}

/**
 * Return the enumeration values for a dependent enumeration field.
 */
function filter(
	options: FormModelMap.RenderOptions,
	allDependentValues: readonly DocumentModel.EnumValue[],
	context: EntityInstancePath,
	fieldConfigurationEntry?: FormModel.FieldConfigurationEntry
): readonly DocumentModel.EnumValue[] {
	if (
		fieldConfigurationEntry &&
		fieldConfigurationEntry.dependentEnumeration &&
		fieldConfigurationEntry.dependentEnumeration.constraint
	) {
		const masterFieldDocumentPath = getDocumentPath(
			ModelSelectors.documentModel()(options.state),
			fieldConfigurationEntry.dependentEnumeration.masterFieldPath,
			context
		);
		const document = DataSelectors.document()(options.state) as GroupInstance;
		const jsonValue = DocumentUtils.getValue({ document, path: masterFieldDocumentPath });

		// treat null values as empty string
		const masterValue = jsonValue ?? "";
		const constraint = fieldConfigurationEntry.dependentEnumeration.constraint.find(
			c => c.masterValue === masterValue
		);
		if (constraint) {
			return allDependentValues.filter(x =>
				constraint.constraintValues.map(v => v.value).includes(x.value)
			);
		}
	}

	return allDependentValues;
}

function hasAlphabeticalSorting(documentModel: DocumentModel, modelPath: ModelPath): boolean {
	const field = DocumentModelUtils.findByPath(documentModel, modelPath);

	return (
		field.type === "Field" &&
		(field.fieldType.type === "EnumerationType" || field.fieldType.type === "StringType") &&
		!!field.fieldType.alphabeticalSorting
	);
}

function byLabel(
	languageForComparison: string
): (v1: EnumerationValue, v2: EnumerationValue) => number {
	return (v1, v2) => v1.label.localeCompare(v2.label, languageForComparison);
}
