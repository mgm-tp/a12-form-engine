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
import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core";

import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import type { DateRangeTextLineProps } from "./date-props.js";
import { DatePrefixButton } from "./datePrefixButton.js";

/** @internal */
export function DateRangeTextLine(props: DateRangeTextLineProps) {
	const { Button, DatePicker, DatePickerDialog } = useContext(WidgetMapContext);
	const { BufferedTextLine, PickerWrapper } = useContext(ComponentMapContext);
	const {
		addonAfter,
		ariaDescribedby,
		clearLabel,
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
		openPickerLabel,
		onTypedValueSubmit,
		onValueChange,
		onValueSubmit,
		placeholder,
		readonly,
		suffixes,
		timeZone,
		tooltips,
		value,
		warning,
		warningMessage,
		yearRange,
		typedValue
	} = props;

	const [tempDateRange, setTempDateRange] = useState<DateRange>({ from: undefined, to: undefined });
	const [showPicker, setShowPicker] = useState(false);
	const pickerButtonRef = useRef<HTMLButtonElement | null>(null);

	const isDatePickerShown = enableDatePicker && showPicker && !!pickerButtonRef.current;
	const isPrefixButtonShown = enableDatePicker && !readonly && !disabled;
	const isPhone = DeviceDetector.get() === "phone";

	const handleValueSubmit = (value?: string) => {
		setShowPicker(false);
		onValueSubmit(value?.trim());
	};

	const handleOpenDatePicker = (): void => {
		const initialDateRange =
			typedValue.from && typedValue.to ? typedValue : initialDatePickerSelection;
		setTempDateRange(initialDateRange ?? { from: undefined, to: undefined });
		setShowPicker(true);
	};

	const handleConfirmDateRange = () => {
		onTypedValueSubmit(tempDateRange);
		setShowPicker(false);

		if (!isPhone) {
			focusInput();
		}
	};

	const handleClearDateRange = () => {
		setTempDateRange({ from: undefined, to: undefined });
	};

	const handleDateRangeChange = (dateRange: DateRange) => {
		setTempDateRange(dateRange);
	};

	const focusInput = (): void => {
		const domNode = document.getElementById(id);
		domNode?.focus();
	};

	const handleClosePicker = (): void => {
		setShowPicker(false);
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

			{isDatePickerShown && !!pickerButtonRef.current ? (
				isPhone ? (
					<DatePickerDialog
						timezone={timeZone}
						yearRange={yearRange}
						title={getLocalizedDateString(tempDateRange)}
						onClose={handleClosePicker}
						onDateRangeChange={handleDateRangeChange}
						submitButton={
							okLabel ? (
								<Button
									id={id + "-submit-button"}
									primary
									label={okLabel}
									disabled={
										(!tempDateRange?.from && !!tempDateRange?.to) ||
										(!!tempDateRange?.from && !tempDateRange?.to)
									}
									onClick={handleConfirmDateRange}
								/>
							) : undefined
						}
						clearButton={
							clearLabel ? (
								<Button
									id={id + "-clear-button"}
									destructive
									label={clearLabel}
									onClick={handleClearDateRange}
								/>
							) : undefined
						}
						selected={[
							...(tempDateRange?.from ? [tempDateRange.from] : []),
							{ from: tempDateRange?.from, to: tempDateRange?.to }
						]}
					/>
				) : (
					<PickerWrapper referenceElement={pickerButtonRef.current} onClose={handleClosePicker}>
						<DatePicker
							timezone={timeZone}
							yearRange={yearRange}
							selected={[
								...(tempDateRange?.from ? [tempDateRange.from] : []),
								{ from: tempDateRange?.from, to: tempDateRange?.to }
							]}
							onDateRangeChange={handleDateRangeChange}
							footer={{
								acceptLabel: okLabel,
								onAccept: handleConfirmDateRange,
								clearLabel,
								onClear: handleClearDateRange
							}}
						/>
					</PickerWrapper>
				)
			) : null}
		</>
	);
}
