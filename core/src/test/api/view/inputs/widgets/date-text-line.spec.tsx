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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { fireEvent } from "@testing-library/react";
import { act } from "react";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import { provider } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

import type { DateTextLineProps } from "../../../../../view/internal/components/widgets/form-engine/date-props.js";
import { DateTextLine } from "../../../../../view/internal/components/widgets/form-engine/dateTextLine.js";
import {
	rtlRenderWrapperAsync,
	type RtlRenderWrapper
} from "../../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../../utils/assertions.js";

import { getComponentMocks } from "./date-mocks.js";
import { describeDatePickerButtonTests } from "./date-picker-button-tests.js";
import { describeOnValueSubmitTest } from "./date-picker-onValueSubmit-test.js";
import { openDatePicker } from "./date-picker-open.js";

describe("api.view.inputs", () => {
	describe("DateTextLine", () => {
		interface SubmitHandlers {
			onValueSubmit: Mock<DateTextLineProps["onValueSubmit"]>;
			onTypedValueSubmit: Mock<DateTextLineProps["onTypedValueSubmit"]>;
		}

		async function createInput(options: Partial<DateTextLineProps>) {
			const submitHandlers: SubmitHandlers = {
				onTypedValueSubmit: mock.fn(),
				onValueSubmit: mock.fn()
			};

			const props: DateTextLineProps = {
				id: "my-date-button",
				getLocalizedDateString: (date: Date) => date.toDateString(),
				typedValue: options.typedValue === undefined ? new Date(2020, 10, 10) : options.typedValue,
				enableDatePicker: true,
				yearRange: { start: 2010, end: 2020 },
				timeZone: "UTC",

				okLabel: "OK",
				openPickerLabel: "OPEN",

				...submitHandlers,
				...options
			};

			const componentMocks = getComponentMocks();

			const wrapper = await rtlRenderWrapperAsync(<DateTextLine {...props} />, componentMocks);

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

			describeOnValueSubmitTest(createInput, "10/10/2010");
		});

		describe("dialog opened", () => {
			describe("any device / non mobile", () => {
				// has no placeholder

				describe("if the value changes", () => {
					it("closes the picker and calls onTypedValueSubmit from the prop", async () => {
						const wrapper = await createInput({});
						openDatePicker(wrapper);

						const datePickerBefore = query(wrapper.widgetMap.DatePicker).props();
						const inputDate = new Date(2019, 10, 10);
						act(() => {
							assertExists(datePickerBefore.onChange);
							datePickerBefore.onChange(inputDate);
						});
						strictEqual(wrapper.onTypedValueSubmit.mock.callCount(), 1);

						strictEqual(within(wrapper.baseElement).queryById("picker-wrapper"), null);
					});
				});
				it("renders a DatePicker with the correct props", async () => {
					const wrapper = await createInput({ timeZone: "Europe/Berlin" });
					openDatePicker(wrapper);

					const datePicker = query(wrapper.widgetMap.DatePicker).props();

					deepStrictEqual(datePicker.yearRange, { start: 2010, end: 2020 });
					deepStrictEqual(datePicker.value, new Date(2020, 10, 10));
					strictEqual(datePicker.timezone, "Europe/Berlin");
				});

				it("sets focusOnOpen to true on the attached portal of the picker", async () => {
					const wrapper = await createInput({});
					openDatePicker(wrapper);

					const portal = query(wrapper.widgetMap.AttachedPortal).props();
					strictEqual(portal.focusOnOpen, true);
				});

				// doesn't have onAccept

				describe("and the input contains a partially known date", () => {
					it("renders a DatePicker with the initial date picker selection", async () => {
						const wrapper = await createInput({
							typedValue: "2020-00-00",
							initialDatePickerSelection: new Date(2020, 11, 9)
						});
						openDatePicker(wrapper);

						const datePicker = query(wrapper.widgetMap.DatePicker).props();

						deepStrictEqual(datePicker.yearRange, { start: 2010, end: 2020 });
						deepStrictEqual(datePicker.value, new Date(2020, 11, 9));
					});
				});
			});
		});

		describe("mobile-specific behavior", () => {
			beforeEach(() => {
				mock.method(provider, "get", () => "phone");
			});

			// doesn't have placeholder

			it("renders a DatePickerDialog with the correct props and a submit button", async () => {
				const wrapper = await createInput({ timeZone: "Europe/Berlin" });
				openDatePicker(wrapper);

				const datePicker = query(wrapper.widgetMap.DatePickerDialog).props();

				deepStrictEqual(datePicker.yearRange, { start: 2010, end: 2020 });
				deepStrictEqual(datePicker.value, new Date(2020, 10, 10));
				deepStrictEqual(datePicker.title, "Tue Nov 10 2020");
				strictEqual(datePicker.timezone, "Europe/Berlin");

				ok(datePicker.submitButton);
				const submitButton = query(wrapper.widgetMap.Button)
					.withId("my-date-button-submit-button")
					.props();
				strictEqual(submitButton.primary, true);
				strictEqual(submitButton.label, "OK");
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
					const value = new Date(2020, 10, 10);
					const wrapper = await createInput({ typedValue: value });
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
		});
	});
});
