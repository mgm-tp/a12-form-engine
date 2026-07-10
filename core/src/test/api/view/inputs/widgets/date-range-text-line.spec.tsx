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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { fireEvent } from "@testing-library/react";
import { act } from "react";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import { provider } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DateRangeTextLineProps } from "../../../../../view/internal/components/widgets/form-engine/date-props.js";
import { DateRangeTextLine } from "../../../../../view/internal/components/widgets/form-engine/dateRangeTextLine.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../../utils/assertions.js";

import { getComponentMocks } from "./date-mocks.js";
import { describeDatePickerButtonTests } from "./date-picker-button-tests.js";
import { describeOnValueSubmitTest } from "./date-picker-onValueSubmit-test.js";
import { openDatePicker } from "./date-picker-open.js";

describe("api.view.inputs", () => {
	describe("DateRangeControl", () => {
		interface SubmitHandlers {
			onValueSubmit: Mock<DateRangeTextLineProps["onValueSubmit"]>;
			onTypedValueSubmit: Mock<DateRangeTextLineProps["onTypedValueSubmit"]>;
		}

		async function createInput(options: Partial<DateRangeTextLineProps>) {
			const submitHandlers: SubmitHandlers = {
				onTypedValueSubmit: mock.fn(),
				onValueSubmit: mock.fn()
			};

			const props: DateRangeTextLineProps = {
				id: "my-date-button",
				getLocalizedDateString: (date: DateRange) =>
					date.from?.toDateString() + " - " + date.to?.toDateString(),
				typedValue: options.typedValue || {
					from: new Date(2020, 10, 10),
					to: new Date(2020, 10, 20)
				},
				enableDatePicker: true,
				yearRange: { start: 2010, end: 2020 },
				timeZone: "UTC",

				okLabel: "OK",
				openPickerLabel: "OPEN",
				clearLabel: "Clear",

				...submitHandlers,
				...options
			};

			const componentMocks = getComponentMocks();

			const wrapper = await rtlRenderWrapperAsync(<DateRangeTextLine {...props} />, componentMocks);

			return {
				...wrapper,
				...submitHandlers,
				id: props.id
			};
		}

		it("should render the PrefixButton with aria-labelledby", async () => {
			const wrapper = await createInput({});
			const button = query(wrapper.widgetMap.Button).withId("my-date-button-picker").props();

			deepStrictEqual(button.buttonAttributes, { "aria-labelledby": `${wrapper.id}-label` });
		});

		describe("dialog closed", () => {
			describeDatePickerButtonTests(createInput);
			describeOnValueSubmitTest(createInput, "10/10/2010-10/20/2010");
		});

		describe("dialog opened", () => {
			describe("any device / non mobile", () => {
				describe("if the value changes", () => {
					it("does not call onTypedValueSubmit, but sets the selected days of the DatePicker to the selected date range", async () => {
						const wrapper = await createInput({});
						openDatePicker(wrapper);

						const datePickerBefore = query(wrapper.widgetMap.DatePicker).props();
						const inputDate = { from: new Date(2019, 10, 10), to: new Date(2019, 10, 15) };

						act(() => {
							assertExists(datePickerBefore.onDateRangeChange);
							datePickerBefore.onDateRangeChange(inputDate);
						});
						strictEqual(wrapper.onTypedValueSubmit.mock.callCount(), 0);

						const dateRangePickerAfter = query(wrapper.widgetMap.DatePicker).props();
						deepStrictEqual(dateRangePickerAfter.selected, [inputDate.from, inputDate]);
					});
				});
				it("renders a DatePicker with the correct props", async () => {
					const wrapper = await createInput({ timeZone: "Europe/Berlin" });
					openDatePicker(wrapper);

					const datePicker = query(wrapper.widgetMap.DatePicker).props();
					deepStrictEqual(datePicker.yearRange, { start: 2010, end: 2020 });
					deepStrictEqual(datePicker.selected, [
						new Date(2020, 10, 10),
						{ from: new Date(2020, 10, 10), to: new Date(2020, 10, 20) }
					]);
					strictEqual(datePicker.timezone, "Europe/Berlin");

					const footer = datePicker.footer;
					deepStrictEqual(footer?.acceptLabel, "OK");
					deepStrictEqual(footer?.clearLabel, "Clear");
				});

				it("sets focusOnOpen to true on the attached portal of the picker", async () => {
					const wrapper = await createInput({});
					openDatePicker(wrapper);

					const portal = query(wrapper.widgetMap.AttachedPortal).props();
					strictEqual(portal.focusOnOpen, true);
				});

				describe("if the submit button is clicked", () => {
					it("closes the picker and calls onTypedValueSubmit from the prop", async () => {
						const RANGE: DateRange = {
							from: new Date(2019, 10, 10),
							to: new Date(2019, 10, 15)
						};
						const wrapper = await createInput({ typedValue: RANGE });
						openDatePicker(wrapper);

						const dateRangePicker = query(wrapper.widgetMap.DatePicker).props();
						deepStrictEqual(dateRangePicker.selected, [RANGE.from, RANGE]);

						await act(() => {
							dateRangePicker.footer?.onAccept?.(RANGE);
						});
						strictEqual(wrapper.onTypedValueSubmit.mock.callCount(), 1);
						strictEqual(wrapper.onTypedValueSubmit.mock.calls[0].arguments[0], RANGE);
						strictEqual(within(wrapper.baseElement).queryById("picker-wrapper"), null);
					});
				});

				describe("if the clear button is clicked", () => {
					it("resets the selected days given to the DatePicker", async () => {
						const wrapper = await createInput({});
						openDatePicker(wrapper);

						const dateRangePickerBefore = query(wrapper.widgetMap.DatePicker).props();
						act(() => {
							dateRangePickerBefore.footer?.onClear?.();
						});
						strictEqual(wrapper.onTypedValueSubmit.mock.callCount(), 0);

						const dateRangePickerAfter = query(wrapper.widgetMap.DatePicker).props();
						deepStrictEqual(dateRangePickerAfter.selected, [
							{
								from: undefined,
								to: undefined
							}
						]);
					});
				});
			});
		});

		describe("mobile-specific behavior", () => {
			beforeEach(() => {
				mock.method(provider, "get", () => "phone");
			});

			it("renders a DatePickerDialog with the correct props and a submit button", async () => {
				const wrapper = await createInput({ timeZone: "Europe/Berlin" });
				openDatePicker(wrapper);

				const datePicker = query(wrapper.widgetMap.DatePickerDialog).props();

				deepStrictEqual(datePicker.yearRange, { start: 2010, end: 2020 });
				deepStrictEqual(datePicker.selected, [
					new Date(2020, 10, 10),
					{ from: new Date(2020, 10, 10), to: new Date(2020, 10, 20) }
				]);
				deepStrictEqual(datePicker.title, "Tue Nov 10 2020 - Fri Nov 20 2020");
				strictEqual(datePicker.timezone, "Europe/Berlin");

				ok(datePicker.submitButton);
				const submitButton = query(wrapper.widgetMap.Button)
					.withId("my-date-button-submit-button")
					.props();
				strictEqual(submitButton.primary, true);
				strictEqual(submitButton.label, "OK");
			});

			describe("if the value changes", () => {
				it("does not call onTypedValueSubmit, but sets the selected days of the DatePickerDialog to the selected date range", async () => {
					const wrapper = await createInput({});
					openDatePicker(wrapper);

					const datePickerBefore = query(wrapper.widgetMap.DatePickerDialog).props();
					const dateInput = { from: new Date(2019, 10, 10), to: new Date(2019, 10, 15) };

					act(() => {
						assertExists(datePickerBefore.onDateRangeChange);
						datePickerBefore.onDateRangeChange(dateInput);
					});

					const datePickerAfter = query(wrapper.widgetMap.DatePickerDialog).props();
					deepStrictEqual(datePickerAfter.selected, [dateInput.from, dateInput]);
				});
			});

			const querySubmitButton = (wrapper: RtlRenderWrapper) =>
				within(wrapper.baseElement).queryById("my-date-button-submit-button");

			describe("if the onClose prop is triggered", () => {
				it("closes the picker", async () => {
					const wrapper = await createInput({});
					openDatePicker(wrapper);

					ok(querySubmitButton(wrapper), "Expected that the DatePickerDialog is opened");

					const datePicker = query(wrapper.widgetMap.DatePickerDialog).props();
					act(() => {
						assertExists(datePicker.onClose);
						datePicker.onClose();
					});

					strictEqual(wrapper.onTypedValueSubmit.mock.callCount(), 0);
					strictEqual(
						querySubmitButton(wrapper),
						null,
						"Expected that the DatePickerDialog is closed"
					);
				});
			});

			describe("if the submit button is clicked", () => {
				it("closes the picker and calls onTypedValueSubmit from the prop", async () => {
					const value = { from: new Date(2019, 10, 10), to: new Date(2019, 10, 15) };
					const wrapper = await createInput({
						typedValue: value
					});
					openDatePicker(wrapper);

					const submitButton = querySubmitButton(wrapper);
					assertExists(submitButton);
					fireEvent.click(submitButton);

					strictEqual(wrapper.onTypedValueSubmit.mock.callCount(), 1);
					deepStrictEqual(wrapper.onTypedValueSubmit.mock.calls[0].arguments[0], value);

					strictEqual(
						querySubmitButton(wrapper),
						null,
						"Expected that the DatePickerDialog is closed"
					);
				});
			});

			describe("if the clear button is clicked", () => {
				it("resets the selected days given to the DatePickerDialog", async () => {
					const wrapper = await createInput({});
					openDatePicker(wrapper);

					const clearButton = within(wrapper.baseElement).getById("my-date-button-clear-button");
					fireEvent.click(clearButton);

					const dateRangePickerAfter = query(wrapper.widgetMap.DatePickerDialog).props();
					deepStrictEqual(dateRangePickerAfter.selected, [
						{
							from: undefined,
							to: undefined
						}
					]);
				});
			});
		});
	});
});
