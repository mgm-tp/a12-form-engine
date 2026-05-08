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

import type { JSX } from "react";
import { useContext, useEffect, useRef } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { VirtualScrollOptions } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.api.js";

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { usePrevious } from "../../../../../../internal/debugProps.js";
import { FormModel } from "../../../../../../models/index.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import { getTitleLabel } from "../../model-element-labels.js";

import type { TableWidgetMap } from "../table-widget-map.js";
import { TableWidgetMapContext } from "../table-widget-map.js";

import type { TableStyleOptions } from "./TableStyleOptions.js";
import { onBlurTable } from "./body/onBlur.js";
import { getDndOptions } from "./dndOptions.js";
import { RepeatUtils } from "./repeat-utils.js";
import type { RepeatTableProps } from "./repeatProps.js";
import { getSortState, OnSort } from "./sortState.js";
import type { RepeatRow } from "./tableColumnTypes.js";
import { RepeatTableColumn } from "./tableColumnTypes.js";
import { useTableComponentRenderers } from "./tableComponentRenderers.js";

/** @internal */
export function RepeatTable(props: RepeatTableProps) {
	const { config, modelElement, processedData, cardView, infiniteScrolling, localizer, converter } =
		props;
	const { renderOptions: options } = config;

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(options.state);
	const dataContext = currentScreenLocation.path;

	const componentMap = useContext(ComponentMapContext);
	const tableWidgetMap = useContext(TableWidgetMapContext);
	const { Table } = tableWidgetMap as unknown as TableWidgetMap<RepeatRow, RepeatTableColumn>;

	// title is used only for the aria label, so we
	// do not parse formatted expressions into html
	const label = getTitleLabel(
		options,
		modelElement,
		props.config.parentPath,
		dataContext,
		localizer,
		converter,
		componentMap,
		false
	);

	const dragDropOptions = getDndOptions(
		props.modelElement,
		props.uiId,
		props.config,
		props.readonly
	);

	const showHeadFilter =
		RepeatUtils.isFilterRowOpen(props.config) &&
		props.modelElement.repeatOverviewColumn?.some(col => col.filterable);

	const showSummary =
		props.processedData.rows.length > 0 &&
		props.modelElement.repeatOverviewColumn?.some(
			col => FormModel.FieldOverviewColumn.isInstance(col) && col.showSummary
		);

	const { headFilterContentRenderer, footContentRenderer, ...commonTableComponentRenderers } =
		useTableComponentRenderers(props);

	const tableComponentRenderers = {
		...commonTableComponentRenderers,
		...(showHeadFilter ? { headFilterContentRenderer } : {}),
		...(showSummary ? { footContentRenderer } : {})
	};

	return (
		<Table
			id={props.uiId}
			ariaLabel={label}
			key="masterTable"
			cardView={cardView}
			columns={props.columns}
			dragDropOptions={dragDropOptions}
			componentRenderers={tableComponentRenderers}
			data={processedData.rows as RepeatRow[]}
			disabled={props.disabled}
			rowKey={params => DocumentPath.toString(params.row.path)}
			sortOptions={{
				sortState: getSortState(props.columns, config),
				onSort: OnSort(modelElement.repeatOverviewColumn, props.columns, config)
			}}
			style={infiniteScrolling?.style}
			infiniteScrollOptions={infiniteScrolling?.infiniteScrollOptions}
			onBlur={onBlurTable(config, modelElement)}
			hasFootContent={processedData.newRowShown === false || showSummary}
			columnResizingOptions={
				modelElement.enableColumnsResize
					? {
							onEndResize: ({ resizedWidthsGetter, resizedColumn }): void => {
								if (
									RepeatTableColumn.isFieldColumn(resizedColumn) ||
									RepeatTableColumn.isExpressionColumn(resizedColumn)
								) {
									const newWidth = resizedWidthsGetter?.(resizedColumn);
									if (newWidth) {
										config.renderOptions.eventHandlers.repeat.onColumnWidthChange(
											resizedColumn.modelPath,
											newWidth
										);
									}
								}
							}
						}
					: undefined
			}
		/>
	);
}

// we need the typing of the list for the ref
// we don't want to depend on react-virtualized ourselves, so we extract it from widgets api
type ReactVirtualizedList = Parameters<NonNullable<VirtualScrollOptions["listRef"]>>[number];

/** @internal */
export function InfiniteScrollingRepeatTable(
	repeatTableProps: Omit<RepeatTableProps, "localizer"> & { tableStyleOptions: TableStyleOptions }
): JSX.Element {
	const { localizer, conversion } = useContext(LocalizerContext);

	const listRef = useRef<ReactVirtualizedList>(null);
	const { config, tableStyleOptions } = repeatTableProps;

	const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(config.parentPath)(
		config.renderOptions.state
	);

	const screenLocationStack = config.renderOptions.state.ui.screenLocation;
	const { focusedComponent, focusedComponentRequestCount } =
		screenLocationStack[screenLocationStack.length - 1];

	const previousFocusedComponent = usePrevious(focusedComponent);
	const previousRequestCount = usePrevious(focusedComponentRequestCount);

	useEffect(() => {
		listRef.current?.scrollToRow(0);
	}, [
		repeatStaticStateEntry?.sortingState?.sorting,
		repeatStaticStateEntry?.sortingState?.orderPath
	]);

	useEffect(() => {
		if (
			focusedComponent?.index === undefined ||
			!ModelPath.contains(focusedComponent?.formModelPath, config.parentPath)
		) {
			return;
		}

		// Check if something changed
		if (
			previousFocusedComponent &&
			ModelPath.equal(previousFocusedComponent.formModelPath, focusedComponent.formModelPath) &&
			previousRequestCount === focusedComponentRequestCount
		) {
			return;
		}

		const rowIndex = repeatTableProps.processedData.rows.findIndex(
			row => row.rowIndexInDocument === focusedComponent.index
		);
		listRef.current?.scrollToRow(rowIndex);
	}, [
		previousFocusedComponent,
		focusedComponent,
		focusedComponentRequestCount,
		config.parentPath,
		previousFocusedComponent?.formModelPath,
		previousRequestCount,
		repeatTableProps.processedData.rows
	]);

	return (
		<RepeatTable
			{...repeatTableProps}
			infiniteScrolling={{
				infiniteScrollOptions: {
					rowCount: repeatTableProps.processedData.rows.length,
					rowHeight: tableStyleOptions.rowHeight ?? 50,
					loadData: () => {
						return Promise.resolve();
					},
					rowLoadingStatus: () => {
						return "loaded";
					},
					overrideListProps: {
						listRef: (ref): void => {
							listRef.current = ref;
						},
						scrollToIndex: focusedComponent?.index
					}
				},
				style: { height: tableStyleOptions.tableHeight }
			}}
			localizer={localizer}
			converter={conversion}
		/>
	);
}
