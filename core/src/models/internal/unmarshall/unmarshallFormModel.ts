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
import type { DocumentModel, FieldInstanceValue } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { defaultValueConversion } from "@com.mgmtp.a12.utils/utils-localization";

import { isFormModel } from "../../../models/internal/FormModelGuards.js";

import type { FormModel } from "../form-model.js";
import * as DocumentModelUtils from "../utils/document-model-utils.js";

import { addConditionallyHiddenElementsMap } from "./addConditionallyHiddenElementsMap.js";
import { addPaths } from "./addPaths.js";
import { countOccurrences } from "./countOccurrences.js";
import { generateConfigurationMaps } from "./generateConfigurationMaps.js";
import { getDependentScreenElementMap } from "./getDependentScreenElementMap.js";
import { parseControlWithIndex } from "./parseControlWithIndex.js";
import { parseExpressions } from "./parseExpressions.js";

/**
 * Parser for UI values, which receives a document model path and the value which should be parsed.
 */
export type ValueParser = (path: ModelPath, uiValue: string) => FieldInstanceValue;

/** Create a Kernel generated code based value parser for UI values. */
export const defaultValueParser: (documentModel: DocumentModel) => ValueParser = documentModel => {
	// note: this is the expected format for values inside of the form model, e.g. initial values & dependent field values
	// it must be consistent with the FMM validation for these values
	const defaultConversion = defaultValueConversion({
		decimalSeparator: ".",
		dateFragmentOrdering: "YEAR_MONTH_DAY",
		dateSeparator: "-",
		dateZeroOptional: false,
		dateTimeFormat: "yyyy-MM-dd'T'HH:mm:ss",
		dateRangeSeparator: "/",
		timeFormat: "HH:mm:ss",
		falseValue: "false",
		trueValue: "true",
		decimalPlacesOptional: false
	});

	return (path, uiValue) => {
		if (uiValue === "") {
			return null;
		}
		const field = DocumentModelUtils.findByPath(documentModel, path);
		if (field.type === "Field") {
			const conversionConfig = DocumentModelUtils.conversionConfig(documentModel, path);
			return defaultConversion.parseValue(uiValue, conversionConfig).value ?? null;
		}
		return uiValue;
	};
};

// Note: Keep this function free from Kernel validation code. Instead, use an abstraction like ValueParser
/**
 * Add runtime properties to the given formModelJson.
 *
 * Warning: This function changes the given Json object.
 *
 * @param formModelJson The JSON to unmarshall - warning: is changed in-place
 * @param documentModel The document model used by the form model
 * @param valueParser Function to parse field values stored inside the form model
 */
export function unmarshallFormModel(
	formModelJson: object,
	documentModel: DocumentModel,
	valueParser: ValueParser
): FormModel {
	if (!isFormModel(formModelJson, true)) {
		throw new Error("Json is no valid FormModel!");
	}

	const runTimeFormModel = formModelJson;

	const documentModelSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
		documentModel
	);

	// This function has to be called before the others, because the paths are needed
	addPaths(runTimeFormModel, documentModelSearchService);

	generateConfigurationMaps(runTimeFormModel, valueParser);
	getDependentScreenElementMap(runTimeFormModel, documentModel);
	addConditionallyHiddenElementsMap(runTimeFormModel, documentModel, documentModelSearchService);
	countOccurrences(runTimeFormModel);
	parseExpressions(runTimeFormModel, valueParser, documentModel);
	parseControlWithIndex(runTimeFormModel, documentModel, valueParser);

	return runTimeFormModel;
}
