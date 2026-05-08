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
import type { SortState } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.api.js";

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../../models/internal/form-model.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";

import { RepeatTableColumn } from "./tableColumnTypes.js";

/** @internal */
export function getSortState(
	columns: RepeatTableColumn[],
	config: FormModelMap.RenderConfiguration
): SortState<RepeatTableColumn> | undefined {
	const { renderOptions: options, parentPath: repeatFormModelPath } = config;
	const sortingState = UiStateSelectors.getCurrentSortingState(repeatFormModelPath)(options.state);

	const sortingColumnPath = sortingState ? sortingState.orderPath : undefined;

	if (sortingState && sortingState.sorting === "none") {
		return undefined;
	}

	if (sortingColumnPath === undefined) {
		return undefined;
	}

	const sortingColumn = columns.find(c => columnMatchesModelPath(c, sortingColumnPath));
	if (sortingColumn === undefined) {
		return undefined;
	}

	const order =
		sortingState && sortingState.sorting && sortingState.sorting !== "none"
			? sortingState.sorting
			: undefined;

	return { column: sortingColumn, order };
}

/** @internal */
export function OnSort(
	modelColumns: readonly FormModel.RepeatOverviewColumn[] | undefined,
	tableColumns: RepeatTableColumn[],
	renderConfiguration: FormModelMap.RenderConfiguration
): (params: { column: RepeatTableColumn }) => void {
	if (!modelColumns) {
		return () => {};
	}
	return params => {
		const sortColumn = params.column;
		if (
			!(
				RepeatTableColumn.isFieldColumn(sortColumn) ||
				RepeatTableColumn.isExpressionColumn(sortColumn)
			)
		) {
			return;
		}

		const currentSortingState = getSorting(tableColumns, renderConfiguration);

		const preferredSorting = sortColumn.modelElement.preferredSorting
			? sortColumn.modelElement.preferredSorting === "ASC"
				? "asc"
				: "desc"
			: undefined;

		let sorting: UiStateSelectors.SortingOrder;
		if (currentSortingState) {
			const currentSortingStateColumn = currentSortingState.column;
			if (
				!(
					RepeatTableColumn.isFieldColumn(currentSortingStateColumn) ||
					RepeatTableColumn.isExpressionColumn(currentSortingStateColumn)
				)
			) {
				return;
			}
			sorting = ModelPath.equal(currentSortingStateColumn.modelPath, sortColumn.modelPath)
				? getNextSorting(currentSortingState.sortingOrder, preferredSorting)
				: getNextSorting(undefined, preferredSorting);
		} else {
			sorting = getNextSorting(undefined, preferredSorting);
		}

		renderConfiguration.renderOptions.eventHandlers.repeat.onSortingChange(
			renderConfiguration.parentPath,
			sortColumn.modelPath,
			sorting
		);
	};
}

function getSorting(
	tableColumns: RepeatTableColumn[],
	renderConfiguration: FormModelMap.RenderConfiguration
): Sorting | undefined {
	const { renderOptions: options, parentPath: repeatFormModelPath } = renderConfiguration;
	const sortingState = UiStateSelectors.getCurrentSortingState(repeatFormModelPath)(options.state);

	const sortingColumnPath = sortingState ? sortingState.orderPath : undefined;

	if (sortingState && sortingState.sorting === "none") {
		return undefined;
	}

	if (sortingColumnPath !== undefined) {
		const column = tableColumns.find(c => columnMatchesModelPath(c, sortingColumnPath));
		if (column !== undefined) {
			return {
				column,
				sortingOrder: sortingState && sortingState.sorting ? sortingState.sorting : "none"
			};
		}
	}
	return undefined;
}

interface Sorting {
	readonly column: RepeatTableColumn;
	readonly sortingOrder: UiStateSelectors.SortingOrder;
}

function getNextSorting(
	sorting?: UiStateSelectors.SortingOrder,
	preferredSorting?: UiStateSelectors.SortingOrder
): UiStateSelectors.SortingOrder {
	const cycle: { readonly [key: string]: UiStateSelectors.SortingOrder } =
		preferredSorting && preferredSorting === "desc"
			? {
					none: "desc",
					desc: "asc",
					asc: "none"
				}
			: {
					none: "asc",
					asc: "desc",
					desc: "none"
				};
	return cycle[sorting || "none"];
}

function columnMatchesModelPath(column: RepeatTableColumn, formModelPath: ModelPath): boolean {
	return RepeatTableColumn.isFieldColumn(column) || RepeatTableColumn.isExpressionColumn(column)
		? ModelPath.equal(column.modelPath, formModelPath)
		: false;
}
