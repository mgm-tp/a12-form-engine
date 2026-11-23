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
import { FormModel } from "../../../../../../../models/internal/form-model.js";
import { DocumentModelUtils } from "../../../../../../../models/internal/utils/document-model-utils.js";
import type { FormModelMap, Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import type { Value } from "../../../../../utilities/value.js";

import { inputTouched } from "../input-touched.js";
import { useBasePropsForTextInputs } from "../use-input-props.js";

/** @internal */
export function TimeInput(props: Inputs.InputProps<DocumentModel.TimeType>): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const widgetMap = useContext(WidgetMapContext);

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const value = props.value.data;
	const documentPath = props.value.path;
	const { htmlInputProps, ...inputProps } = useBasePropsForTextInputs(props);

	const okLabel = getLocalizedResource(RESOURCE_KEYS.time.button.ok, localizer);
	const clearLabel = getLocalizedResource(RESOURCE_KEYS.time.button.clear, localizer);
	const placeholderText = getLocalizedResource(RESOURCE_KEYS.time.placeholderTime, localizer);

	const classes = FormModel.styleToClassName(props.modelElement.style);

	const documentModel = ModelSelectors.documentModel()(options.state);
	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, documentPath);

	return (
		<widgetMap.TimePicker
			{...inputProps}
			value={value instanceof Date ? value : undefined}
			hidePickerButton={
				options.config.disableDatePicker || inputProps.readonly || inputProps.disabled
			}
			okLabel={okLabel ?? ""}
			clearLabel={clearLabel ?? ""}
			mode={options.config.timeMode}
			timezone={props.modelElement.timeZone}
			onChange={newValue => {
				options.eventHandlers.onValueChange(documentPath, newValue ?? null, props.formModelPath);
			}}
			timeFormatter={time =>
				time !== undefined ? (conversion.formatValue(time, conversionConfig) ?? "") : props.value.ui
			}
			timeConverter={newValue => {
				const result = conversion.parseValue(newValue.trim(), conversionConfig);

				return result.value instanceof Date && !result.parseError ? result.value : undefined;
			}}
			onValidate={params => {
				const result = conversion.parseValue(params.value.trim(), conversionConfig);

				if (result.parseError) {
					options.eventHandlers.onParseError(documentPath, params.value, result.parseError);
				}
			}}
			onInputChange={() => inputTouched(options)}
			inputProps={htmlInputProps}
			focusOnInputAfterPicking={true}
			customHeaderElement={time => (
				<widgetMap.Header>
					<strong>{time ? conversion.formatValue(time, conversionConfig) : placeholderText}</strong>
				</widgetMap.Header>
			)}
			timeInputWrapperProps={classes ? { className: classes } : undefined}
			timePickerInputRef={element => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}

/** @internal */
export function TimeFilter(props: {
	id: string;
	value: Value;
	renderOptions: FormModelMap.RenderOptions;
	label: string;
	timeConverter(value: string): Date | undefined;
	onChange(value: Date): void;
	onValidate(params: { value: string; valid: boolean }): void;
	errorMessage?: ReactElement;
	disabled: boolean;
}): ReactElement {
	const { value, renderOptions, label, errorMessage } = props;

	const { localizer, conversion } = useContext(LocalizerContext);
	const widgetMap = useContext(WidgetMapContext);

	const typedValue = value.data;
	const documentPath = value.path;

	const okLabel = getLocalizedResource(RESOURCE_KEYS.time.button.ok, localizer);
	const clearLabel = getLocalizedResource(RESOURCE_KEYS.time.button.clear, localizer);
	const placeholderText = getLocalizedResource(RESOURCE_KEYS.time.placeholderTime, localizer);

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);
	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, documentPath);

	const timeZone = documentModel.content.modelConfig.timeZone;

	return (
		<widgetMap.TimePicker
			id={props.id}
			label={label}
			disabled={props.disabled}
			hidePickerButton={renderOptions.config.disableDatePicker}
			value={typedValue instanceof Date ? typedValue : undefined}
			okLabel={okLabel ?? ""}
			clearLabel={clearLabel ?? ""}
			mode={renderOptions.config.timeMode}
			timezone={timeZone}
			onChange={props.onChange}
			errorMessage={errorMessage}
			timeFormatter={time =>
				time !== undefined ? (conversion.formatValue(time, conversionConfig) ?? "") : props.value.ui
			}
			timeConverter={props.timeConverter}
			onValidate={props.onValidate}
			focusOnInputAfterPicking={true}
			customHeaderElement={time => (
				<widgetMap.Header>
					<strong>{time ? conversion.formatValue(time, conversionConfig) : placeholderText}</strong>
				</widgetMap.Header>
			)}
		/>
	);
}
