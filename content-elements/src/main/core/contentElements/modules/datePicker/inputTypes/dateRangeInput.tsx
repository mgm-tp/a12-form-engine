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

import type { ReactNode } from "react";
import { useContext, useRef, useState } from "react";

import { DocumentPath, isDateRangeArray } from "@com.mgmtp.a12.client/client-data";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DatePickerProps, DateRange } from "@com.mgmtp.a12.widgets/widgets-core";

import { FormElementContext } from "../../../../configuration/formElementContext.js";
import { createResourceLocalizable } from "../../../../localization/createResourceLocalizable.js";
import { RESOURCE_KEYS } from "../../../../localization/resources.js";
import type { BaseControlProps } from "../../../../types/controlProps.js";
import { WidgetMapContext } from "../../../../widgetMap/widgetMap-context.js";
import { ComponentMapContext } from "../../../componentMap/componentMapContext.js";
import { createParseError } from "../../../createParseError.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../elementConfiguration/useCommonWidgetSettings.js";
import { useFocus } from "../../../focus.js";
import { nmTokensToString } from "../../../nmtokens.js";

import { DateUtils } from "./dateUtils.js";

/**
 * @internal
 */
export function DateRangeInput(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): ReactNode {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { BufferedTextLine, PickerWrapper } = useContext(ComponentMapContext);
	const { Button, DatePicker, DatePickerDialog, Icon } = useContext(WidgetMapContext);
	const { onValueChanged, onParsingFailed } = useDocumentContext(c => c.event);
	const { disableDatePicker } = useContext(FormElementContext).config;

	const [showPicker, setShowPicker] = useState(false);
	const [pickerValue, setPickerValue] = useState<DateRange | undefined>(undefined);
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
		dmElement,
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

	const openLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.daterange.button.open));
	const okLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.daterange.button.ok));
	const clearLabel = localizer(createResourceLocalizable(RESOURCE_KEYS.daterange.button.clear));

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

	const handleTypedValueChange = (dateRange?: DateRange) => {
		const newValue = dateRange?.from && dateRange.to ? [dateRange.from, dateRange.to] : null;
		onValueChanged({ path: dataReference, value: newValue });
	};

	const getLocalizedDateString = (dateRange?: DateRange) =>
		dateRange?.from !== undefined &&
		dateRange.from !== null &&
		dateRange.to !== undefined &&
		dateRange.to !== null &&
		conversionConfig
			? (conversion.formatValue([dateRange.from, dateRange.to], conversionConfig) ?? "")
			: "";

	const pickerProps: DatePickerProps = {
		selected: [
			...(pickerValue?.from ? [pickerValue.from] : []),
			{ from: pickerValue?.from, to: pickerValue?.to }
		],
		yearRange: DateUtils.calculateYearRange(datePickerConfig), // TODO: already pre-compute in useCommonWidgetSettings?
		timezone: timeZone
	};

	const shouldShowPicker = showPicker && pickerButtonRef.current !== undefined;
	const isMobile = DeviceDetector.get() === "phone";

	const pickerButton =
		!disableDatePicker && isFullDateRange(dmElement) && readonly !== true ? (
			<Button
				icon={<Icon>event</Icon>}
				title={openLabel}
				onClick={() => {
					setShowPicker(true);
					if (isDateRangeArray(value)) {
						setPickerValue({ from: value[0], to: value[1] });
					} else {
						setPickerValue(DateUtils.calculateInitialDateRange(datePickerConfig));
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
		!disableDatePicker && shouldShowPicker ? (
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
					clearButton={
						clearLabel ? (
							<Button
								id={uiId + "-clear-button"}
								destructive
								label={clearLabel}
								disabled={!pickerValue}
								onClick={() => {
									if (pickerValue) {
										setPickerValue(undefined);
									}
								}}
							/>
						) : undefined
					}
					onDateRangeChange={dateRange => {
						setPickerValue(dateRange);
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
						onDateRangeChange={dateRange => {
							setPickerValue(dateRange);
						}}
						footer={{
							acceptLabel: okLabel,
							onAccept: (dateRange?: DateRange) => {
								handleTypedValueChange(dateRange);
								setShowPicker(false);
								focusInput(uiId);
							},
							clearLabel,
							onClear: () => {
								setPickerValue(undefined);
							}
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

function isFullDateRange(dmElement: DocumentModel.Element) {
	return dmElement.type === "Field" && dmElement.fieldType.type === "DateRangeType"
		? dmElement.fieldType.format === "yyyy-MM-dd"
		: false;
}
