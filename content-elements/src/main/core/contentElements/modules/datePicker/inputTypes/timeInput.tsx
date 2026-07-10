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

import type { JSX } from "react";
import { useContext, useRef } from "react";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { FormElementContext } from "../../../../configuration/formElementContext.js";
import { createResourceLocalizable } from "../../../../localization/createResourceLocalizable.js";
import { RESOURCE_KEYS } from "../../../../localization/resources.js";
import type { BaseControlProps } from "../../../../types/controlProps.js";
import { WidgetMapContext } from "../../../../widgetMap/widgetMap-context.js";
import { createParseError } from "../../../createParseError.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../elementConfiguration/useCommonWidgetSettings.js";
import { useFocus } from "../../../focus.js";
import { nmTokensToString } from "../../../nmtokens.js";

/**
 * @internal
 */
export function TimeInput(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { DateTimePickerHeader, TimePicker } = useContext(WidgetMapContext);
	const { onValueChanged, onParsingFailed } = useDocumentContext(c => c.event);
	const { timeMode, disableDatePicker } = useContext(FormElementContext).config;
	const inputRef = useRef<HTMLInputElement>(null);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const {
		uiId,
		placeholder,
		timeZone,
		dataReference,
		conversionConfig,
		notRelevant,
		ungroupedValidationMessages
	} = commonControlSettings;

	useFocus({
		uiId,
		dataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

	const {
		value,
		formattedValue,
		label,
		hideLabel,
		helperText,
		readonly,
		error,
		warning,
		info,
		errors,
		warnings,
		infos,
		tooltips,
		tooltipsOnTop,
		inputProps,
		ariaDescribedBy
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	if (notRelevant) {
		return null;
	}

	/**
	 * FIXME: The open label is currently not used in the Form Engine and
	 * therefore the picker button title is not localized. It cannot be set as
	 * a widget property, but only through the A11YLanguageContext. Should it
	 * stay like this or should the widget provide a property similar to
	 * okLabel?
	 * The widget doesn't even use the l10n api, but simply picks a string from
	 * a localization tree, because it does not depend on any other A12 packages.
	 */
	// const openLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.time.picker.open));
	const okLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.time.button.ok));
	const clearLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.time.button.clear));
	const pickerHeaderPlaceholder = localizer(
		createResourceLocalizable(RESOURCE_KEYS.time.placeholderTime)
	);

	const handleValueChange = (value?: Date) => {
		onValueChanged({ path: dataReference, value: value ?? null });
	};

	const documentPath = DocumentPath.fromString(dataReference);

	return (
		<TimePicker
			id={uiId}
			label={label}
			hideLabel={hideLabel}
			value={value instanceof Date ? value : undefined}
			readonly={readonly}
			placeholder={placeholder}
			helperText={helperText}
			addonAfter={tooltipsOnTop ? undefined : tooltips}
			tooltips={tooltipsOnTop ? tooltips : undefined}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			hidePickerButton={disableDatePicker || readonly}
			okLabel={okLabel ?? ""}
			clearLabel={clearLabel ?? ""}
			mode={timeMode}
			timezone={timeZone}
			onChange={handleValueChange}
			timeFormatter={time =>
				time && conversionConfig
					? (conversion.formatValue(time, conversionConfig) ?? "")
					: (formattedValue ?? "")
			}
			timeConverter={newValue => {
				const result = conversionConfig
					? conversion.parseValue(newValue.trim(), conversionConfig)
					: undefined;

				return result?.value instanceof Date && !result.parseError ? result.value : undefined;
			}}
			onValidate={params => {
				const result = conversionConfig
					? conversion.parseValue(params.value.trim(), conversionConfig)
					: undefined;

				if (result?.parseError) {
					onParsingFailed({
						dataReference,
						parseError: createParseError(result.parseError, documentPath, params.value)
					});
				}
			}}
			// onInputChange={() => inputTouched(options)}
			inputProps={inputProps}
			timePickerInputRef={(ref: HTMLInputElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy.length ? nmTokensToString(ariaDescribedBy) : undefined}
			focusOnInputAfterPicking={true}
			customHeaderElement={time => (
				<DateTimePickerHeader>
					<strong>
						{time && conversionConfig
							? conversion.formatValue(time, conversionConfig)
							: pickerHeaderPlaceholder}
					</strong>
				</DateTimePickerHeader>
			)}
		/>
	);
}
