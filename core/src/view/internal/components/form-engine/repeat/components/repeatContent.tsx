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

import { type JSX, useContext, useEffect, useRef } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import type { EngineState } from "../../../../../../back-end/store/index.js";
import { UiStateSelectors } from "../../../../../../back-end/store/index.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../../models/index.js";
import { DefaultRepeatButtonNames } from "../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";
import { UtilityClasses } from "../../../../utilities/css-classes.js";
import { isRowActionHiddenByEnablementMap } from "../../../../utilities/enablements/hidden-row-actions.js";
import { REPEAT_CONTENT } from "../../data-roles.js";

import { filterErrorMessagesForNonVisibleFields } from "./filterErrorMessagesForNonVisibleFields.js";
import { Pagination } from "./footer/Pagination.js";
import { RepeatAddButton } from "./footer/RepeatAddButton.js";
import type { PaginatedRepeatData } from "./repeat-data.js";
import { RepeatUtils } from "./repeat-utils.js";
import type { RepeatTemplateProps } from "./repeatProps.js";
import { InfiniteScrollingRepeatTable, RepeatTable } from "./RepeatTable.js";
import { computeColumns } from "./tableColumnsFunctions.js";
import type { RepeatRow } from "./tableColumnTypes.js";
import type { TableStyleOptions } from "./TableStyleOptions.js";

/** @internal */
export function RepeatContent(
	props: {
		cardView?: boolean;
		totalNumberOfRows: number;
		processedData: PaginatedRepeatData;
		tableStyleOptions?: TableStyleOptions;
	} & RepeatTemplateProps
): JSX.Element {
	const { config, totalNumberOfRows, modelElement, processedData, tableStyleOptions } = props;
	const { renderOptions: options } = config;

	const { localizer, conversion } = useContext(LocalizerContext);
	const { Clearfix } = useContext(WidgetMapContext);

	const pagination = !tableStyleOptions?.infiniteScrolling
		? Pagination(
				config.renderOptions,
				processedData.totalNumberOfPages,
				processedData.pageNumber,
				config.parentPath,
				"pagination"
			)
		: undefined;

	const rows = processedData.rows;
	const mayAdd = RepeatUtils.mayAdd(modelElement, totalNumberOfRows, options.state);

	const hiddenByMap = isRowActionHiddenByEnablementMap({
		byRow: options.config.enablements?.byRow || {},
		eventName: DefaultRepeatButtonNames.add,
		repeat: modelElement,
		state: options.state
	});

	const showAddButton = hiddenByMap === undefined ? !props.readonly && mayAdd : !hiddenByMap;

	const tableId = UiId.generateForRepeatTable({
		id: modelElement.id,
		uiIdPrefix: options.config.uiIdPrefix
	});

	const showValidationColumn = useShowValidationColumn(
		options.state,
		rows,
		modelElement,
		config.parentPath
	);

	const additionalLeftColumns =
		FormModel.DetachedRepeat.isInstance(modelElement) || showValidationColumn
			? props.additionalLeftColumns
			: props.additionalLeftColumns?.filter(col => col.type !== "validation");

	const columns = [
		...(additionalLeftColumns ?? []),
		...computeColumns(
			config.parentPath,
			modelElement,
			config,
			localizer,
			conversion,
			props.defaultColumnVerticalAlignment,
			processedData,
			props.EditViewButton,
			tableStyleOptions?.actionColumnWidth
		)
	];

	return (
		<div key="repeatContent" data-role={REPEAT_CONTENT} className={UtilityClasses.MARGIN_BOTTOM_SM}>
			{tableStyleOptions?.infiniteScrolling ? (
				<InfiniteScrollingRepeatTable
					{...props}
					columns={columns}
					totalNumberOfRows={totalNumberOfRows}
					uiId={tableId}
					tableStyleOptions={tableStyleOptions}
					converter={conversion}
				/>
			) : (
				<RepeatTable
					{...props}
					columns={columns}
					totalNumberOfRows={totalNumberOfRows}
					uiId={tableId}
					tableStyleOptions={tableStyleOptions}
					localizer={localizer}
					converter={conversion}
				/>
			)}

			{pagination !== null || showAddButton ? (
				<Clearfix key="footer">
					{pagination}
					{showAddButton ? <RepeatAddButton {...{ config, modelElement }} /> : null}
				</Clearfix>
			) : null}
		</div>
	);
}

/**
 * @internal
 *
 * Whether the validation column is rendered as additional left column in the table.
 *
 * Note: While an embedded repeat row is open, the number of columns need to stay the same for A11y.
 * Therefore, we store the value of `showValidationColumn` whenever the expansion state changed
 * and re-use that value while the row is open.
 */
export function useShowValidationColumn(
	state: EngineState,
	rows: readonly RepeatRow[],
	modelElement: FormModel.Repeat,
	repeatFormModelPath: ModelPath
): boolean {
	const showValidationColumn = FormModel.EmbeddedRepeat.isInstance(modelElement)
		? modelElement.multiFileUpload
			? hasAtLeastOneValidationError(rows, state)
			: hasAtLeastOneValidationErrorForVisibleField(rows, modelElement, state)
		: FormModel.InlineRepeat.isInstance(modelElement) && modelElement.multiFileUpload
			? hasAtLeastOneValidationErrorForNonVisibleField(
					rows,
					modelElement,
					repeatFormModelPath,
					state
				)
			: false;

	const entry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(state);
	const ref = useRef(showValidationColumn);
	useEffect(() => {
		ref.current = showValidationColumn;
		// eslint warns about showValidationColumn being stale, but this is what we want here
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [entry?.expandedRowPath]);

	return entry?.expandedRowPath !== undefined ? ref.current : showValidationColumn;
}

function hasAtLeastOneValidationError(rows: readonly RepeatRow[], state: EngineState) {
	return rows.some(row => {
		const errorMessagesForRow = UiStateSelectors.messagesByPath(row.path, [], "error")(state);
		return errorMessagesForRow.length > 0;
	});
}

function hasAtLeastOneValidationErrorForNonVisibleField(
	rows: readonly RepeatRow[],
	repeat: FormModel.InlineRepeat,
	repeatFormModelPath: ModelPath,
	state: EngineState
) {
	return rows.some(row => {
		const errorMessagesForRow = UiStateSelectors.messagesByPath(row.path, [], "error")(state);
		const filteredMessages = filterErrorMessagesForNonVisibleFields(
			repeat,
			repeatFormModelPath,
			state,
			errorMessagesForRow
		);
		return filteredMessages.length > 0;
	});
}

/**
 * Returns `true` if there exists at least one
 * validation error which references a visible field in `repeat`.
 */
function hasAtLeastOneValidationErrorForVisibleField(
	rows: readonly RepeatRow[],
	repeat: FormModel.EmbeddedRepeat,
	state: EngineState
) {
	return rows.some(row => {
		const errorMessagesForRow = UiStateSelectors.messagesByPath(row.path, [], "error")(state);

		return errorMessagesForRow.some(e =>
			repeat.controlGrid.row?.some(r =>
				r.cell?.some(
					c => FormModel.Control.isInstance(c) && ModelPath.equal(e.element, c.elementPath)
				)
			)
		);
	});
}
