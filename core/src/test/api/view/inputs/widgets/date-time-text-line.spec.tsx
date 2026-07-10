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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { fireEvent } from "@testing-library/react";
import { act } from "react";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DateTimeTextLineProps } from "../../../../../view/internal/components/widgets/form-engine/date-props.js";
import { DateTimeTextLine } from "../../../../../view/internal/components/widgets/form-engine/dateTimeTextLine.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../../utils/assertions.js";

import { getComponentMocks } from "./date-mocks.js";
import { describeDatePickerButtonTests } from "./date-picker-button-tests.js";
import { describeOnValueSubmitTest } from "./date-picker-onValueSubmit-test.js";
import { openDatePicker } from "./date-picker-open.js";

describe("api.view.inputs", () => {
	describe("DateTimeTextLine", () => {
		interface SubmitHandlers {
			onValueSubmit: Mock<DateTimeTextLineProps["onValueSubmit"]>;
			onTypedValueSubmit: Mock<DateTimeTextLineProps["onTypedValueSubmit"]>;
		}

		const defaultProps = {
			id: "my-date-button",
			getLocalizedDateString: (date: Date) => date.toDateString(),
			typedValue: new Date(2020, 10, 10),
			enableDatePicker: true,
			yearRange: { start: 2010, end: 2020 },
			initialDatePickerSelection: new Date(2020, 10, 10),
			timeZone: "UTC",

			okLabel: "OK",
			openPickerLabel: "OPEN",
			backLabel: "Back",
			clearLabel: "Clear",
			editTimeLabel: "Edit Time",
			placeholderText: "Placeholder Text"
		} satisfies Omit<DateTimeTextLineProps, "onValueSubmit" | "onTypedValueSubmit">;

		async function createInput(options: Partial<DateTimeTextLineProps>) {
			const submitHandlers: SubmitHandlers = {
				onTypedValueSubmit: mock.fn(),
				onValueSubmit: mock.fn()
			};
			const props: DateTimeTextLineProps = {
				...defaultProps,
				...submitHandlers,
				...options
			};

			const componentMocks = getComponentMocks();

			const wrapper = await rtlRenderWrapperAsync(<DateTimeTextLine {...props} />, componentMocks);

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

		function describePlaceholderTest(): void {
			describe("if no value is set", () => {
				it("renders a DateTimePicker with the given placeholder text in the time picker dialog", async () => {
					const wrapper = await createInput({
						typedValue: null,
						initialDatePickerSelection: undefined
					});
					openDatePicker(wrapper);

					const header = query(wrapper.widgetMap.DateTimePickerHeader).props();
					strictEqual(header.children, defaultProps.placeholderText);
				});
			});
		}

		describe("dialog opened", () => {
			describe("any device / non mobile", () => {
				describePlaceholderTest();

				it("renders a DateTimePicker with the correct props", async () => {
					const wrapper = await createInput({ timeZone: "Europe/Berlin" });
					openDatePicker(wrapper);

					const datePicker = query(wrapper.widgetMap.DateTimePicker).props();

					deepStrictEqual(datePicker.yearRange, defaultProps.yearRange);
					deepStrictEqual(datePicker.value, defaultProps.typedValue);
					strictEqual(datePicker.timezone, "Europe/Berlin");
					strictEqual(datePicker.okLabel, defaultProps.okLabel);
					strictEqual(datePicker.backLabel, defaultProps.backLabel);
					strictEqual(datePicker.clearLabel, defaultProps.clearLabel);
					strictEqual(datePicker.customTimeEditLabel, defaultProps.editTimeLabel);
					strictEqual(datePicker.mobileMode, undefined);
				});

				it("sets focusOnOpen to true on the attached portal of the picker", async () => {
					const wrapper = await createInput({});
					openDatePicker(wrapper);

					const portal = query(wrapper.widgetMap.AttachedPortal).props();
					strictEqual(portal.focusOnOpen, true);
				});

				describe("if the picker is cleared", () => {
					it("unsets the temp date time so the placeholder text is shown in the header", async () => {
						const wrapper = await createInput({});
						openDatePicker(wrapper);

						const headerBefore = query(wrapper.widgetMap.DateTimePickerHeader).props();
						strictEqual(
							headerBefore.children,
							defaultProps.getLocalizedDateString(defaultProps.typedValue)
						);

						const datePicker = query(wrapper.widgetMap.DateTimePicker).props();
						act(() => {
							assertExists(datePicker.onChange);
							datePicker.onChange(undefined, undefined);
						});

						const headerAfter = query(wrapper.widgetMap.DateTimePickerHeader).props();
						strictEqual(headerAfter.children, defaultProps.placeholderText);
					});
				});

				describe("if onAccept is triggered", () => {
					it("closes the picker and calls onTypedValueSubmit from the prop", async () => {
						const wrapper = await createInput({});

						openDatePicker(wrapper);

						const datePickerBefore = query(wrapper.widgetMap.DateTimePicker).props();
						const inputDate = new Date(Date.UTC(2019, 10, 10));
						const inputTime = new Date(Date.UTC(1970, 1, 1, 14, 43));
						const expectedTime = new Date(Date.UTC(2019, 10, 10, 14, 43));

						act(() => {
							assertExists(datePickerBefore.onChange);
							datePickerBefore.onChange(inputDate, inputTime);
						});

						const datePickerAfter = query(wrapper.widgetMap.DateTimePicker).props();
						deepStrictEqual(datePickerAfter.value, expectedTime);

						act(() => {
							assertExists(datePickerBefore.onAccept);
							datePickerBefore.onAccept(expectedTime);
						});

						deepStrictEqual(wrapper.onTypedValueSubmit.mock.calls[0].arguments[0], expectedTime);
					});
				});

				// doesn't have partial dates
			});
		});

		describe("mobile-specific behavior", () => {
			beforeEach(() => {
				mock.method(provider, "get", () => "phone");
			});

			describePlaceholderTest();

			it("renders a DatePickerDialog with mobile mode set", async () => {
				const wrapper = await createInput({});
				openDatePicker(wrapper);

				const datePicker = query(wrapper.widgetMap.DateTimePicker).props();

				strictEqual(datePicker.mobileMode, true);
			});

			it("renders a button within the header that closes the picker", async () => {
				const wrapper = await createInput({});
				openDatePicker(wrapper);

				const picker = within(wrapper.baseElement).getById("picker-wrapper");
				const header = within(picker).getByDataRole(`${DataRoles.DateTimePicker.Header}`);
				const button = within(header).getByRole("button");

				strictEqual(button.textContent, "close");

				fireEvent.click(button);

				strictEqual(within(wrapper.baseElement).queryById("picker-wrapper"), null);
			});
		});
	});
});
