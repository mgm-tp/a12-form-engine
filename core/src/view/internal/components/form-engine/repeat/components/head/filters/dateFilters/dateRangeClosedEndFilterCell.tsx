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

import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { RESOURCE_KEYS } from "../../../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../../../back-end/localization/internal/localize.js";
import {
	ModelSelectors,
	UiStateSelectors
} from "../../../../../../../../../back-end/store/index.js";
import type { RepeatFilter } from "../../../../../../../../../back-end/store/index.js";
import { isDateRangeFilter } from "../../../../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../../../../back-end/utils/internal/path.js";
import * as DocumentModelUtils from "../../../../../../../../../models/internal/utils/document-model-utils.js";
import { ComponentMapContext } from "../../../../../../../configuration/componentMap/component-map-context.js";
import { DateRangeFilter } from "../../../../../cells/controls/date/date-range-input.js";

import { EmptyFilterInput } from "../emptyFilterInput.js";
import type { DateFilterCellProps } from "../filter-cell.js";

interface DateRangeClosedFilterCellProps extends DateFilterCellProps {
	readonly dataType: DocumentModel.DateRangeType;
}

/**
 * @internal
 * This case is only relevant when interpretationOfYear is set in the Document Model.
 * This cannot be modeled in the SME at the moment, but needs to be set directly in the JSON.
 * This filter option only allows date range values. That's why only one input is rendered to enter that value.
 * Entering only a start date and leaving the end date open is not possible.
 */
export function DateRangeClosedEndFilterCell(props: DateRangeClosedFilterCellProps) {
	const { options, element, filter, repeatFormModelPath, dataType } = props;
	const { MessageList } = useContext(ComponentMapContext);
	const { localizer, conversion } = useContext(LocalizerContext);

	const documentModel = ModelSelectors.documentModel()(options.state);
	const disabled = UiStateSelectors.disabled()(options.state);
	const datePickerConfig = props.element.datePickerConfig;
	const screenDataContext = UiStateSelectors.currentScreenLocation()(options.state).path;
	const columnDocumentPath = getDocumentPath(documentModel, element.elementPath, screenDataContext);

	const conversionConfig = DocumentModelUtils.useConversionConfig(
		documentModel,
		columnDocumentPath
	);

	const filterRange = filter && isDateRangeFilter(filter) ? filter.filterRange : undefined;
	const filterValue = filterRange?.data
		? {
				ui: conversion.formatValue(filterRange.data, conversionConfig) ?? "",
				data: filterRange.data
			}
		: undefined;

	const label = getLocalizedResource(RESOURCE_KEYS.repeat.filter.dateRange.title, localizer) ?? "";

	const id = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix
	});

	const message = filterRange?.message;

	const errorMessageContainer = message ? (
		<MessageList id="-error" messages={[[message.error.errorText]]} key="errors" />
	) : undefined;

	const value = {
		ui: message ? message.value : filterValue ? filterValue.ui : "",
		data: filterValue ? filterValue.data : null,
		path: columnDocumentPath
	};

	return (
		<>
			<EmptyFilterInput
				options={options}
				element={element}
				repeatFormModelPath={repeatFormModelPath}
				filter={filter}
				onChange={() => {
					options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, element.id, {
						filterRange: filterRange ?? null,
						filterNull: !filter?.filterNull
					} as RepeatFilter);
				}}
			/>
			{!filter?.filterNull && (
				<DateRangeFilter
					id={id}
					value={value}
					dataType={dataType}
					renderOptions={options}
					label={label}
					datePickerConfig={datePickerConfig}
					onFilterTyped={value => {
						const result = conversion.parseValue(value, conversionConfig);
						if (result.parseError) {
							options.eventHandlers.repeat.onFilterParseError(element.id, repeatFormModelPath, {
								type: "FilterParseError",
								value,
								error: result.parseError
							});
						} else {
							options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, element.id, {
								...filter,
								filterRange: result.value !== null ? { data: result.value as Date[] } : null
							});
						}
					}}
					onFilterSelected={value => {
						const newValue = value.from && value.to ? [value.from, value.to] : undefined;
						options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, element.id, {
							...filter,
							filterRange: { data: newValue }
						});
					}}
					errorMessage={errorMessageContainer}
					disabled={disabled}
				/>
			)}
		</>
	);
}
