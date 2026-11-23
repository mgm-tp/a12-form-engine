// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { createDocumentPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";

export function createRow(
	columnPath: ModelPath,
	fieldName: string,
	rowIndex: number,
	value: string | number | boolean | Date | null | object | undefined,
	label?: string
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
				ui: label ?? ""
			}
		]
	};
}
