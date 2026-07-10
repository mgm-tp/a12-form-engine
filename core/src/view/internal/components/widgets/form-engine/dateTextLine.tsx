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

import { useContext, useRef, useState } from "react";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import type { DateTextLineProps } from "./date-props.js";
import { DatePrefixButton } from "./datePrefixButton.js";

/**
 * DateTextLine component that renders a text input with an optional date picker.
 * Provides both text input and visual date picker functionality for date selection.
 *
 * @internal
 */
export function DateTextLine(props: DateTextLineProps) {
	const { Button, DatePicker, DatePickerDialog } = useContext(WidgetMapContext);
	const { BufferedTextLine, PickerWrapper } = useContext(ComponentMapContext);
	const {
		addonAfter,
		ariaDescribedby,
		disabled,
		enableDatePicker,
		error,
		errorMessage,
		getLocalizedDateString,
		helperText,
		hideLabel,
		id,
		info,
		infoMessage,
		initialDatePickerSelection,
		inputProps,
		inputRef,
		initialValue,
		label,
		okLabel,
		onTypedValueSubmit,
		onValueChange,
		onValueSubmit,
		openPickerLabel,
		placeholder,
		readonly,
		suffixes,
		timeZone,
		tooltips,
		typedValue,
		value,
		warning,
		warningMessage,
		yearRange
	} = props;

	const pickerButtonRef = useRef<HTMLElement | null>(null);

	const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
	const [showPicker, setShowPicker] = useState(false);

	const initialDatePickerValue =
		typedValue && typedValue instanceof Date ? typedValue : initialDatePickerSelection;
	const isPrefixButtonShown = enableDatePicker && !readonly && !disabled;
	const isMobileDevice = DeviceDetector.get() === "phone";
	const isDatePickerShown = (
		pickerButtonRefCurrent: HTMLElement | null
	): pickerButtonRefCurrent is HTMLElement =>
		!!enableDatePicker && showPicker && pickerButtonRefCurrent !== null;

	const handleValueSubmit = (value?: string) => {
		setShowPicker(false);
		onValueSubmit(value?.trim());
	};

	const handleOpenDatePicker = (): void => {
		if (isMobileDevice) {
			setTempDate(initialDatePickerValue);
		}
		setShowPicker(true);
	};

	const handleClosePicker = (): void => {
		setShowPicker(false);
	};

	const handleDatePickerChangeMobile = (date: Date) => {
		setTempDate(date);
	};

	const handleDatePickerChangeWithFocus = (date: Date) => {
		setShowPicker(false);
		onTypedValueSubmit(date);

		const domNode = document.getElementById(id);
		domNode?.focus();
	};

	const handleConfirmDateSelection = () => {
		setShowPicker(false);
		if (tempDate) {
			onTypedValueSubmit(tempDate);
		}
	};

	const handleSetNewButtonRef = (buttonRef: HTMLButtonElement | null) => {
		pickerButtonRef.current = buttonRef;
	};

	return (
		<>
			<BufferedTextLine
				id={id}
				value={value}
				label={label}
				addonAfter={addonAfter}
				ariaDescribedby={ariaDescribedby}
				disabled={disabled}
				inputRef={inputRef}
				error={error}
				errorMessage={errorMessage}
				helperText={helperText}
				readonly={readonly}
				warning={warning}
				warningMessage={warningMessage}
				tooltips={tooltips}
				hideLabel={hideLabel}
				placeholder={placeholder}
				suffixes={suffixes}
				inputProps={inputProps}
				info={info}
				infoMessage={infoMessage}
				initialValue={initialValue}
				onValueChange={onValueChange}
				onValueSubmit={handleValueSubmit}
				prefixes={
					isPrefixButtonShown ? (
						<DatePrefixButton
							id={id}
							handleButtonClick={handleOpenDatePicker}
							label={openPickerLabel}
							handleButtonRef={handleSetNewButtonRef}
						/>
					) : null
				}
			/>
			{isDatePickerShown(pickerButtonRef.current) ? (
				isMobileDevice ? (
					<DatePickerDialog
						value={tempDate}
						yearRange={yearRange}
						timezone={timeZone}
						title={getLocalizedDateString(tempDate)}
						onClose={handleClosePicker}
						onChange={handleDatePickerChangeMobile}
						submitButton={
							okLabel ? (
								<Button
									id={id + "-submit-button"}
									primary
									label={okLabel}
									disabled={!tempDate}
									onClick={handleConfirmDateSelection}
								/>
							) : undefined
						}
					/>
				) : (
					<PickerWrapper referenceElement={pickerButtonRef.current} onClose={handleClosePicker}>
						<DatePicker
							value={initialDatePickerValue}
							yearRange={yearRange}
							timezone={timeZone}
							onChange={handleDatePickerChangeWithFocus}
						/>
					</PickerWrapper>
				)
			) : null}
		</>
	);
}
