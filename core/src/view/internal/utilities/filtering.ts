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

import { type Predicate } from "fp-ts/lib/Predicate.js";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { getApproximatedDate } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/a12internal/KernelUtils.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type {
	BooleanRepeatFilter,
	ConfirmRepeatFilter,
	DateRangeRepeatFilter,
	DateRepeatFilter,
	EngineStore,
	EnumerationRepeatFilter,
	MultiSelectRepeatFilter,
	NumberRepeatFilter,
	RepeatFilter,
	StringRepeatFilter
} from "../../../back-end/store/internal/store.js";
import {
	isBooleanFilter,
	isConfirmFilter,
	isDateRangeFilter,
	isEnumerationFilter,
	isMultiSelectFilter,
	isRangeFilter,
	isStringFilter
} from "../../../back-end/store/internal/store.js";
import { and } from "../../../back-end/utils/internal/combinators.js";
import { isObjectEmpty } from "../../../back-end/utils/internal/guards.js";
import { findElementByFormModelPath, FormModel, ReadonlyObjectMap } from "../../../models/index.js";
import { DocumentModelUtils } from "../../../models/internal/utils/document-model-utils.js";
import { FormModelUtils } from "../../../models/internal/utils/form-model-utils.js";

import { DateUtils } from "../components/form-engine/cells/controls/date/date-utilities.js";
import type { RepeatRow } from "../components/form-engine/repeat/components/tableColumnTypes.js";

/** @internal */
export function getFilterByColumnId(
	columnId: string,
	repeatStaticState?: EngineStore.Repeat.StaticState
): RepeatFilter | undefined {
	return repeatStaticState?.filters?.[columnId]?.filter;
}

type DataType = string | number | boolean | Date | null | object | undefined;

/** @internal */
export function filterRows(
	rows: ReadonlyArray<RepeatRow>,
	filters: { [key: string]: EngineStore.Repeat.FilterEntry | undefined },
	formModel: FormModel,
	documentModel: DocumentModel
): ReadonlyArray<RepeatRow> {
	const asPredicate = createPredicateFactory(formModel, documentModel);

	const filterPredicates = ReadonlyObjectMap.values(filters).map(asPredicate);

	return filterPredicates.length ? rows.filter(and(...filterPredicates)) : rows;
}

function createPredicateFactory(
	formModel: FormModel,
	documentModel: DocumentModel
): (filterEntry: EngineStore.Repeat.FilterEntry) => Predicate<RepeatRow> {
	return filterEntry => row => {
		function applyStringFilter(filter: StringRepeatFilter, useLabel?: boolean): boolean {
			const testRow = (cellVal: DataType) =>
				testRowStringFilter(
					// Removes HTML tags from the string (expressions)
					typeof cellVal === "string" ? cellVal.split(/<.+?>/).join("") : cellVal,
					filter
				);
			return filterRowByType(row, path, testRow, useLabel);
		}

		const { columnPath: path, filter } = filterEntry;
		const formModelElement = findElementByFormModelPath(formModel, path);
		if (formModelElement === undefined) {
			return true;
		}

		if (FormModel.FieldOverviewColumn.isInstance(formModelElement)) {
			const documentElement = DocumentModelUtils.findByPath(
				documentModel,
				formModelElement.elementPath
			);

			if (documentElement) {
				if (documentElement.type === "Field") {
					const modelPath = ModelPath.toString(formModelElement.elementPath);
					const fce = formModel.content.fieldConfiguration.fieldMap[modelPath];

					if (isBooleanFilter(filter) && documentElement.fieldType.type === "BooleanType") {
						return filterRowByType(row, path, (cellVal: DataType) =>
							testRowBooleanFilter(cellVal, filter)
						);
					}

					if (isConfirmFilter(filter) && documentElement.fieldType.type === "ConfirmType") {
						return filterRowByType(row, path, (cellVal: DataType) =>
							testRowConfirmFilter(cellVal, filter)
						);
					}

					if (
						isEnumerationFilter(filter) &&
						FormModelUtils.isEnumerable(documentElement.fieldType, fce)
					) {
						return filterRowByType(row, path, (cellVal: DataType) =>
							testRowEnumerationFilter(cellVal, filter)
						);
					}

					if (isRangeFilter(filter)) {
						if (documentElement.fieldType.type === "NumberType") {
							return filterRowByType(row, path, (cellVal: DataType) => {
								const convertedCellVal =
									cellVal !== null && typeof cellVal === "string" ? +cellVal : cellVal;
								return testRowRangeFilter(convertedCellVal, filter);
							});
						} else {
							// All date types
							return filterRowByType(row, path, (cellVal: DataType) => {
								const convertedCellVal =
									cellVal !== null && typeof cellVal === "string"
										? getApproximatedDate(cellVal, documentModel.content.modelConfig.timeZone)
										: cellVal;
								return testRowRangeFilter(convertedCellVal, filter);
							});
						}
					}

					if (isDateRangeFilter(filter)) {
						return filterRowByType(row, path, (cellVal: DataType) =>
							testRowDateRangeFilter(cellVal, filter)
						);
					}

					if (isStringFilter(filter)) {
						const useLabel = mustBeConverted(documentElement.fieldType, formModelElement, fce);
						return applyStringFilter(filter, useLabel);
					}
				}

				if (isMultiSelectFilter(filter) && DocumentModelUtils.isMultiSelect(documentElement)) {
					return filterRowByType(row, path, (cellVal: DataType) =>
						testRowMultiSelectFilter(cellVal ?? [], filter)
					);
				}
			}
		}

		if (isStringFilter(filter)) {
			return applyStringFilter(filter);
		}

		return true;
	};
}

/** @internal */
export function isEnumerationWithStringExposition(
	fieldType: DocumentModel.FieldType,
	column: FormModel.FieldOverviewColumn
) {
	return fieldType.type === "EnumerationType" && column.filterExposition === "STRING";
}

/** @internal */
export function isExternalEnumerationWithDefaultExposition(
	fieldType: DocumentModel.FieldType,
	column: FormModel.FieldOverviewColumn,
	fce?: FormModel.FieldConfigurationEntry
) {
	return (
		FormModelUtils.isExternalEnum(fieldType, fce) &&
		(column.filterExposition === "STRING" || !column.filterExposition)
	);
}

/** @internal */
export function mustBeConverted(
	fieldType: DocumentModel.FieldType,
	column: FormModel.FieldOverviewColumn,
	fce?: FormModel.FieldConfigurationEntry
): boolean {
	return (
		isExternalEnumerationWithDefaultExposition(fieldType, column, fce) ||
		isEnumerationWithStringExposition(fieldType, column)
	);
}

function filterRowByType(
	row: RepeatRow,
	path: ModelPath,
	test: (cellVal: DataType) => boolean,
	useLabel?: boolean
): boolean {
	const column = row.values.find(
		value => value.formModelPath !== undefined && ModelPath.equal(value.formModelPath, path)
	);
	return column ? test(useLabel ? column.ui : column.data) : false;
}

function testRowRangeFilter(
	cellVal: DataType,
	filter: NumberRepeatFilter | DateRepeatFilter
): boolean {
	const fromValue = filter.from?.data ?? null;
	const toValue = filter.to?.data ?? null;

	if (filter.filterNull) {
		return cellVal === null;
	} else {
		if (typeof cellVal === "number" || cellVal instanceof Date) {
			const fromOk = fromValue !== null ? cellVal >= fromValue : true;
			const toOk = toValue !== null ? cellVal <= toValue : true;
			return fromOk && toOk;
		}

		if (DateUtils.isDateRangeArray(cellVal)) {
			const fromOk = fromValue !== null ? cellVal[0] >= fromValue : true;
			const toOk = toValue !== null ? cellVal[1] <= toValue : true;
			return fromOk && toOk;
		}
	}

	return false;
}

function testRowStringFilter(
	cellVal: DataType,
	{ filterValue, filterNull }: StringRepeatFilter
): boolean {
	if (filterNull) {
		return !cellVal;
	} else if (typeof cellVal === "string") {
		return cellVal.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
	} else {
		return false;
	}
}

function testRowBooleanFilter(
	cellVal: DataType,
	{ filterFalse, filterTrue, filterNull }: BooleanRepeatFilter
): boolean {
	if (!filterTrue && !filterFalse && !filterNull) {
		return true;
	}

	if (typeof cellVal === "boolean") {
		return (filterTrue && cellVal) || (filterFalse && !cellVal);
	} else {
		return filterNull && cellVal === null;
	}
}

function testRowEnumerationFilter(
	enumKey: DataType,
	{ values, filterNull }: EnumerationRepeatFilter
): boolean {
	if (!enumKey) {
		return filterNull === true;
	}

	if (isObjectEmpty(values)) {
		return !filterNull;
	}

	if (enumKey && typeof enumKey === "string") {
		const enumerationValueSelected = values[enumKey];
		return enumerationValueSelected === true;
	} else {
		return false;
	}
}

function testRowConfirmFilter(
	cellVal: DataType,
	{ filterTrue, filterNull }: ConfirmRepeatFilter
): boolean {
	if (!filterTrue && !filterNull) {
		return true;
	}

	if (typeof cellVal === "boolean" && cellVal) {
		return filterTrue;
	} else {
		return filterNull;
	}
}

function testRowMultiSelectFilter(
	enumKey: DataType,
	{ values, mode, filterNull }: MultiSelectRepeatFilter
): boolean {
	if (isObjectEmpty(values)) {
		return filterNull ? Array.isArray(enumKey) && enumKey.length === 0 : !filterNull;
	}

	const selectedValue = [...Object.keys(values), ...(filterNull ? [null] : [])];

	if (Array.isArray(enumKey)) {
		const cellValues = enumKey.length === 0 ? [null] : enumKey.map(v => v.value);
		if (mode === "and") {
			return selectedValue.every(r => cellValues.indexOf(r) >= 0);
		} else {
			return selectedValue.some(r => cellValues.indexOf(r) >= 0);
		}
	}

	return false;
}

function testRowDateRangeFilter(cellVal: DataType, filter: DateRangeRepeatFilter): boolean {
	const range =
		filter.filterRange !== undefined && filter.filterRange !== null
			? filter.filterRange.data
			: null;

	if (filter.filterNull) {
		return cellVal === null;
	}

	if (cellVal !== null && DateUtils.isDateRangeArray(cellVal)) {
		const filterFrom = range?.[0];
		const filterTo = range?.[1];

		const cellFrom = cellVal[0];
		const cellTo = cellVal[1];

		const fromOk = filterFrom !== undefined && filterFrom !== null ? cellFrom >= filterFrom : true;
		const toOk = filterTo !== undefined && filterTo !== null ? cellTo <= filterTo : true;

		return fromOk && toOk;
	}

	return false;
}
