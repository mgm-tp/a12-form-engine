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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Locale,
	Localizable,
	Localizer,
	SupportedType,
	ValueConversion,
	ValueConversionConfig
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createLocalizableFactory } from "../../../back-end/localization/internal/localization.js";
import type IExternalEnumerationProvider from "../../../back-end/services/external-enumeration-provider.js";
import type { EngineStore } from "../../../back-end/store/internal/store.js";
import { formatValue } from "../../../data/internal/format.js";
import type { FormModel, ReadonlyObjectMap } from "../../../models/index.js";
import { DocumentPath } from "../../../models/index.js";
import { DocumentModelUtils } from "../../../models/internal/utils/document-model-utils.js";
import { DocumentUtils } from "../../../models/internal/utils/document-utils.js";
import { FormModelUtils } from "../../../models/internal/utils/form-model-utils.js";

import { ExternalEnumHelper } from "./enumerable/externalEnumHelper.js";
import type { Value } from "./value.js";

/** @internal */
export interface GetValueOptions {
	readonly path: EntityInstancePath;
	readonly document: GroupInstance;
	readonly messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	readonly converter: ValueConversion;
	readonly locale: Locale;
	readonly documentModel: DocumentModel;
	readonly formModel: FormModel;
	readonly localizer: Localizer;
	readonly externalEnumerationProvider?: IExternalEnumerationProvider;
}

/**
 * TODO: Remove and call getPlainValueByPath and formatValue separately
 *
 * @internal
 *
 * Selector to get a value of an element by its path
 * @param path the path of the element
 */
export function getValueByPath(options: GetValueOptions): Value {
	const {
		path,
		converter,
		messages,
		document,
		documentModel,
		formModel,
		localizer,
		externalEnumerationProvider
	} = options;

	const messageState = messages[DocumentPath.toString(path)];

	const jsonValue = DocumentUtils.getValue({
		document,
		path
	});

	const field = DocumentModelUtils.findByPath(documentModel, path);
	const fce = formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(path)];

	// non-field "fields" do not have a ui value
	if (field.type === "Group") {
		return {
			ui: "",
			data: jsonValue,
			path: path
		};
	}

	const conversionConfig = DocumentModelUtils.conversionConfig(documentModel, path);

	return {
		ui: calculateUiValueForField(
			documentModel,
			formModel,
			field,
			path,
			localizer,
			converter,
			conversionConfig,
			messageState,
			jsonValue,
			fce,
			externalEnumerationProvider
		),
		data: jsonValue,
		path: path
	};
}

export function calculateUiValueForField(
	documentModel: DocumentModel,
	formModel: FormModel,
	field: DocumentModel.Field,
	path: EntityInstancePath,
	localizer: Localizer,
	converter: ValueConversion,
	conversionConfig: ValueConversionConfig,
	messageState?: EngineStore.Validation.Entry,
	jsonValue?: GroupInstance | SupportedType | GroupInstance[],
	fce?: FormModel.FieldConfigurationEntry | undefined,
	externalEnumerationProvider?: IExternalEnumerationProvider
): string {
	if (messageState !== undefined && messageState.parseError !== undefined) {
		return messageState.parseError.value;
	}

	if (
		field.type === "Field" &&
		fce &&
		fce.externalEnumeration &&
		FormModelUtils.isExternalEnum(field.fieldType, fce)
	) {
		return ExternalEnumHelper.getValue({
			externalEnumeration: fce.externalEnumeration,
			localizer,
			path,
			value: jsonValue as string,
			externalEnumerationProvider,
			documentModel,
			formModel
		});
	}

	// localize enumerable types
	if (["BooleanType", "ConfirmType", "EnumerationType"].includes(field.fieldType.type)) {
		const localizableFactory = createLocalizableFactory(documentModel, formModel);
		let enumerableUiValue: Localizable[];
		switch (field.fieldType.type) {
			case "BooleanType": {
				enumerableUiValue = localizableFactory.booleanValue(path, jsonValue as boolean);
				break;
			}
			case "ConfirmType": {
				enumerableUiValue = localizableFactory.confirmValue(path, jsonValue as true | null);
				break;
			}
			case "EnumerationType": {
				const enumValue = field.fieldType.values.find(enumValue => enumValue.value === jsonValue);
				enumerableUiValue = enumValue ? localizableFactory.enumerationValue(path, enumValue) : [];
				break;
			}
			default: {
				throw new Error("Enumerable field type of unknown type encountered!");
			}
		}
		return localizer(...enumerableUiValue) ?? "";
	}

	// format non-enumerable types via conversion
	return formatValue(jsonValue, converter, conversionConfig);
}
