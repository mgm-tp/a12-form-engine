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
import { getApproximatedDate } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/a12internal/KernelUtils.js";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { findElementByFormModelPath, FormModel } from "../../../models/index.js";
import { DocumentModelUtils } from "../../../models/internal/utils/document-model-utils.js";
import { FormModelUtils } from "../../../models/internal/utils/form-model-utils.js";

import { DateUtils } from "../components/form-engine/cells/controls/date/date-utilities.js";
import type { RepeatRow } from "../components/form-engine/repeat/components/tableColumnTypes.js";

import type { Value } from "./value.js";

/** @internal */
export function sort(
	rows: ReadonlyArray<RepeatRow>,
	sortPath: ModelPath,
	locale: Locale,
	formModel: FormModel,
	documentModel: DocumentModel,
	sortingState?: "asc" | "desc"
): { path: EntityInstancePath; values: Value[]; rowIndexInDocument: number }[] {
	const column = findElementByFormModelPath(formModel, sortPath);

	const [element, fce] = FormModel.FieldOverviewColumn.isInstance(column)
		? [
				DocumentModelUtils.findByPath(documentModel, column.elementPath),
				formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(column.elementPath)]
			]
		: [];

	const dataType = element?.type === "Field" ? element.fieldType : undefined;

	const timeZone = getTimeZone(documentModel);
	return rows
		.map(toComparableRow(sortPath, dataType, timeZone))
		.toSorted(createRowComparator(sortingState, locale, dataType, fce))
		.map(toRepeatRow);
}

function getValueForSorting(
	dataType: DocumentModel.FieldType | undefined,
	value: string | number | boolean | Date | null | object | undefined,
	timeZone: string
): string | number | boolean | Date | null | object | undefined {
	if (typeof value === "string") {
		if (dataType?.type === "DateType") {
			return getApproximatedDate(value, timeZone);
		}

		if (dataType?.type === "NumberType") {
			return +value;
		}
	}

	return value;
}

function toRepeatRow({ valToCompare, ...rest }: ComparableRow): RepeatRow {
	return rest;
}

function toComparableRow(
	sortPath: ModelPath,
	dataType: DocumentModel.FieldType | undefined,
	timeZone: string
): (row: RepeatRow) => ComparableRow {
	return row => {
		const val = row.values.find(val => ModelPath.equal(val.formModelPath ?? [], sortPath));

		const data = val ? getValueForSorting(dataType, val.data, timeZone) : undefined;

		return {
			...row,
			valToCompare: val ? { ...val, data } : undefined
		};
	};
}

interface ComparableRow extends RepeatRow {
	readonly valToCompare: Value | undefined;
}
function createRowComparator(
	order: "asc" | "desc" | undefined,
	locale: Locale,
	dataType?: DocumentModel.FieldType,
	fce?: FormModel.FieldConfigurationEntry
): (r1: ComparableRow, r2: ComparableRow) => number {
	return (row1, row2) => {
		if (order === undefined) {
			return 0;
		}

		const val1 = row1.valToCompare;
		const val2 = row2.valToCompare;

		const compareData = dataType && !mustBeConverted(dataType, fce);

		if (val1 === undefined || val2 === undefined || isValueEqual(val1, val2)) {
			return 0;
		} else if (order === "asc") {
			if (val1.data === null) {
				return -1;
			}

			if (val2.data === null) {
				return 1;
			}

			if (compareData && val1.data !== undefined && val2.data !== undefined) {
				if (typeof val1.data === "string" && typeof val2.data === "string") {
					return val1.data.localeCompare(val2.data, [locale.language]);
				} else if (DateUtils.isDateRangeArray(val1.data) && DateUtils.isDateRangeArray(val2.data)) {
					return compareDateRange(val1.data, val2.data);
				} else {
					return val1.data < val2.data ? -1 : 1;
				}
			}

			return val1.ui.localeCompare(val2.ui, [locale.language]);
		} else if (order === "desc") {
			if (val1.data === null) {
				return 1;
			}

			if (val2.data === null) {
				return -1;
			}

			if (compareData && val1.data !== undefined && val2.data !== undefined) {
				if (typeof val1.data === "string" && typeof val2.data === "string") {
					return val2.data.localeCompare(val1.data, [locale.language]);
				} else if (
					Array.isArray(val1.data) &&
					val1.data[0] instanceof Date &&
					Array.isArray(val2.data) &&
					val2.data[0] instanceof Date
				) {
					return val1.data[0].getTime() === val2.data[0].getTime()
						? val1.data[1] > val2.data[1]
							? -1
							: 1
						: val1.data[0] > val2.data[0]
							? -1
							: 1;
				} else {
					return val1.data > val2.data ? -1 : 1;
				}
			}

			return val2.ui.localeCompare(val1.ui, [locale.language]);
		}

		return 0;
	};
}

/** @internal */
export function mustBeConverted(
	fieldType: DocumentModel.FieldType,
	fce?: FormModel.FieldConfigurationEntry
): boolean {
	return (
		fieldType.type === "BooleanType" ||
		fieldType.type === "ConfirmType" ||
		fieldType.type === "CustomFieldType" ||
		FormModelUtils.isEnumerable(fieldType, fce)
	);
}

function isValueEqual(value1: Value, value2: Value): boolean {
	if (value1.data === null && value2.data === null) {
		return true;
	}

	return (
		value1.data === value2.data ||
		(value1 instanceof Date && value2 instanceof Date && value1.getTime() === value2.getTime())
	);
}

function compareDateRange(value1: Date[], value2: Date[]): number {
	const startDateRange1 = value1[0];
	const endDateRange1 = value1[1];
	const startDateRange2 = value2[0];
	const endDateRange2 = value2[1];

	return startDateRange1.getTime() === startDateRange2.getTime()
		? endDateRange1 < endDateRange2
			? -1
			: 1
		: startDateRange1 < startDateRange2
			? -1
			: 1;
}

function getTimeZone(model: DocumentModel): string {
	return model.content.modelConfig.timeZone;
}
