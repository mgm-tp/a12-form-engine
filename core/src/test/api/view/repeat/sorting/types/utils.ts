// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type IExternalEnumerationProvider from "../../../../../../back-end/services/external-enumeration-provider.js";
import { createEngineStore } from "../../../../../../back-end/store/index.js";
import type { Models } from "../../../../../../back-end/store/internal/store.js";
import { RepeatData } from "../../../../../../data/internal/repeat.js";
import type { Value } from "../../../../../../view/index.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import {
	createDocumentPath,
	createModelPath
} from "../../../../../utils/test-model-helpers/dependent-enumeration.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";

export function createRow(
	columnPath: ModelPath,
	fieldName: string,
	rowIndex: number,
	value: string | number | boolean | Date | null | object | undefined,
	uiValue?: string
): RepeatRow {
	const rowPath = DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1", rowIndex + 1]);
	return {
		path: rowPath,
		rowIndexInDocument: rowIndex,
		values: [
			{
				data: value,
				path: [...rowPath, ...createDocumentPath([fieldName])],
				formModelPath: columnPath,
				ui: uiValue || ""
			}
		]
	};
}

export function getRows(
	models: Models,
	document: object,
	localeParam: Locale,
	externalEnumerationProvider?: IExternalEnumerationProvider,
	sortColumnId?: string,
	language?: string
): RepeatRow[] {
	const locale = language === "de" ? { language: "de", country: "DE" } : localeParam;
	const initialState = createEngineStore({
		models,
		locale,
		data: { document }
	});

	return RepeatData.getRowsByPath({
		repeatDocumentPath: createDocumentPath(["Root"], ["Nested_L1", 0]),
		repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH),
		state: initialState,
		converter: defaultValueConversion(defaultDataFormats(locale)),
		localizer: defaultLocalizerFactory({ locale }),
		optimize: { sortColumnId, filterColumnIds: [] },
		externalEnumerationProvider: externalEnumerationProvider
	}).rows;
}

export function getData(
	row: { path: EntityInstancePath; values: Value[]; rowIndexInDocument: number },
	columnName: string
): string | number | Date | undefined | null | boolean | object {
	return row.values.find(v =>
		v.formModelPath ? v.formModelPath[v.formModelPath.length - 1].elementName === columnName : false
	)?.data;
}
