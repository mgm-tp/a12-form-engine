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
export function DateFilter(props: DateFilterProps): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateTextLine } = useContext(ComponentMapContext);

	const { value, renderOptions, label, errorMessage, datePickerConfig, dataType } = props;

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);

	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	const openPickerLabel = getLocalizedResource(RESOURCE_KEYS.date.button.open, localizer);
	const okLabel = getLocalizedResource(RESOURCE_KEYS.date.button.ok, localizer);

	const timeZone = documentModel.content.modelConfig.timeZone;

	return (
		<DateTextLine
			id={props.id}
			label={label}
			disabled={props.disabled}
			enableDatePicker={
				!renderOptions.config.disableDatePicker &&
				(dataType?.type === "DateType" || dataType?.format === "yyyy-MM-dd")
			}
			openPickerLabel={openPickerLabel ?? ""}
			okLabel={okLabel ?? ""}
			typedValue={value.data instanceof Date || typeof value.data === "string" ? value.data : null}
			initialDatePickerSelection={DateUtils.calculateInitialDate(datePickerConfig)}
			yearRange={DateUtils.calculateYearRange(datePickerConfig)}
			timeZone={timeZone}
			getLocalizedDateString={date =>
				date !== undefined ? (conversion.formatValue(date, conversionConfig) ?? "") : ""
			}
			onTypedValueSubmit={props.onFilterSelected}
			onValueSubmit={props.onFilterTyped}
			value={value.ui}
			errorMessage={errorMessage}
		/>
	);
}

// TODO: Function to create base props for Date and DateFilterCell
/** @internal */
export function DateInput(props: Inputs.InputProps<DocumentModel.DateType>): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateTextLine } = useContext(ComponentMapContext);
	const options = props.renderConfiguration.renderOptions;

	const value = props.value;
	const { inputRef } = props;
	const { htmlInputProps, ...inputProps } = useBasePropsForTextInputs(props);

	const documentModel = ModelSelectors.documentModel()(options.state);

	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	const openPickerLabel = getLocalizedResource(RESOURCE_KEYS.date.button.open, localizer);
	const okLabel = getLocalizedResource(RESOURCE_KEYS.date.button.ok, localizer);

	const datePickerConfig = props.modelElement.datePickerConfig;

	return (
		<DateTextLine
			{...inputProps}
			enableDatePicker={!options.config.disableDatePicker}
			openPickerLabel={openPickerLabel ?? ""}
			typedValue={value.data instanceof Date || typeof value.data === "string" ? value.data : null}
			yearRange={DateUtils.calculateYearRange(datePickerConfig)}
			initialDatePickerSelection={DateUtils.calculateInitialDate(datePickerConfig)}
			timeZone={props.modelElement.timeZone}
			getLocalizedDateString={date =>
				date !== undefined ? (conversion.formatValue(date, conversionConfig) ?? "") : ""
			}
			onTypedValueSubmit={(newValue: Date) => {
				options.eventHandlers.onValueChange(value.path, newValue, props.formModelPath);
			}}
			okLabel={okLabel ?? ""}
			onValueSubmit={(newValue: string) => {
				const result = conversion.parseValue(newValue.trim(), conversionConfig);
				if (result.parseError) {
					options.eventHandlers.onParseError(
						value.path,
						newValue,
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
