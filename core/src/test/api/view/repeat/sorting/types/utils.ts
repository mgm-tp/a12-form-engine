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
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization";

import type { IExternalEnumerationProvider } from "../../../../../../back-end/services/external-enumeration-provider.js";
import { createEngineStore } from "../../../../../../back-end/store/index.js";
import type { Models } from "../../../../../../back-end/store/internal/store.js";
import { RepeatData } from "../../../../../../data/internal/repeat.js";
import type { Value } from "../../../../../../view/index.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";

export function createRow(
	columnPath: ModelPath,
	fieldName: string,
	rowIndex: number,
	value: string | number | boolean | Date | null | object | undefined,
	uiValue?: string
): RepeatRow {
	const rowPath = createDocumentPath(["Root"], ["Nested_L1", rowIndex + 1]);
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
