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

import { useContext, useRef, useState } from "react";

import { DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/date-utils.js";
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import type { DateTimeTextLineProps } from "./date-props.js";
import { DatePrefixButton } from "./datePrefixButton.js";

/** @internal */
export function DateTimeTextLine(props: DateTimeTextLineProps) {
	const { Button, DateTimePicker, Header, Icon } = useContext(WidgetMapContext);
	const { BufferedTextLine, PickerWrapper } = useContext(ComponentMapContext);
	const {
		addonAfter,
		ariaDescribedby,
		backLabel,
		clearLabel,
		disabled,
		editTimeLabel,
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
		placeholderText,
		readonly,
		suffixes,
		timeZone,
		tooltips,
		timeMode,
		value,
		warning,
		warningMessage,
		yearRange,
		typedValue
	} = props;

	const pickerButtonRef = useRef<HTMLElement | null>(null);
	const updateElementPosition = useRef<() => void>(undefined);

	const [tempDateTime, setTempDateTime] = useState<Date | undefined>(undefined);
	const [showPicker, setShowPicker] = useState(false);

	const isDatePickerShown = enableDatePicker && showPicker;
	const isPrefixButtonShown = enableDatePicker && !readonly && !disabled;
	const isPhone = DeviceDetector.get() === "phone";

	const handleValueSubmit = (value?: string) => {
		setShowPicker(false);
		onValueSubmit(value?.trim());
	};

	const handleAcceptChosenDate = (dateTime?: Date) => {
		setShowPicker(false);
		onTypedValueSubmit(dateTime as Date);

		if (!isPhone) {
			const domNode = document.getElementById(props.id);
			domNode?.focus();
		}
	};

	const handleOpenDatePicker = (): void => {
		setTempDateTime(typedValue ?? initialDatePickerSelection);
		setShowPicker(true);
	};

	const handleDatePickerSelection = (date: Date | undefined, time: Date | undefined): void => {
		if (!date && !time) {
			return;
		}

		setTempDateTime(DateTimeUtils.combineDateAndTime(date, time));
	};

	const handleClosePicker = (): void => {
		setShowPicker(false);
	};

	const handleScreenChange = () => {
		if (updateElementPosition) {
			updateElementPosition.current?.();
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

			{isDatePickerShown && !!pickerButtonRef.current && (
				<PickerWrapper
					referenceElement={pickerButtonRef.current}
					onClose={handleClosePicker}
					updateElementPosition={handler => {
						updateElementPosition.current = handler;
					}}
				>
					{isPhone ? (
						<DateTimePicker
							backLabel={backLabel}
							okLabel={okLabel}
							clearLabel={clearLabel}
							value={tempDateTime}
							timeRequired={true}
							timeMode={timeMode}
							timezone={timeZone}
							customTimeEditLabel={editTimeLabel}
							yearRange={yearRange}
							onAccept={handleAcceptChosenDate}
							onChange={handleDatePickerSelection}
							onScreenChange={handleScreenChange}
							mobileMode
							customHeaderElement={
								<Header
									actionButtons={
										<Button icon invert onClick={handleClosePicker}>
											<Icon>close</Icon>
										</Button>
									}
								>
									{tempDateTime ? getLocalizedDateString(tempDateTime) : placeholderText}
								</Header>
							}
						/>
					) : (
						<DateTimePicker
							backLabel={backLabel}
							okLabel={okLabel}
							clearLabel={clearLabel}
							timeRequired={true}
							timeMode={timeMode}
							timezone={timeZone}
							value={tempDateTime}
							customTimeEditLabel={editTimeLabel}
							yearRange={yearRange}
							onAccept={handleAcceptChosenDate}
							onChange={handleDatePickerSelection}
							onScreenChange={handleScreenChange}
							customHeaderElement={
								<Header>
									{tempDateTime ? getLocalizedDateString(tempDateTime) : placeholderText}
								</Header>
							}
						/>
					)}
				</PickerWrapper>
			)}
		</>
	);
}
