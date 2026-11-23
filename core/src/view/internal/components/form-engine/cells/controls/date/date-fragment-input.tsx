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

/** @internal */
export function DateFragmentFilter(props: DateFilterProps): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateTextLine } = useContext(ComponentMapContext);

	const { value, renderOptions, label, errorMessage, datePickerConfig } = props;
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
			openPickerLabel={openPickerLabel ?? ""}
			okLabel={okLabel ?? ""}
			typedValue={value.data instanceof Date || typeof value.data === "string" ? value.data : null}
			initialDatePickerSelection={DateUtils.calculateInitialDate(datePickerConfig)}
			timeZone={timeZone}
			yearRange={DateUtils.calculateYearRange(datePickerConfig)}
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
export function DateFragmentInput(
	props: Inputs.InputProps<DocumentModel.DateFragmentType>
): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateTextLine } = useContext(ComponentMapContext);

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const documentModel = ModelSelectors.documentModel()(options.state);
	const value = props.value;

	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	const { htmlInputProps, ...inputProps } = useBasePropsForTextInputs(props);

	const openPickerLabel = getLocalizedResource(RESOURCE_KEYS.date.button.open, localizer);
	const okLabel = getLocalizedResource(RESOURCE_KEYS.date.button.ok, localizer);

	const datePickerConfig = props.modelElement.datePickerConfig;

	return (
		<DateTextLine
			{...inputProps}
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
					options.eventHandlers.onParseError(value.path, newValue, result.parseError);
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
