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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModel, EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";

import type { IExternalEnumerationProvider } from "../../back-end/services/external-enumeration-provider.js";
import { ModelSelectors } from "../../back-end/store/internal/selectors/models.js";
import type { EngineState } from "../../back-end/store/internal/store.js";
import { FormModelSelectors } from "../../back-end/store/internal/suffix.js";
import { assertUnreachable } from "../../back-end/utils/internal/assertions.js";
import { FormModelUtils } from "../../models/internal/utils/form-model-utils.js";
import { evaluateNotRelevantForDocumentElement } from "../../view/internal/utilities/enablements/hidden.js";
import { InternalEnumerableHelper } from "../../view/internal/utilities/enumerable/enumerableHelper.js";
import type { Value } from "../../view/internal/utilities/value.js";

type NonEnumerableFieldType = Exclude<
	DocumentModel.FieldType["type"],
	DocumentModel.EnumerationType["type"]
>;

/** @internal */
// TODO: Isn't this completely redundant with text output?!
export function getFieldTextValue(options: {
	state: EngineState;
	converter: ValueConversion;
	localizer: Localizer;
	path: EntityInstancePath;
	field: DocumentModel.Field;
	externalEnumerationProvider?: IExternalEnumerationProvider;
	value: Value;
}): string {
	const { path, field, value } = options;
	const isNotRelevant = evaluateNotRelevantForDocumentElement(path, options.state);
	if (isNotRelevant) {
		return "";
	}
	const formModel = ModelSelectors.formModel()(options.state);
	const fce = formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(path)];
	// Because external enumerations are type string the enumeration check has to be done before the string check
	if (FormModelUtils.isEnumerable(field.fieldType, fce)) {
		const enumValue = InternalEnumerableHelper.getEnumerationValue({
			...options,
			model: ModelSelectors.documentModel()(options.state),
			path,
			fce
		});
		return !enumValue &&
			typeof value.data === "string" &&
			InternalEnumerableHelper.isCustomValuesAllowed(fce)
			? value.data
			: enumValue;
	} else {
		// field type can not be enum at this point
		const fieldType = field.fieldType.type as NonEnumerableFieldType;

		switch (fieldType) {
			case "StringType":
			case "CustomFieldType":
				return value.ui;

			case "BooleanType":
			case "ConfirmType":
				return value.data !== null ? value.ui : "";

			case "DateType":
			case "DateFragmentType":
			case "DateRangeType":
			case "DateTimeType":
			case "TimeType":
				return value.data ? value.ui : "";

			case "NumberType": {
				const val = value.data !== null ? value.ui : "";
				const suffix = FormModelSelectors.suffix(path, options.localizer)(options.state);

				return suffix ? (val ? val + " " + suffix : suffix) : val;
			}
			default:
				assertUnreachable(fieldType);
		}
	}
}
