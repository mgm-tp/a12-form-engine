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

import type { ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import * as DocumentModelUtils from "../../../../../../../models/internal/utils/document-model-utils.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";

import { inputTouched } from "../input-touched.js";
import { useBasePropsForTextInputs } from "../use-input-props.js";

import { DateUtils } from "./date-utilities.js";
import type { DateFilterProps } from "./props.js";

/** @internal */
export function DateRangeFilter(props: DateFilterProps<DateRange>): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateRangeTextLine } = useContext(ComponentMapContext);

	const {
		id,
		disabled,
		value,
		renderOptions,
		label,
		errorMessage,
		datePickerConfig,
		dataType,
		onFilterSelected,
		onFilterTyped
	} = props;

	const typedValue = value.data;
	const dateRange: DateRange = DateUtils.isDateRangeArray(typedValue)
		? { from: typedValue[0], to: typedValue[1] }
		: { from: undefined, to: undefined };

	const openPickerLabel = getLocalizedResource(RESOURCE_KEYS.daterange.button.open, localizer);
	const okLabel = getLocalizedResource(RESOURCE_KEYS.daterange.button.ok, localizer);
	const clearLabel = getLocalizedResource(RESOURCE_KEYS.daterange.button.clear, localizer);

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);

	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);
	const timeZone = documentModel.content.modelConfig.timeZone;

	return (
		<DateRangeTextLine
			id={id}
			label={label}
			disabled={disabled}
			enableDatePicker={
				!renderOptions.config.disableDatePicker && dataType?.format === "yyyy-MM-dd"
			}
			openPickerLabel={openPickerLabel ?? ""}
			okLabel={okLabel ?? ""}
			clearLabel={clearLabel ?? ""}
			typedValue={dateRange}
			initialDatePickerSelection={DateUtils.calculateInitialDateRange(datePickerConfig)}
			yearRange={DateUtils.calculateYearRange(datePickerConfig)}
			timeZone={timeZone}
			getLocalizedDateString={date =>
				date !== undefined
					? // FIXME: how can we handle the undefined case properly?
						(conversion.formatValue([date.from!, date.to!], conversionConfig) ?? "")
					: ""
			}
			onTypedValueSubmit={onFilterSelected}
			onValueSubmit={onFilterTyped}
			value={value.ui}
			errorMessage={errorMessage}
		/>
	);
}

/** @internal */
export function DateRangeInput(
	props: Inputs.InputProps<DocumentModel.DateRangeType>
): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateRangeTextLine } = useContext(ComponentMapContext);

	const options = props.renderConfiguration.renderOptions;
	const { inputRef } = props;

	const value = props.value;
	const typedValue = value.data;
	const dateRange: DateRange = DateUtils.isDateRangeArray(typedValue)
		? { from: typedValue[0], to: typedValue[1] }
		: { from: undefined, to: undefined };
	const { htmlInputProps, ...inputProps } = useBasePropsForTextInputs(props);

	const openPickerLabel = getLocalizedResource(RESOURCE_KEYS.daterange.button.open, localizer);
	const okLabel = getLocalizedResource(RESOURCE_KEYS.daterange.button.ok, localizer);
	const clearLabel = getLocalizedResource(RESOURCE_KEYS.daterange.button.clear, localizer);

	const datePickerConfig = props.modelElement.datePickerConfig;

	const documentModel = ModelSelectors.documentModel()(options.state);

	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	return (
		<DateRangeTextLine
			{...inputProps}
			enableDatePicker={
				!options.config.disableDatePicker && props.documentElementDataType.format === "yyyy-MM-dd"
			}
			openPickerLabel={openPickerLabel ?? ""}
			typedValue={dateRange}
			yearRange={DateUtils.calculateYearRange(datePickerConfig)}
			initialDatePickerSelection={DateUtils.calculateInitialDateRange(datePickerConfig)}
			timeZone={props.modelElement.timeZone}
			getLocalizedDateString={dateRange =>
				dateRange?.from !== undefined &&
				dateRange.from !== null &&
				dateRange.to !== undefined &&
				dateRange.to !== null
					? (conversion.formatValue([dateRange.from, dateRange.to], conversionConfig) ?? "")
					: ""
			}
			onTypedValueSubmit={(dateRange: DateRange) => {
				const newValue = dateRange.from && dateRange.to ? [dateRange.from, dateRange.to] : null;
				options.eventHandlers.onValueChange(value.path, newValue, props.formModelPath);
			}}
			okLabel={okLabel ?? ""}
			clearLabel={clearLabel ?? ""}
			onValueSubmit={(dateRange: string) => {
				const result = conversion.parseValue(dateRange.trim(), conversionConfig);
				if (result.parseError) {
					options.eventHandlers.onParseError(
						value.path,
						dateRange,
						result.parseError,
						props.formModelPath
					);
				} else {
					options.eventHandlers.onValueChange(value.path, result.value!, props.formModelPath);
				}
			}}
			onValueChange={() => inputTouched(options)}
			inputProps={htmlInputProps}
			inputRef={(element: HTMLElement | null) => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}
