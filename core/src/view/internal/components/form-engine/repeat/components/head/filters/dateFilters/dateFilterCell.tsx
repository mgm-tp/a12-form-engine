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

import type { ComponentType, ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { DateRangeConversionConfig } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { RESOURCE_KEYS } from "../../../../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../../../../back-end/localization/internal/localize.js";
import {
	ModelSelectors,
	UiStateSelectors
} from "../../../../../../../../../back-end/store/index.js";
import type {
	DateRangeRepeatFilter,
	DateRepeatFilter,
	FilterParseError,
	RangeFilterParseError
} from "../../../../../../../../../back-end/store/internal/store.js";
import { isRangeFilter } from "../../../../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../../../../back-end/utils/internal/path.js";
import * as DocumentModelUtils from "../../../../../../../../../models/internal/utils/document-model-utils.js";
import { ComponentMapContext } from "../../../../../../../configuration/componentMap/component-map-context.js";
import type { ValidationMessagesProps } from "../../../../../../widgets/validationMessages.js";
import { DateFragmentFilter } from "../../../../../cells/controls/date/date-fragment-input.js";
import { DateFilter } from "../../../../../cells/controls/date/date-input.js";
import { DateTimeFilter } from "../../../../../cells/controls/date/date-time-input.js";
import type { DateFilterProps, FilterBaseProps } from "../../../../../cells/controls/date/props.js";
import { TimeFilter } from "../../../../../cells/controls/date/time-input.js";

import { EmptyFilterInput } from "../emptyFilterInput.js";
import type { DateFilterCellProps } from "../filter-cell.js";

import { DateRangeClosedEndFilterCell } from "./dateRangeClosedEndFilterCell.js";

/** @internal */
export function DateFilterCell(props: DateFilterCellProps): ReactElement {
	const { options, element, filter, repeatFormModelPath, dataType } = props;
	const { localizer, conversion } = useContext(LocalizerContext);
	const { MessageList } = useContext(ComponentMapContext);
	const disabled = UiStateSelectors.disabled()(options.state);

	const documentModel = ModelSelectors.documentModel()(options.state);

	const datePickerConfig = props.element.datePickerConfig;

	const context = UiStateSelectors.currentScreenLocation()(options.state).path;
	const columnDocumentPath = getDocumentPath(documentModel, element.elementPath, context);

	const conversionConfig = DocumentModelUtils.useConversionConfig(
		documentModel,
		columnDocumentPath
	);

	const isClosedEndDateRange = dataType.type === "DateRangeType" && dataType.interpretationOfYear;
	if (isClosedEndDateRange) {
		return (
			<DateRangeClosedEndFilterCell
				dataType={dataType}
				options={options}
				filter={filter}
				element={element}
				repeatFormModelPath={repeatFormModelPath}
			/>
		);
	}

	// note: This is the standard case in A12
	// Two inputs are rendered to receive the "from" and "to" values for the range filter.
	// In case of a filter for a date range field, dates are expected as from and to values.
	const config =
		conversionConfig.type === "DateRangeType"
			? {
					...conversionConfig,
					singleDate: "only" as DateRangeConversionConfig["singleDate"]
				}
			: conversionConfig;

	const { fromFilter, toFilter } = getFilterValues(filter);
	const labelFrom = getLocalizedResource(RESOURCE_KEYS.repeat.filter.date.from, localizer) || "";
	const labelTo = getLocalizedResource(RESOURCE_KEYS.repeat.filter.date.to, localizer) || "";

	const idFrom = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-from"
	});
	const idTo = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-to"
	});

	const baseOptions = {
		renderOptions: options,
		path: columnDocumentPath,
		datePickerConfig,
		disabled
	};
	const fromOptions: FilterBaseProps = {
		...baseOptions,
		id: idFrom,
		label: labelFrom,
		filter: fromFilter,
		message:
			filter && isRangeFilter(filter) && filter.from !== null ? filter.from.message : undefined
	};
	const toOptions: FilterBaseProps = {
		...baseOptions,
		id: idTo,
		label: labelTo,
		filter: toFilter,
		message: filter && isRangeFilter(filter) && filter.to ? filter.to.message : undefined
	};

	function getFilterValues(filter: DateRepeatFilter | DateRangeRepeatFilter | undefined) {
		if (!filter || !isRangeFilter(filter)) {
			return { fromFilter: undefined, toFilter: undefined };
		}

		const fromFilter =
			filter.from !== null && filter.from.data
				? {
						ui: conversion.formatValue(filter.from.data, config) ?? "",
						data: filter.from.data
					}
				: undefined;

		const toFilter =
			filter.to !== null && filter.to.data
				? {
						ui: conversion.formatValue(filter.to.data, config) ?? "",
						data: filter.to.data
					}
				: undefined;

		return { fromFilter, toFilter };
	}

	const onFromFilterSelected = (value?: Date) => {
		const toValue =
			filter && isRangeFilter(filter) && filter.to !== null
				? !filter.to.message
					? { data: filter.to.data as Date }
					: { message: filter.to.message }
				: null;

		options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, element.id, {
			...filter,
			to: toValue,
			from: value ? { data: value } : null
		});
	};
	const onToFilterSelected = (value?: Date) => {
		const fromValue =
			filter && isRangeFilter(filter) && filter.from !== null
				? !filter.from.message
					? { data: filter.from.data as Date }
					: { message: filter.from.message }
				: null;

		options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, element.id, {
			...filter,
			from: fromValue,
			to: value ? { data: value } : null
		});
	};

	const validateValue = (value: string, type: "from" | "to") => {
		const result = conversion.parseValue(value, config);

		if (!result.parseError) {
			return {
				newFilter:
					type === "from"
						? {
								...filter,
								from: result.value !== null ? { data: result.value as Date } : null,
								to: toFilter ? toFilter : null
							}
						: {
								...filter,
								from: fromFilter ? fromFilter : null,
								to: result.value !== null ? { data: result.value as Date } : null
							}
			};
		}

		const filterParseError: FilterParseError = {
			type: "FilterParseError",
			value,
			error: result.parseError
		};
		const errorInfo: RangeFilterParseError = {
			type: "RangeFilterParseError",
			fromError: type === "from" ? filterParseError : undefined,
			toError: type === "to" ? filterParseError : undefined
		};

		return { error: errorInfo };
	};

	const handleOnTypedFilter = (value: string, type: "from" | "to") => {
		const result = validateValue(value, type);
		if (result.newFilter) {
			options.eventHandlers.repeat.onFilterValueChange(
				repeatFormModelPath,
				element.id,
				result.newFilter
			);
		} else if (result.error) {
			options.eventHandlers.repeat.onFilterParseError(
				element.id,
				repeatFormModelPath,
				result.error
			);
		}
	};

	const from =
		dataType.type === "TimeType"
			? createTimeFilter({
					baseProps: fromOptions,
					timeConverter: (value: string) => {
						const parseResult = conversion.parseValue(value, config);

						return parseResult.value instanceof Date && !parseResult.parseError
							? parseResult.value
							: undefined;
					},
					onChange: (value: Date) => {
						onFromFilterSelected(value);
					},
					onValidate: (params: { value: string; valid: boolean }) => {
						const result = validateValue(params.value, "from");
						if (result.error) {
							options.eventHandlers.repeat.onFilterParseError(
								element.id,
								repeatFormModelPath,
								result.error
							);
						}
					},
					MessageList
				})
			: createDateFilter({
					dataType,
					baseProps: fromOptions,
					onFilterTyped: (value: string) => handleOnTypedFilter(value, "from"),
					onFilterSelected: onFromFilterSelected,
					MessageList
				});

	const to =
		dataType.type === "TimeType"
			? createTimeFilter({
					baseProps: toOptions,
					timeConverter: (value: string) => {
						const parseResult = conversion.parseValue(value, config);

						return parseResult.value instanceof Date && !parseResult.parseError
							? parseResult.value
							: undefined;
					},
					onChange: (value: Date) => {
						onToFilterSelected(value);
					},
					onValidate: (params: { value: string; valid: boolean }) => {
						const result = validateValue(params.value, "to");
						if (result.error) {
							options.eventHandlers.repeat.onFilterParseError(
								element.id,
								repeatFormModelPath,
								result.error
							);
						}
					},
					MessageList
				})
			: createDateFilter({
					dataType,
					baseProps: toOptions,
					onFilterTyped: (value: string) => handleOnTypedFilter(value, "to"),
					onFilterSelected: onToFilterSelected,
					MessageList
				});

	function createDateFilter(options: {
		dataType: DocumentModel.FieldType;
		baseProps: FilterBaseProps;
		onFilterTyped(value: string): void;
		onFilterSelected(value: Date): void;
		MessageList: ComponentType<ValidationMessagesProps>;
	}): ReactElement {
		const { dataType, baseProps, onFilterTyped, onFilterSelected, MessageList } = options;
		const filterCellProps: DateFilterProps = {
			...getFilterCellProps(baseProps, MessageList),
			onFilterTyped,
			onFilterSelected
		};

		if (dataType.type === "DateTimeType") {
			return <DateTimeFilter {...filterCellProps} />;
		} else if (dataType.type === "DateType") {
			return <DateFilter {...filterCellProps} dataType={dataType} />;
		} else if (dataType.type === "DateFragmentType") {
			return <DateFragmentFilter {...filterCellProps} />;
		} else if (dataType.type === "DateRangeType") {
			return <DateFilter {...filterCellProps} dataType={dataType} />;
		}

		throw new Error(
			"Expected DateType of column to be Date, DateTime, Time, DateFragment or DateRange type!"
		);
	}

	function createTimeFilter(options: {
		baseProps: FilterBaseProps;
		onChange(newValue?: Date): void;
		timeConverter(newValue: string): Date | undefined;
		onValidate(params: { value: string; valid: boolean }): void;
		MessageList: ComponentType<ValidationMessagesProps>;
	}): ReactElement {
		const { baseProps, onChange, timeConverter, onValidate, MessageList } = options;
		const filterCellProps = {
			...getFilterCellProps(baseProps, MessageList),
			onChange,
			timeConverter,
			onValidate
		};

		return <TimeFilter {...filterCellProps} />;
	}

	function getFilterCellProps(
		props: FilterBaseProps,
		MessageList: ComponentType<ValidationMessagesProps>
	): Omit<DateFilterProps, "onFilterTyped" | "onFilterSelected"> {
		const { id, renderOptions, path, label, filter, message, datePickerConfig, disabled } = props;

		const errorMessageContainer = message ? (
			<MessageList id="-error" messages={[[message.error.errorText]]} key="errors" />
		) : undefined;

		const value = {
			ui: message ? message.value : filter ? filter.ui : "",
			data: filter ? filter.data : null,
			path
		};

		return {
			id,
			value,
			renderOptions,
			label,
			datePickerConfig,
			errorMessage: errorMessageContainer,
			disabled
		};
	}

	return (
		<>
			<EmptyFilterInput
				options={options}
				element={element}
				repeatFormModelPath={repeatFormModelPath}
				filter={filter}
				onChange={() => {
					options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, element.id, {
						from: fromFilter ?? null,
						to: toFilter ?? null,
						filterNull: !filter?.filterNull
					});
				}}
			/>
			{!filter?.filterNull && (
				<>
					{from} {to}
				</>
			)}
		</>
	);
}
