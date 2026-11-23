// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { DocumentModelUtils } from "../../../../../../../models/internal/utils/document-model-utils.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";

import { inputTouched } from "../input-touched.js";
import { useBasePropsForTextInputs } from "../use-input-props.js";

import { DateUtils } from "./date-utilities.js";
import type { DateFilterProps } from "./props.js";

// TODO: Function to create base props for Date and DateFilterCell
/** @internal */
export function DateTimeInput(props: Inputs.InputProps<DocumentModel.DateTimeType>): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateTimeTextLine } = useContext(ComponentMapContext);

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const value = props.value;
	const { htmlInputProps, ...inputProps } = useBasePropsForTextInputs(props);

	const documentModel = ModelSelectors.documentModel()(options.state);

	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	const openPickerLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.open, localizer);
	const okLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.ok, localizer);
	const clearLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.clear, localizer);
	const backLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.back, localizer);
	const editTimeLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.editTime, localizer);
	const placeholderText = getLocalizedResource(RESOURCE_KEYS.datetime.placeholderTime, localizer);

	const datePickerConfig = props.modelElement.datePickerConfig;

	const initialDate = DateUtils.calculateInitialDate(datePickerConfig);

	return (
		<DateTimeTextLine
			{...inputProps}
			enableDatePicker={!options.config.disableDatePicker}
			openPickerLabel={openPickerLabel ?? ""}
			typedValue={value.data instanceof Date ? value.data : null}
			okLabel={okLabel ?? ""}
			clearLabel={clearLabel ?? ""}
			backLabel={backLabel ?? ""}
			editTimeLabel={editTimeLabel ?? ""}
			placeholderText={placeholderText ?? ""}
			yearRange={DateUtils.calculateYearRange(datePickerConfig)}
			initialDatePickerSelection={initialDate}
			timeMode={options.config.timeMode}
			timeZone={props.modelElement.timeZone}
			onTypedValueSubmit={(newValue: Date) => {
				// The date has to be converted to ISO: year-month-dayThh:mm:ss.000Z
				// VK assumes to get a date string in tht format: year-month-day, thats why the ISO String has to be cut
				props.renderConfiguration.renderOptions.eventHandlers.onValueChange(
					value.path,
					newValue,
					props.formModelPath
				);
			}}
			onValueSubmit={(newValue: string) => {
				const result = conversion.parseValue(newValue.trim(), conversionConfig);
				if (result.parseError) {
					options.eventHandlers.onParseError(value.path, newValue, result.parseError);
				} else {
					options.eventHandlers.onValueChange(value.path, result.value!, props.formModelPath);
				}
			}}
			onValueChange={() => inputTouched(options)}
			getLocalizedDateString={date =>
				date !== undefined ? (conversion.formatValue(date, conversionConfig) ?? "") : ""
			}
			inputProps={htmlInputProps}
			inputRef={(element: HTMLElement | null) => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}

/** @internal */
export function DateTimeFilter(props: DateFilterProps): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateTimeTextLine } = useContext(ComponentMapContext);

	const { value, renderOptions, label, errorMessage, datePickerConfig } = props;

	const openPickerLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.open, localizer);
	const okLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.ok, localizer);
	const clearLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.clear, localizer);
	const backLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.back, localizer);
	const editTimeLabel = getLocalizedResource(RESOURCE_KEYS.datetime.button.editTime, localizer);
	const placeholderText = getLocalizedResource(RESOURCE_KEYS.datetime.placeholderTime, localizer);

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);
	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	const timeZone = documentModel.content.modelConfig.timeZone;
	const initialDate = DateUtils.calculateInitialDate(datePickerConfig);

	return (
		<DateTimeTextLine
			id={props.id}
			label={label}
			disabled={props.disabled}
			enableDatePicker={!renderOptions.config.disableDatePicker}
			openPickerLabel={openPickerLabel ?? ""}
			typedValue={value.data instanceof Date ? value.data : null}
			okLabel={okLabel ?? ""}
			clearLabel={clearLabel ?? ""}
			backLabel={backLabel ?? ""}
			editTimeLabel={editTimeLabel ?? ""}
			placeholderText={placeholderText ?? ""}
			initialDatePickerSelection={initialDate}
			yearRange={DateUtils.calculateYearRange(datePickerConfig)}
			timeMode={renderOptions.config.timeMode}
			timeZone={timeZone}
			onTypedValueSubmit={props.onFilterSelected}
			onValueSubmit={props.onFilterTyped}
			getLocalizedDateString={date =>
				date !== undefined ? (conversion.formatValue(date, conversionConfig) ?? "") : ""
			}
			value={value.ui}
			errorMessage={errorMessage}
		/>
	);
}
