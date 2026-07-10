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
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";

import type { IExternalEnumerationProvider } from "../../back-end/services/external-enumeration-provider.js";
import { DataSelectors } from "../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../back-end/store/internal/selectors/models.js";
import {
	InternalUiStateSelectors,
	UiStateSelectors
} from "../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState, EngineStore } from "../../back-end/store/internal/store.js";
import { getDocumentPath } from "../../back-end/utils/internal/path.js";
import type { FormModel } from "../../models/index.js";
import { findElementByFormModelPath } from "../../models/index.js";
import {
	isFormModelFieldOverviewColumn,
	isFormModelRepeat
} from "../../models/internal/FormModelGuards.js";
import type * as RepeatExpressionFilter from "../../models/internal/jison/repeatfilter.cjs";
import * as DocumentModelUtils from "../../models/internal/utils/document-model-utils.js";
import { DocumentPath, DocumentUtils } from "../../models/internal/utils/document-utils.js";
import { getModelPathElementName } from "../../models/internal/utils/form-model-path.js";
import { filterRowsByFilterExpression } from "../../view/internal/components/form-engine/repeat/components/filter-expressions.js";
import type {
	Data,
	PaginatedRepeatData
} from "../../view/internal/components/form-engine/repeat/components/repeat-data.js";
import type { RepeatRow } from "../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import {
	filterRows,
	mustBeConverted as mustBeConvertedForFiltering
} from "../../view/internal/utilities/filtering.js";
import { calculateUiValueForField } from "../../view/internal/utilities/getValueByPath.js";
import {
	mustBeConverted as mustBeConvertedForSorting,
	sort
} from "../../view/internal/utilities/sorting.js";
import type { Value } from "../../view/internal/utilities/value.js";

import { calculateSummaryResult } from "./calculateSummaryResult.js";
import { getExpressionValue } from "./expression-cell-value.js";

interface Options {
	readonly state: EngineState;
	readonly converter: ValueConversion;
	readonly localizer: Localizer;
	readonly externalEnumerationProvider?: IExternalEnumerationProvider;
	readonly repeatFormModelPath: ModelPath;
}

interface OptimizationParameters {
	readonly sortColumnId?: string;
	readonly filterColumnIds: string[];
}

/**
 * @internal
 */
export const RepeatData = {
	/**
	 * @internal
	 *
	 * @param optimize Can be passed to return the repeat data without UI values. The optional sortColumn can be added
	 * to select a single column whose UI value will be calculated if the sorting logic requires it.
	 */
	getRowsByPath(
		options: Options & {
			readonly repeatDocumentPath: EntityInstancePath;
			readonly optimize: OptimizationParameters;
			readonly tableInteractionDocument?: GroupInstance;
		}
	): Data {
		const { optimize, repeatFormModelPath, repeatDocumentPath } = options;
		const formModel = ModelSelectors.formModel()(options.state);
		const documentModel = ModelSelectors.documentModel()(options.state);
		const document =
			options.tableInteractionDocument ??
			(DataSelectors.document()(options.state) as GroupInstance);

		const plainRows = DocumentUtils.getRows(document, repeatDocumentPath);
		const repeat = findElementByFormModelPath(formModel, repeatFormModelPath);
		if (!repeat) {
			return { rows: [] };
		}

		if (!isFormModelRepeat(repeat)) {
			return { rows: [] };
		}

		const repeatOverviewColumns = repeat.repeatOverviewColumn;
		const repeatableColumnNames = repeatOverviewColumns
			? repeatOverviewColumns.map(getModelPathElementName)
			: [];

		const rows: RepeatRow[] = plainRows
			? plainRows.map((_, index) => {
					const rowPath: EntityInstancePath = addIndexToSegment(repeatDocumentPath, index);

					return {
						path: rowPath,
						rowIndexInDocument: index,
						values: repeatOverviewColumns
							? repeatOverviewColumns.map((column, i) => {
									if (isFormModelFieldOverviewColumn(column)) {
										const fce =
											formModel.content.fieldConfiguration.fieldMap[
												ModelPath.toString(column.elementPath)
											];
										const computeUiValue = optimize
											? needsUiValue(optimize, column, documentModel, fce)
											: true;
										return mapForFieldOverviewColumn({
											...options,
											column,
											document,
											index: i,
											repeatableColumnNames,
											rowPath,
											computeUiValue
										});
									} else {
										const computeUiValue = optimize
											? needsUiValue(optimize, column, documentModel)
											: true;
										return mapForExpressionColumn({
											...options,
											column,
											document,
											index: i,
											repeatableColumnNames,
											rowPath,
											computeUiValue
										});
									}
								})
							: []
					};
				})
			: [];

		return { rows };
	},

	/** @internal */
	processData(
		options: Options & {
			readonly data: Data;
			readonly filterExpression?: RepeatExpressionFilter.ParsedFilterNode;
			readonly tableInteractionDocument?: GroupInstance;
		}
	): PaginatedRepeatData {
		const repeat = findElementByFormModelPath(
			ModelSelectors.formModel()(options.state),
			options.repeatFormModelPath
		);
		const isEmptyTableAndWithoutFilter =
			options.data.rows.length === 0 && options.filterExpression === undefined;

		if (!isFormModelRepeat(repeat) || isEmptyTableAndWithoutFilter) {
			return {
				rows: [],
				pageNumber: 1,
				totalNumberOfPages: 1,
				totalNumberOfRows: 0
			};
		}

		const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(options.repeatFormModelPath)(
			options.state
		);
		const sortedAndFilteredData = RepeatData.sortAndFilterData(options);

		if (sortedAndFilteredData.length > 0) {
			return paginateRows(sortedAndFilteredData, repeat, repeatStateEntry);
		}

		const isNewRowRecentlyAdded =
			repeatStateEntry?.newRow && repeatStateEntry.newRow.rowState === "recentlyAdded";

		return {
			rows: sortedAndFilteredData,
			pageNumber: 1,
			totalNumberOfPages: 1,
			totalNumberOfRows: 0,
			newRowShown: isNewRowRecentlyAdded ? false : undefined
		};
	},

	/** @internal */
	sortAndFilterData(options: {
		readonly data: Data;
		readonly repeatFormModelPath: ModelPath;
		readonly state: EngineState;
		readonly filterExpression?: RepeatExpressionFilter.ParsedFilterNode;
		readonly includeNewRow?: boolean;
		readonly tableInteractionDocument?: GroupInstance;
	}): ReadonlyArray<RepeatRow> {
		const { data, repeatFormModelPath, filterExpression, tableInteractionDocument } = options;

		const rows = data.rows;

		const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
			options.state
		);
		const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(
			options.state
		);
		const documentModel = ModelSelectors.documentModel()(options.state);
		const formModel = ModelSelectors.formModel()(options.state);

		const { newRow: newRowEntry, expandedRowPath } = repeatInstanceStateEntry ?? {};

		// to keep new rows at their current place in the repeat, excluded them from processing when:
		// - the row is actively worked on (rowState === "workingOn")
		// - an embedded row is worked on, but focus left the row (rowState === "recentlyAdded")
		const hasNewRow =
			newRowEntry &&
			(newRowEntry.rowState === "workingOn" ||
				(newRowEntry.rowState === "recentlyAdded" &&
					expandedRowPath !== undefined &&
					DocumentPath.equal(expandedRowPath, newRowEntry.rowPath)));
		const newRowIndex = rows.findIndex(row =>
			hasNewRow ? DocumentPath.equal(row.path, newRowEntry.rowPath) : false
		);

		const newRow = newRowIndex > -1 && !options.includeNewRow ? rows[newRowIndex] : undefined;
		const rowsWithNewRow =
			newRowIndex > -1 && !options.includeNewRow ? rows.toSpliced(newRowIndex, 1) : rows;

		const filters = repeatStaticStateEntry?.filters;
		const filteredRows = filters
			? filterRows(rowsWithNewRow, filters, formModel, documentModel)
			: rowsWithNewRow;

		const filterByFilterExpression = filterExpression
			? filterRowsByFilterExpression(
					filteredRows,
					filterExpression,
					ModelSelectors.documentModel()(options.state),
					tableInteractionDocument ?? (DataSelectors.document()(options.state) as GroupInstance)
				)
			: filteredRows;

		const sortingState = InternalUiStateSelectors.getCurrentSortingState(repeatFormModelPath)(
			options.state
		);
		const sortedRows =
			sortingState && sortingState.sorting !== "none"
				? sort(
						filterByFilterExpression,
						sortingState.orderPath,
						UiStateSelectors.locale()(options.state),
						formModel,
						documentModel,
						sortingState.sorting
					)
				: filterByFilterExpression;

		const currentShownRows = newRow ? sortedRows.toSpliced(newRowIndex, 0, newRow) : sortedRows;

		return currentShownRows;
	},

	/** @internal */
	getPageOfNewRow(
		options: Options & {
			readonly repeat: FormModel.Repeat;
			readonly repeatStateEntry?: EngineStore.Repeat.InstanceState;
		}
	): {
		page: number;
	} {
		const { state, repeatFormModelPath, repeat } = options;

		const currentContext = UiStateSelectors.currentScreenLocation()(state).path;

		const documentModel = ModelSelectors.documentModel()(state);
		const repeatDocumentPath = getDocumentPath(documentModel, repeat.groupPath, currentContext);

		const repeatStateEntry =
			options.repeatStateEntry ??
			UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(state);
		const rows = RepeatData.getRowsByPath({
			...options,
			repeatDocumentPath,
			optimize: RepeatData.getOptimizationParameters(repeatFormModelPath, state)
		});

		const sortedFilteredRows = RepeatData.sortAndFilterData({
			data: rows,
			repeatFormModelPath,
			state,
			filterExpression: repeat.filterExpressionTree,
			includeNewRow: true
		});

		return getNewRowInformation({
			pageSize: repeat.pageSize,
			acceptedRowState: "workingOn",
			repeatStateEntry,
			sortedFilteredRows
		});
	},

	/** @internal */
	getOptimizationParameters(
		repeatFormModelPath: ModelPath,
		state: EngineState
	): OptimizationParameters {
		const repeatStateEntry = UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(state);
		const filterColumnIds = repeatStateEntry?.filters ? Object.keys(repeatStateEntry.filters) : [];

		const sortColumn =
			InternalUiStateSelectors.getCurrentSortingState(repeatFormModelPath)(state)?.orderPath;
		const sortColumnId = sortColumn ? getColumnId(sortColumn, state) : undefined;

		return { sortColumnId, filterColumnIds };
	},

	/** @internal */
	getProcessedData({
		state,
		converter,
		localizer,
		externalEnumerationProvider,
		repeatFormModelPath,
		repeatDocumentPath,
		filterExpression,
		tableInteractionDocument
	}: Options & {
		readonly repeatDocumentPath: EntityInstancePath;
		readonly filterExpression?: RepeatExpressionFilter.ParsedFilterNode;
		readonly tableInteractionDocument?: GroupInstance;
	}) {
		const data = RepeatData.getRowsByPath({
			converter,
			localizer,
			repeatDocumentPath,
			state,
			repeatFormModelPath,
			externalEnumerationProvider,
			optimize: RepeatData.getOptimizationParameters(repeatFormModelPath, state),
			tableInteractionDocument
		});

		return RepeatData.processData({
			data,
			repeatFormModelPath,
			converter,
			localizer,
			state,
			filterExpression,
			tableInteractionDocument
		});
	}
};

function needsUiValue(
	parameters: OptimizationParameters,
	column: FormModel.RepeatOverviewColumn,
	documentModel: DocumentModel,
	fce?: FormModel.FieldConfigurationEntry
): boolean {
	const { sortColumnId, filterColumnIds } = parameters;
	const isSorted = sortColumnId !== undefined && sortColumnId === column.id;
	const isFiltered = filterColumnIds.some(id => id === getModelPathElementName(column));

	if (isFormModelFieldOverviewColumn(column)) {
		const field = DocumentModelUtils.findByPath(documentModel, column.elementPath);
		if (field.type === "Field") {
			if (
				(isSorted && mustBeConvertedForSorting(field.fieldType, fce)) ||
				(isFiltered && mustBeConvertedForFiltering(field.fieldType, column, fce))
			) {
				return true;
			}
		}
	} else {
		// ExpressionOverviewColumn
		return isSorted || isFiltered;
	}
	return false;
}

function getNewRowInformation(options: {
	readonly pageSize?: number;
	readonly sortedFilteredRows: ReadonlyArray<RepeatRow>;
	readonly acceptedRowState: "workingOn" | "recentlyAdded";
	readonly repeatStateEntry?: EngineStore.Repeat.InstanceState | undefined;
}): { page: number; newRowShown: boolean } {
	const { sortedFilteredRows, pageSize, repeatStateEntry } = options;
	const { newRow: newRowEntry } = repeatStateEntry ? repeatStateEntry : { newRow: undefined };

	let newRowShown = true;
	let pageNumber: number | undefined;
	if (newRowEntry && newRowEntry.rowState === options.acceptedRowState) {
		const rowIndex = sortedFilteredRows.findIndex(row =>
			DocumentPath.equal(row.path, newRowEntry.rowPath)
		);
		if (rowIndex < 0) {
			newRowShown = false;
		} else if (pageSize) {
			pageNumber = getPageCount(rowIndex + 1, pageSize);
		}
	}

	return { page: pageNumber || 1, newRowShown };
}

/** @internal */
function getColumnId(columnPath: ModelPath, state: EngineState): string | undefined {
	const formModel = ModelSelectors.formModel()(state);
	const modelColumn = findElementByFormModelPath(formModel, columnPath);
	return modelColumn ? (modelColumn as FormModel.RepeatOverviewColumn).id : undefined;
}

/** @internal */
function paginateRows(
	sortedFilteredRows: ReadonlyArray<RepeatRow>,
	{ pageSize, repeatOverviewColumn }: FormModel.Repeat,
	repeatStateEntry?: EngineStore.Repeat.InstanceState
): PaginatedRepeatData {
	let pageNumber = repeatStateEntry ? repeatStateEntry.page || 1 : 1;

	const newRowInformation = getNewRowInformation({
		pageSize,
		repeatStateEntry,
		sortedFilteredRows,
		acceptedRowState: "recentlyAdded"
	});
	const newRowShown = newRowInformation.newRowShown;

	if (pageSize) {
		const pageCount = getPageCount(sortedFilteredRows.length, pageSize);
		if (pageCount < pageNumber) {
			pageNumber = pageCount;
		}
	}

	const rows = pageSize
		? sortedFilteredRows.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
		: sortedFilteredRows;

	const summaryResult = calculateSummaryResult(repeatOverviewColumn ?? [], sortedFilteredRows);

	return {
		rows,
		totalNumberOfPages: getPageCount(sortedFilteredRows.length, pageSize),
		totalNumberOfRows: sortedFilteredRows.length,
		pageNumber,
		newRowShown,
		summaryResult
	};
}

function addIndexToSegment(path: EntityInstancePath, index: number): EntityInstancePath {
	return [
		...path.slice(0, path.length - 1),
		{ elementName: path[path.length - 1].elementName, index: index + 1 }
	];
}

function getPageCount(rows: number, pageSize?: number): number {
	// We always render at least one page.
	if (!pageSize || rows === 0) {
		return 1;
	} else {
		return Math.ceil(rows / pageSize);
	}
}

function mapForFieldOverviewColumn(options: {
	readonly column: FormModel.FieldOverviewColumn;
	readonly rowPath: EntityInstancePath;
	readonly converter: ValueConversion;
	readonly localizer: Localizer;
	readonly state: EngineState;
	readonly document: GroupInstance;
	readonly repeatFormModelPath: ModelPath;
	readonly repeatableColumnNames: string[];
	readonly index: number;
	readonly externalEnumerationProvider?: IExternalEnumerationProvider;
	readonly computeUiValue: boolean;
}): Value {
	const { state, column, document, rowPath, repeatFormModelPath, repeatableColumnNames, index } =
		options;
	const messages = UiStateSelectors.messages()(state);
	const documentModel = ModelSelectors.documentModel()(state);
	const formModel = ModelSelectors.formModel()(state);
	const elementPath = column.elementPath;
	const elementDocumentPath: EntityInstancePath = getDocumentPath(
		documentModel,
		elementPath,
		rowPath
	);

	const jsonValue = DocumentUtils.getValue({ document, path: elementDocumentPath });
	const messageState = messages[DocumentPath.toString(elementDocumentPath)];

	const modelElement = DocumentModelUtils.findByPath(documentModel, elementDocumentPath);

	return {
		ui:
			modelElement.type === "Field" && options.computeUiValue
				? calculateUiValueForField(
						documentModel,
						formModel,
						modelElement,
						elementDocumentPath,
						options.localizer,
						options.converter,
						DocumentModelUtils.conversionConfig(documentModel, elementDocumentPath),
						messageState,
						jsonValue,
						formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(column.elementPath)],
						options.externalEnumerationProvider
					)
				: "",
		data: jsonValue,
		path: elementDocumentPath,
		formModelPath: [...repeatFormModelPath, { elementName: repeatableColumnNames[index] }]
	};
}

function mapForExpressionColumn(options: {
	readonly column: FormModel.ExpressionOverviewColumn;
	readonly document: GroupInstance;
	readonly rowPath: EntityInstancePath;
	readonly converter: ValueConversion;
	readonly localizer: Localizer;
	readonly state: EngineState;
	readonly repeatFormModelPath: ModelPath;
	readonly repeatableColumnNames: string[];
	readonly index: number;
	readonly externalEnumerationProvider?: IExternalEnumerationProvider;
	readonly computeUiValue: boolean;
}): Value {
	const { column, rowPath, repeatFormModelPath, repeatableColumnNames, index, document } = options;
	const expressionValue = options.computeUiValue
		? getExpressionValue({
				state: options.state,
				converter: options.converter,
				localizer: options.localizer,
				expressionTree: column.expressionTree,
				dataContext: rowPath,
				document,
				externalEnumerationProvider: options.externalEnumerationProvider
			})
		: "";
	return {
		ui: expressionValue,
		data: expressionValue,
		path: [],
		formModelPath: [...repeatFormModelPath, { elementName: repeatableColumnNames[index] }]
	};
}
