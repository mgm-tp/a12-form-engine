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

import type { ReactNode } from "react";
import { useContext, useRef, useState } from "react";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data/lib/core/api/path/documentPath.js";
import {
	useDocumentContext,
	type ContentModel,
	type NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";
import type { DatePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.api.js";
import type { YearRange } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/year-month-selector/year-selector.api.js";

import { FormElementContext } from "../../../../configuration/formElementContext.js";
import { createResourceLocalizable } from "../../../../localization/createResourceLocalizable.js";
import { RESOURCE_KEYS } from "../../../../localization/resources.js";
import type { BaseControlProps, DatePickerConfig } from "../../../../types/controlProps.js";
import { WidgetMapContext } from "../../../../widgetMap/widgetMap-context.js";
import { ComponentMapContext } from "../../../componentMap/componentMapContext.js";
import { createParseError } from "../../../createParseError.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../elementConfiguration/useCommonWidgetSettings.js";
import { useFocus } from "../../../focus.js";
import { nmTokensToString } from "../../../nmtokens.js";

/**
 * @internal
 */
export function DateInput(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): ReactNode {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { BufferedTextLine, PickerWrapper } = useContext(ComponentMapContext);
	const { Button, DatePicker, DatePickerDialog, Icon } = useContext(WidgetMapContext);
	const { onValueChanged, onParsingFailed } = useDocumentContext(c => c.event);
	const { disableDatePicker } = useContext(FormElementContext).config;

	const [showPicker, setShowPicker] = useState(false);
	const [pickerValue, setPickerValue] = useState<Date | undefined>(undefined);
	const pickerButtonRef = useRef<HTMLElement | undefined>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const {
		uiId,
		placeholder,
		timeZone,
		datePickerConfig,
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

	const openLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.date.button.open));
	const okLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.date.button.ok));

	const documentPath = DocumentPath.fromString(dataReference);

	const handleValueChange = (value?: string) => {
		const conversionResult =
			value !== undefined && conversionConfig
				? conversion.parseValue(value.trim(), conversionConfig)
				: undefined;

		if (conversionResult?.parseError) {
			onParsingFailed({
				dataReference,
				// value must be defined when a conversion error exists
				parseError: createParseError(conversionResult.parseError, documentPath, value!)
			});
		} else {
			const parsedValue = conversionResult ? conversionResult.value : value;

			onValueChanged({ path: dataReference, value: parsedValue, userValue: value });
		}
	};

	const handleTypedValueChange = (value: Date) => {
		onValueChanged({ path: dataReference, value: value ?? null });
	};

	const getLocalizedDateString = (value?: Date) =>
		value && conversionConfig ? (conversion.formatValue(value, conversionConfig) ?? "") : "";

	const pickerProps: DatePickerProps = {
		yearRange: calculateYearRange(datePickerConfig), // TODO: already pre-compute in useCommonWidgetSettings?
		value: pickerValue,
		timezone: timeZone
	};

	const shouldShowPicker =
		!disableDatePicker && showPicker && pickerButtonRef.current !== undefined;
	const isMobile = DeviceDetector.get() === "phone";

	const pickerButton =
		!disableDatePicker && readonly !== true ? (
			<Button
				icon={<Icon>event</Icon>}
				title={openLabel}
				onClick={() => {
					setShowPicker(true);
					if (value instanceof Date) {
						setPickerValue(value);
					} else {
						setPickerValue(calculateInitialDate(datePickerConfig));
					}
				}}
				buttonRef={ref => {
					pickerButtonRef.current = ref || undefined;
				}}
				key={uiId + "-picker"}
				id={uiId + "-picker"}
			/>
		) : null;

	return [
		<BufferedTextLine
			key="input"
			id={uiId}
			label={label}
			readonly={readonly}
			hideLabel={hideLabel}
			addonAfter={tooltipsOnTop ? undefined : tooltips}
			tooltips={tooltipsOnTop ? tooltips : undefined}
			helperText={helperText}
			placeholder={placeholder}
			value={formattedValue}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			inputProps={inputProps}
			inputRef={(ref: HTMLInputElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy.length ? nmTokensToString(ariaDescribedBy) : undefined}
			onValueSubmit={value => {
				setShowPicker(false);
				handleValueChange(value);
			}}
			prefixes={pickerButton}
		/>,
		shouldShowPicker ? (
			isMobile ? (
				<DatePickerDialog
					{...pickerProps}
					title={getLocalizedDateString(pickerValue)}
					onClose={() => {
						setShowPicker(false);
					}}
					submitButton={
						okLabel ? (
							<Button
								id={uiId + "-submit-button"}
								primary
								label={okLabel}
								disabled={!pickerValue}
								onClick={() => {
									setShowPicker(false);
									if (pickerValue) {
										handleTypedValueChange(pickerValue);
									}
								}}
							/>
						) : undefined
					}
					onChange={date => {
						setPickerValue(date);
					}}
				/>
			) : (
				<PickerWrapper
					key="picker"
					referenceElement={pickerButtonRef.current!}
					onClose={() => {
						setShowPicker(false);
					}}
				>
					<DatePicker
						{...pickerProps}
						onChange={date => {
							setShowPicker(false);
							handleTypedValueChange(date);
							focusInput(uiId);
						}}
					/>
				</PickerWrapper>
			)
		) : undefined
	];
}

function focusInput(id: string): void {
	const domNode = document.getElementById(id);
	domNode?.focus();
}

function calculateYearRange(datePickerConfig: DatePickerConfig | undefined): YearRange | undefined {
	if (datePickerConfig === undefined) {
		return undefined;
	}
	const { minYear, maxYear, absolute } = datePickerConfig;
	if (minYear === undefined || maxYear === undefined) {
		return undefined;
	}
	if (absolute) {
		return { start: minYear, end: maxYear };
	} else {
		const currentYear = new Date().getFullYear();
		return { start: currentYear + minYear, end: currentYear + maxYear };
	}
}

function calculateInitialDate(datePickerConfig?: DatePickerConfig): Date {
	const initialDate = new Date();
	const { absolute, preselectionYear } = datePickerConfig ?? {};

	initialDate.setFullYear(
		absolute
			? preselectionYear || initialDate.getFullYear()
			: initialDate.getFullYear() + (preselectionYear ?? 0)
	);

	return initialDate;
}
