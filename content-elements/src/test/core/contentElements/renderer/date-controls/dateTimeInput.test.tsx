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

import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { act } from "@testing-library/react";
import type { MouseEvent } from "react";

import type { ParseError } from "@com.mgmtp.a12.client/client-data";
import { DocumentPath, KernelMessage } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query, screen } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import { DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/date-utils.js";
import type { IconProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.api.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import { DefaultFunctionMap } from "../../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../../main/core/contentElements/functionMap/functionMapContext.js";
import type { DatePickerNode } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { DATE_PICKER_TYPE } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { DateTimeInput } from "../../../../../main/core/contentElements/modules/datePicker/inputTypes/dateTimeInput.js";
import { nmTokensToString } from "../../../../../main/core/contentElements/nmtokens.js";
import {
	FORM_ELEMENTS_NAMESPACE,
	FormElementContext,
	RESOURCE_KEYS
} from "../../../../../main/core/index.js";
import type { BaseControlSettings } from "../../../../../main/core/types/controlSettings.js";
import type { BaseWidgetSettings } from "../../../../../main/core/types/widgetSettings.js";
import {
	assertCallCount,
	assertCalledWith,
	assertCalledWithArgument
} from "../../../../assertions.js";
import { mockDocumentContext } from "../../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../../mocks/mockError.js";
import { getReactElementName, isReactElement } from "../../../../react-element-utils.js";
import { BUFFERED_TEXT_LINE, PICKER_WRAPPER } from "../../../../rtl-utils/data-roles.js";
import { renderWrapper } from "../../../../rtl-utils/render-wrapper.js";

function setupMocks(controlSettings: BaseControlSettings, widgetSettings: BaseWidgetSettings) {
	return {
		useControlSettingsMock: mock.method(
			USE_COMMON_CONTROL_SETTINGS_WRAPPER,
			"useCommonControlSettings",
			() => controlSettings
		),
		useWidgetSettingsMock: mock.method(
			USE_COMMON_WIDGET_SETTINGS_WRAPPER,
			"useCommonWidgetSettings",
			() => widgetSettings
		),
		useFocusFieldMock: mock.fn(),
		useFocusFirstErrorMock: mock.fn(),
		useFocusInputMock: mock.fn()
	};
}

describe("core.contentElements", () => {
	describe("DateInput", () => {
		it("renders a BufferedTextLine with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings({
				value: new Date(0),
				readonly: true
			});

			setupMocks(mockControlSettings, mockWidgetSettings);

			const { componentMap } = renderWrapper(<DateTimeInput node={mockNode} />);

			const props = query(componentMap.BufferedTextLine).props();

			strictEqual(props.id, mockControlSettings.uiId);
			strictEqual(props.label, mockWidgetSettings.label);
			strictEqual(props.readonly, mockWidgetSettings.readonly);
			strictEqual(props.hideLabel, mockWidgetSettings.hideLabel);
			strictEqual(props.addonAfter, undefined); // TODO: add more tests
			strictEqual(props.tooltips, mockWidgetSettings.tooltips);
			strictEqual(props.helperText, mockWidgetSettings.helperText);
			strictEqual(props.placeholder, mockControlSettings.placeholder);
			strictEqual(props.value, mockWidgetSettings.formattedValue);
			strictEqual(props.error, mockWidgetSettings.error);
			strictEqual(props.errorMessage, mockWidgetSettings.errors);
			strictEqual(props.warning, mockWidgetSettings.warning);
			strictEqual(props.warningMessage, mockWidgetSettings.warnings);
			strictEqual(props.info, mockWidgetSettings.info);
			strictEqual(props.infoMessage, mockWidgetSettings.infos);
			strictEqual(props.inputProps, mockWidgetSettings.inputProps);
			notStrictEqual(props.inputRef, undefined);
			strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy)); // TODO: additional test for this post-processing?
		});

		describe("Picker button", () => {
			it("renders a picker button if the date picker is not disabled and the control is not readonly", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { componentMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization()}>
						<DateTimeInput node={mockNode} />
					</LocalizerContext.Provider>
				);

				const textLineProps = query(componentMap.BufferedTextLine).props();
				const buttonProps =
					isReactElement(textLineProps.prefixes) &&
					getReactElementName(textLineProps.prefixes) === "ButtonMock"
						? (textLineProps.prefixes.props as ButtonProps)
						: undefined;

				// TODO: test buttonRef somehow?
				strictEqual(buttonProps?.id, `${mockControlSettings.uiId}-picker`);
				strictEqual(buttonProps?.title, RESOURCE_KEYS.dateTime.button.open);

				const iconProps =
					isReactElement(buttonProps?.icon) && getReactElementName(buttonProps?.icon) === "IconMock"
						? (buttonProps?.icon.props as IconProps)
						: undefined;

				strictEqual(iconProps?.children, "event");
			});

			it("does not render a picker button if the date picker is disabled", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization()}>
						<FormElementContext.Provider
							value={{
								config: { timeMode: "12h", disableDatePicker: true },
								contentModelName: ""
							}}
						>
							<DateTimeInput node={mockNode} />
						</FormElementContext.Provider>
					</LocalizerContext.Provider>
				);

				query(widgetMap.Button).assertNotRendered();
			});

			it("does not render a picker button if the control is readonly", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({
					value: new Date(0),
					readonly: true
				});

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization()}>
						<DateTimeInput node={mockNode} />
					</LocalizerContext.Provider>
				);

				query(widgetMap.Button).assertNotRendered();
			});
		});

		describe("Picker", () => {
			describe("desktop mode", () => {
				// TODO: add test for initial date calculation (mock + add unit test?)
				it("renders a PickerWrapper and a DateTimePicker when the picker button is clicked", () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

					setupMocks(mockControlSettings, mockWidgetSettings);

					const { widgetMap, componentMap } = renderWrapper(
						<FormElementContext.Provider
							value={{ contentModelName: "", config: { timeMode: "24h" } }}
						>
							<LocalizerContext.Provider value={getMockLocalization()}>
								<DateTimeInput node={mockNode} />
							</LocalizerContext.Provider>
						</FormElementContext.Provider>
					);

					const buttonProps = query(widgetMap.Button).props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					const wrapperProps = query(componentMap.PickerWrapper).props();

					// TODO: test for updateElementPosition?
					deepStrictEqual(wrapperProps.referenceElement, {});

					const pickerProps = query(widgetMap.DateTimePicker).props();

					// TODO: test for customHeaderElement
					// TODO: mock yearRange calculation and add unit test?
					strictEqual(pickerProps.backLabel, RESOURCE_KEYS.dateTime.button.back);
					strictEqual(pickerProps.okLabel, RESOURCE_KEYS.dateTime.button.ok);
					strictEqual(pickerProps.clearLabel, RESOURCE_KEYS.dateTime.button.clear);
					strictEqual(pickerProps.value, mockWidgetSettings.value);
					strictEqual(pickerProps.timeRequired, true);
					strictEqual(pickerProps.timeMode, "24h");
					strictEqual(pickerProps.timezone, mockControlSettings.timeZone);
					strictEqual(pickerProps.customTimeEditLabel, RESOURCE_KEYS.dateTime.button.editTime);
					deepStrictEqual(pickerProps.yearRange, {
						start: mockControlSettings.datePickerConfig?.minYear,
						end: mockControlSettings.datePickerConfig?.maxYear
					});
				});

				describe("Header", () => {
					it("renders a custom Header with a formatted date string in the picker if a value was given", () => {
						const mockControlSettings = getMockControlSettings();
						const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

						setupMocks(mockControlSettings, mockWidgetSettings);

						const expectedHeader = "FORMATTED_DATE_STRING";

						const { widgetMap } = renderWrapper(
							<LocalizerContext.Provider
								value={getMockLocalization({ formatValue: () => expectedHeader })}
							>
								<DateTimeInput node={mockNode} />
							</LocalizerContext.Provider>
						);

						const buttonProps = query(widgetMap.Button).props();

						act(() => {
							buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
						});

						const headerProps = query(widgetMap.Header).props();

						strictEqual(headerProps.children, expectedHeader);
					});

					// TODO: mock initial date calculation
					// it("renders a custom Header with an initial date in the DateTimePicker if no value was given", () => {
					// 	const mockControlSettings = getMockControlSettings();
					// 	const mockWidgetSettings = getMockWidgetSettings();

					// 	setupMocks(mockControlSettings, mockWidgetSettings);

					// 	const { widgetMap } = renderWrapper(
					// 		<LocalizerContext.Provider value={getMockLocalization()}>
					// 			<DateTimeInput node={mockNode} />
					// 		</LocalizerContext.Provider>
					// 	);

					// 	const buttonProps = query(widgetMap.Button).props();

					// 	act(() => {
					// 		buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					// 	});

					// 	const headerProps = query(widgetMap.Header).props();

					// 	strictEqual(headerProps.children, RESOURCE_KEYS.dateTime.placeholderTime);
					// });

					it("updates the custom Header when onChange is triggered", () => {
						const oldValue = new Date(0);

						const mockControlSettings = getMockControlSettings();
						const mockWidgetSettings = getMockWidgetSettings({ value: oldValue });

						setupMocks(mockControlSettings, mockWidgetSettings);

						const { widgetMap } = renderWrapper(
							<LocalizerContext.Provider
								value={getMockLocalization({
									formatValue: value => "" + value
								})}
							>
								<DateTimeInput node={mockNode} />
							</LocalizerContext.Provider>
						);

						const buttonProps = query(widgetMap.Button).props();

						act(() => {
							buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
						});

						const headerPropsBefore = query(widgetMap.Header).props();
						strictEqual(headerPropsBefore.children, "" + oldValue);

						const pickerProps = query(widgetMap.DateTimePicker).props();

						const newDate = new Date(123);
						const newTime = new Date(456789);

						act(() => {
							pickerProps.onChange?.(newDate, newTime);
						});

						const headerPropsAfter = query(widgetMap.Header).props();
						strictEqual(
							headerPropsAfter.children,
							"" + DateTimeUtils.combineDateAndTime(newDate, newTime)
						);
					});

					it("renders a custom Header with a placeholder if the value is cleared", () => {
						const oldValue = new Date(0);

						const mockControlSettings = getMockControlSettings();
						const mockWidgetSettings = getMockWidgetSettings({ value: oldValue });

						setupMocks(mockControlSettings, mockWidgetSettings);

						const { widgetMap } = renderWrapper(
							<LocalizerContext.Provider
								value={getMockLocalization({
									formatValue: value => "" + value
								})}
							>
								<DateTimeInput node={mockNode} />
							</LocalizerContext.Provider>
						);

						const buttonProps = query(widgetMap.Button).props();

						act(() => {
							buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
						});

						const headerPropsBefore = query(widgetMap.Header).props();
						strictEqual(headerPropsBefore.children, "" + oldValue);

						const pickerProps = query(widgetMap.DateTimePicker).props();

						act(() => {
							pickerProps.onChange?.();
						});

						const headerPropsAfter = query(widgetMap.Header).props();
						strictEqual(headerPropsAfter.children, RESOURCE_KEYS.dateTime.placeholderTime);
					});
				});

				it("closes the PickerWrapper when onClose is triggered", () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

					setupMocks(mockControlSettings, mockWidgetSettings);

					const { widgetMap, componentMap } = renderWrapper(<DateTimeInput node={mockNode} />);

					const buttonProps = query(widgetMap.Button).props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					const pickerWrapperBefore = screen.getByDataRole(PICKER_WRAPPER);
					notStrictEqual(pickerWrapperBefore, undefined);

					const wrapperProps = query(componentMap.PickerWrapper).props();

					act(() => {
						wrapperProps.onClose?.();
					});

					const pickerWrapperAfter = screen.queryAllByDataRole(PICKER_WRAPPER);
					strictEqual(pickerWrapperAfter.length, 0);
				});

				it("closes the PickerWrapper when onAccept is triggered", () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

					setupMocks(mockControlSettings, mockWidgetSettings);

					const { widgetMap } = renderWrapper(
						<DocumentContext.Provider value={mockDocumentContext()}>
							<DateTimeInput node={mockNode} />
						</DocumentContext.Provider>
					);

					const buttonProps = query(widgetMap.Button).props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					const pickerWrapperBefore = screen.getByDataRole(PICKER_WRAPPER);
					notStrictEqual(pickerWrapperBefore, undefined);

					const pickerProps = query(widgetMap.DateTimePicker).props();

					act(() => {
						pickerProps.onAccept?.(new Date(0));
					});

					const pickerWrapperAfter = screen.queryAllByDataRole(PICKER_WRAPPER);
					strictEqual(pickerWrapperAfter.length, 0);
				});

				it("calls valueChanged from the document context when onAccept is triggered", () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

					setupMocks(mockControlSettings, mockWidgetSettings);

					const mockDocContext = mockDocumentContext();

					const { widgetMap } = renderWrapper(
						<DocumentContext.Provider value={mockDocContext}>
							<DateTimeInput node={mockNode} />
						</DocumentContext.Provider>
					);

					const buttonProps = query(widgetMap.Button).props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					const pickerProps = query(widgetMap.DateTimePicker).props();

					const newValue = new Date(0);

					act(() => {
						pickerProps.onAccept?.(newValue);
					});

					assertCalledWith(mockDocContext.event.onValueChanged, {
						path: mockControlSettings.dataReference,
						value: newValue
					});
				});

				/**
				 * The test for clearing the value via the picker has been omitted,
				 * because it's not actually possible in the UI.
				 */

				it("focuses the buffered text line when onAccept is triggered", () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

					setupMocks(mockControlSettings, mockWidgetSettings);

					const { widgetMap } = renderWrapper(
						<DocumentContext.Provider value={mockDocumentContext()}>
							<DateTimeInput node={mockNode} />
						</DocumentContext.Provider>
					);

					const buttonProps = query(widgetMap.Button).props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					const pickerProps = query(widgetMap.DateTimePicker).props();

					act(() => {
						pickerProps.onAccept?.(new Date(0));
					});

					const bufferedTextLine = screen.getByDataRole(BUFFERED_TEXT_LINE);

					// expect(bufferedTextLine).toHaveFocus();
					strictEqual(bufferedTextLine, document.activeElement);
				});

				it("combines the selected date and time and updates the pickerValue when onChange is triggered", () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

					setupMocks(mockControlSettings, mockWidgetSettings);

					const { widgetMap, componentMap } = renderWrapper(
						<LocalizerContext.Provider value={getMockLocalization()}>
							<DateTimeInput node={mockNode} />
						</LocalizerContext.Provider>
					);

					const buttonProps = query(widgetMap.Button).props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					const wrapperProps = query(componentMap.PickerWrapper).props();

					deepStrictEqual(wrapperProps.referenceElement, {});

					const pickerPropsBefore = query(widgetMap.DateTimePicker).props();
					strictEqual(pickerPropsBefore.value, mockWidgetSettings.value);

					const newDate = new Date(42);
					const newTime = new Date(13370000);
					const expectedValue = DateTimeUtils.combineDateAndTime(newDate, newTime);

					act(() => {
						pickerPropsBefore.onChange?.(newDate, newTime);
					});

					const pickerPropsAfter = query(widgetMap.DateTimePicker).props();
					deepStrictEqual(pickerPropsAfter.value, expectedValue);
				});

				// TODO: test onScreenChange?
			});

			// TODO: test mobile mode
		});

		it("calls useCommonControlSettings with the given node", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

			const { useControlSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<DateTimeInput node={mockNode} />);

			assertCalledWith(useControlSettingsMock, mockNode);
		});

		it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

			const { useWidgetSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<DateTimeInput node={mockNode} />);

			assertCalledWith(useWidgetSettingsMock, mockControlSettings);
		});

		describe("focus hooks", () => {
			function setupFocusTest(options?: {
				groupedMessages?: Message[];
				ungroupedMessages?: Message[];
			}) {
				const mockControlSettings = getMockControlSettings(options);
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				const { useFocusFieldMock, useFocusFirstErrorMock, useFocusInputMock } = setupMocks(
					mockControlSettings,
					mockWidgetSettings
				);

				renderWrapper(
					<FunctionMapContext.Provider
						value={{
							...DefaultFunctionMap,
							useFocusField: useFocusFieldMock,
							useFocusFirstError: useFocusFirstErrorMock,
							useFocusInput: useFocusInputMock
						}}
					>
						<DateTimeInput node={mockNode} />
					</FunctionMapContext.Provider>
				);

				return { useFocusFieldMock, useFocusFirstErrorMock, useFocusInputMock };
			}

			it("calls focus hooks when rendered", () => {
				const { useFocusFieldMock, useFocusFirstErrorMock, useFocusInputMock } = setupFocusTest();

				assertCallCount(useFocusFieldMock, 1);
				assertCallCount(useFocusFirstErrorMock, 1);
				assertCalledWithArgument(useFocusFirstErrorMock, 0, false);
				assertCallCount(useFocusInputMock, 1);
			});

			it("calls useFocusFirstError with true when an ungrouped error exists", () => {
				const { useFocusFirstErrorMock } = setupFocusTest({
					ungroupedMessages: [getMockMessage({ severity: "ERROR" })]
				});

				assertCalledWithArgument(useFocusFirstErrorMock, 0, true);
			});

			it("calls useFocusFirstError with false when no ungrouped error exists", () => {
				const { useFocusFirstErrorMock } = setupFocusTest({
					ungroupedMessages: [
						getMockMessage({ severity: "WARNING" }),
						getMockMessage({ severity: "INFO" })
					],
					groupedMessages: [
						getMockMessage({ severity: "ERROR" }),
						getMockMessage({ severity: "WARNING" }),
						getMockMessage({ severity: "INFO" })
					]
				});

				assertCalledWithArgument(useFocusFirstErrorMock, 0, false);
			});
		});

		describe("ValueChange on TextLine", () => {
			it("calls valueChanged from the document context when a valid value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				setupMocks(mockControlSettings, mockWidgetSettings);

				const newValue = new Date(0);

				const mockDocContext = mockDocumentContext();

				const { componentMap } = renderWrapper(
					<LocalizerContext.Provider
						value={getMockLocalization({ parseValue: () => ({ value: newValue }) })}
					>
						<DocumentContext.Provider value={mockDocContext}>
							<DateTimeInput node={mockNode} />
						</DocumentContext.Provider>
					</LocalizerContext.Provider>
				);

				const props = query(componentMap.BufferedTextLine).props();

				props.onValueSubmit?.("");

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: newValue,
					userValue: ""
				});
			});

			it("calls valueChanged with undefined when no value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				setupMocks(mockControlSettings, mockWidgetSettings);

				const mockDocContext = mockDocumentContext();

				const { componentMap } = renderWrapper(
					<DocumentContext.Provider value={mockDocContext}>
						<DateTimeInput node={mockNode} />
					</DocumentContext.Provider>
				);

				const props = query(componentMap.BufferedTextLine).props();

				props.onValueSubmit?.();

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					userValue: undefined,
					value: undefined
				});
			});

			it("calls conversion.parseValue with the new value", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				setupMocks(mockControlSettings, mockWidgetSettings);

				const mockParseValue = mock.fn(() => ({ value: new Date(0) }));

				const { componentMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization({ parseValue: mockParseValue })}>
						<DocumentContext.Provider value={mockDocumentContext()}>
							<DateTimeInput node={mockNode} />
						</DocumentContext.Provider>
					</LocalizerContext.Provider>
				);

				const props = query(componentMap.BufferedTextLine).props();

				const newValue = "test-value";

				props.onValueSubmit?.(newValue);

				assertCalledWith(mockParseValue, newValue, mockControlSettings.conversionConfig);
			});

			it("calls parsingFailed from the document context when an invalid value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				setupMocks(mockControlSettings, mockWidgetSettings);

				const parseError: ValueConversion.ParseError = {
					errorCode: "",
					errorKey: "",
					errorText: { key: "" },
					severity: "ERROR" as const
				};

				const newValue = "test-value";

				const expectedError: ParseError = {
					message: {
						errorCode: parseError.errorCode,
						errorText: [parseError.errorText],
						severity: "ERROR",
						messageType: "VALUE_ERROR",
						entityInstance: DocumentPath.fromString(mockControlSettings.dataReference),
						referencedFields: [DocumentPath.fromString(mockControlSettings.dataReference)],
						rulePath: KernelMessage.FORMAL_VALIDATION,
						refOmissionErrorResponsible: []
					},
					value: newValue
				};

				const mockDocContext = mockDocumentContext();

				const { componentMap } = renderWrapper(
					<LocalizerContext.Provider
						value={getMockLocalization({ parseValue: () => ({ parseError }) })}
					>
						<DocumentContext.Provider value={mockDocContext}>
							<DateTimeInput node={mockNode} />
						</DocumentContext.Provider>
					</LocalizerContext.Provider>
				);

				const props = query(componentMap.BufferedTextLine).props();

				props.onValueSubmit?.(newValue);

				assertCalledWith(mockDocContext.event.onParsingFailed, {
					dataReference: mockControlSettings.dataReference,
					parseError: expectedError
				});
			});

			it("closes the PickerWrapper if it was open", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap, componentMap } = renderWrapper(
					<DocumentContext.Provider value={mockDocumentContext()}>
						<DateTimeInput node={mockNode} />
					</DocumentContext.Provider>
				);

				const buttonProps = query(widgetMap.Button).props();

				act(() => {
					buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
				});

				const pickerWrapperBefore = screen.getByDataRole(PICKER_WRAPPER);
				notStrictEqual(pickerWrapperBefore, undefined);

				const props = query(componentMap.BufferedTextLine).props();

				act(() => {
					props.onValueSubmit?.();
				});

				const pickerWrapperAfter = screen.queryAllByDataRole(PICKER_WRAPPER);
				strictEqual(pickerWrapperAfter.length, 0);
			});
		});
	});
});

const mockNode: DatePickerNode = {
	id: "test-node-id",
	namespace: FORM_ELEMENTS_NAMESPACE,
	type: DATE_PICKER_TYPE,
	props: {
		elementId: "test-id"
	}
};

function getMockControlSettings(options?: {
	groupedMessages?: Message[];
	ungroupedMessages?: Message[];
}): BaseControlSettings {
	const { groupedMessages, ungroupedMessages } = options ?? {};

	return {
		uiId: "test-id",
		groupedValidationMessages: groupedMessages ?? [],
		ungroupedValidationMessages: ungroupedMessages ?? [],
		dataReference: "/test[1]/path[1]",
		dmElement: {
			id: "test-element",
			name: "test-name",
			type: "Field",
			fieldType: {
				type: "DateTimeType",
				format: "yyyy-MM-dd'T'HH:mm:ss"
			}
		},
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: "DateTimeType",
			format: "yyyy-MM-dd'T'HH:mm:ss"
		},
		placeholder: "test-placeholder",
		datePickerConfig: {
			minYear: 1990,
			maxYear: 2050,
			preselectionYear: 2025,
			absolute: true
		},
		value: undefined
	};
}

function getMockWidgetSettings(options?: { value?: Date; readonly?: true }): BaseWidgetSettings {
	return {
		value: options?.value,
		formattedValue: "test-value",
		label: "test-label",
		hideLabel: true,
		helperText: "test-helperText",
		readonly: options?.readonly,
		error: true,
		warning: true,
		info: true,
		errors: "ERRORS",
		warnings: "WARNINGS",
		infos: "INFOS",
		tooltips: "TOOLTIPS",
		tooltipsOnTop: true,
		inputProps: { "aria-required": true },
		ariaDescribedBy: ["test-aria1", "test-aria2"]
	};
}

function getMockLocalization(conversion?: Partial<ValueConversion>): LocalizerContext.Type {
	return {
		locale: { language: "en", country: "US" },
		localizer: localizable => localizable.key,
		conversion: {
			parseValue: () => ({
				value: ""
			}),
			formatValue: () => "",
			...conversion
		},
		dataFormats: {}
	};
}
