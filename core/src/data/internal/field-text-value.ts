// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type ExternalEnumerationProvider from "../../back-end/services/external-enumeration-provider.js";
import { ModelSelectors } from "../../back-end/store/internal/selectors/models.js";
import type { EngineState } from "../../back-end/store/internal/store.js";
import { FormModelSelectors } from "../../back-end/store/internal/suffix.js";
import { assertUnreachable } from "../../back-end/utils/internal/assertions.js";
import { FormModelUtils } from "../../models/internal/utils/form-model-utils.js";
import { evaluateNotRelevantForDocumentElement } from "../../view/internal/utilities/enablements/hidden.js";
import { EnumerableHelper } from "../../view/internal/utilities/enumerable/enumerableHelper.js";
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
	externalEnumerationProvider?: ExternalEnumerationProvider;
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
		const enumValue = EnumerableHelper.getEnumerationValue({
			...options,
			model: ModelSelectors.documentModel()(options.state),
			path,
			fce
		});
		return !enumValue &&
			typeof value.data === "string" &&
			EnumerableHelper.isCustomValuesAllowed(fce)
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
