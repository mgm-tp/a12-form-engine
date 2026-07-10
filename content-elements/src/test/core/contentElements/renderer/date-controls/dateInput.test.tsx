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

import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { act } from "@testing-library/react";
import type { MouseEvent } from "react";

import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query, screen } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { LocalizerContextProps } from "@com.mgmtp.a12.utils/utils-localization-react";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { provider as deviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";
import type { ButtonProps, IconProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DatePickerNode } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { DATE_PICKER_TYPE } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { DateInput } from "../../../../../main/core/contentElements/modules/datePicker/inputTypes/dateInput.js";
import { DateUtils } from "../../../../../main/core/contentElements/modules/datePicker/inputTypes/dateUtils.js";
import { nmTokensToString } from "../../../../../main/core/contentElements/nmtokens.js";
import {
	FORM_ELEMENTS_NAMESPACE,
	FormElementContext,
	RESOURCE_KEYS
} from "../../../../../main/core/index.js";
import type { WidgetMap } from "../../../../../main/core/index.js";
import type { BaseControlSettings } from "../../../../../main/core/types/controlSettings.js";
import type { BaseWidgetSettings } from "../../../../../main/core/types/widgetSettings.js";
import {
	assertCallCount,
	assertCalledWith,
	assertCalledWithArgument
} from "../../../../assertions.js";
import { getMockLocalization } from "../../../../mocks/getMockLocalization.js";
import { mockDocumentContext } from "../../../../mocks/mockDocumentContext.js";
import {
	getMockMessage,
	mockConversionError,
	mockParseError
} from "../../../../mocks/mockError.js";
import { setupMockHooks } from "../../../../mocks/setupMockHooks.js";
import { getReactElementName, isReactElement } from "../../../../react-element-utils.js";
import {
	BUFFERED_TEXT_LINE,
	DATE_PICKER_DIALOG,
	PICKER_WRAPPER
} from "../../../../rtl-utils/data-roles.js";
import { renderWrapper } from "../../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("DateInput", () => {
		it("renders a BufferedTextLine with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0), readonly: true });

			const { componentMap } = setup({
				controlSettings: mockControlSettings,
				widgetSettings: mockWidgetSettings
			});

			const props = query(componentMap.BufferedTextLine).props();

			strictEqual(props.id, mockControlSettings.uiId);
			strictEqual(props.label, mockWidgetSettings.label);
			strictEqual(props.readonly, mockWidgetSettings.readonly);
			strictEqual(props.hideLabel, mockWidgetSettings.hideLabel);
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
		});

		describe("Tooltips", () => {
			it("sets tooltips in addOnAfter if tooltipsOnTop is not set", () => {
				const mockWidgetSettings = getMockWidgetSettings();

				const { componentMap } = setup({ widgetSettings: mockWidgetSettings });

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.addonAfter, mockWidgetSettings.tooltips);
				strictEqual(props.tooltips, undefined);
			});

			it("sets tooltips in tooltips prop if tooltipsOnTop is set", () => {
				const mockWidgetSettings = getMockWidgetSettings({ tooltipsOnTop: true });

				const { componentMap } = setup({ widgetSettings: mockWidgetSettings });

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.addonAfter, undefined);
				strictEqual(props.tooltips, mockWidgetSettings.tooltips);
			});
		});

		describe("ariaDescribedBy", () => {
			it("sets undefined if ariaDescribedBy is empty", () => {
				const { componentMap } = setup();

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.ariaDescribedby, undefined);
			});

			it("converts tokens into a single string if ariaDescribedBy is not empty", () => {
				const mockWidgetSettings = getMockWidgetSettings({ ariaDescribedBy: ["token1", "token2"] });

				const { componentMap } = setup({ widgetSettings: mockWidgetSettings });

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy));
			});
		});

		describe("Picker button", () => {
			it("renders a picker button if the date picker is not disabled and the control is not readonly", () => {
				const mockControlSettings = getMockControlSettings();

				const { widgetMap, componentMap } = setup({ controlSettings: mockControlSettings });

				query(widgetMap.Button).assertRenderedTimes(1);

				const textLineProps = query(componentMap.BufferedTextLine).props();
				const buttonProps =
					isReactElement(textLineProps.prefixes) &&
					getReactElementName(textLineProps.prefixes) === "ButtonMock"
						? (textLineProps.prefixes.props as ButtonProps)
						: undefined;

				strictEqual(buttonProps?.id, `${mockControlSettings.uiId}-picker`);
				strictEqual(buttonProps?.title, RESOURCE_KEYS.date.button.open);
				notStrictEqual(buttonProps?.buttonRef, undefined);

				query(widgetMap.Icon).assertRenderedTimes(1);

				const iconProps =
					isReactElement(buttonProps?.icon) && getReactElementName(buttonProps?.icon) === "IconMock"
						? (buttonProps?.icon.props as IconProps)
						: undefined;

				strictEqual(iconProps?.children, "event");
			});

			it("does not render a picker button if the date picker is disabled", () => {
				const { widgetMap } = setup({ disableDatePicker: true });

				query(widgetMap.Button).assertNotRendered();
			});

			it("does not render a picker button if the control is readonly", () => {
				const { widgetMap } = setup({ widgetSettings: getMockWidgetSettings({ readonly: true }) });

				query(widgetMap.Button).assertNotRendered();
			});
		});

		describe("Picker", () => {
			describe("desktop mode", () => {
				it("renders a PickerWrapper and a DatePicker when the picker button is clicked", async () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });

					const { componentMap, widgetMap } = setup({
						controlSettings: mockControlSettings,
						widgetSettings: mockWidgetSettings
					});

					await openPicker(widgetMap);

					query(componentMap.PickerWrapper).assertRendered();
					const wrapperProps = query(componentMap.PickerWrapper).props();

					deepStrictEqual(wrapperProps.referenceElement, {});
					notStrictEqual(wrapperProps.onClose, undefined);

					const pickerProps = query(widgetMap.DatePicker).props();

					deepStrictEqual(pickerProps.yearRange, {
						start: mockControlSettings.datePickerConfig?.minYear,
						end: mockControlSettings.datePickerConfig?.maxYear
					});
					strictEqual(pickerProps.value, mockWidgetSettings.value);
					strictEqual(pickerProps.timezone, mockControlSettings.timeZone);
				});

				it("sets an initial date for the DatePicker when no value is given", async () => {
					const initialDate = new Date(42);
					mock.method(DateUtils, "calculateInitialDate", () => initialDate);

					const { widgetMap } = setup();

					await openPicker(widgetMap);

					const pickerProps = query(widgetMap.DatePicker).props();

					strictEqual(pickerProps.value, initialDate);
				});

				it("closes the PickerWrapper when onClose is triggered", async () => {
					const { componentMap, widgetMap } = setup();

					await openPicker(widgetMap);

					const pickerWrapperBefore = screen.getByDataRole(PICKER_WRAPPER);
					notStrictEqual(pickerWrapperBefore, undefined);

					const wrapperProps = query(componentMap.PickerWrapper).props();

					act(() => {
						wrapperProps.onClose?.();
					});

					const pickerWrapperAfter = screen.queryAllByDataRole(PICKER_WRAPPER);
					strictEqual(pickerWrapperAfter.length, 0);
				});

				it("closes the PickerWrapper when onChange is triggered", async () => {
					const { widgetMap } = setup();

					await openPicker(widgetMap);

					const pickerWrapperBefore = screen.getByDataRole(PICKER_WRAPPER);
					notStrictEqual(pickerWrapperBefore, undefined);

					const pickerProps = query(widgetMap.DatePicker).props();

					act(() => {
						pickerProps.onChange?.(new Date(0));
					});

					const pickerWrapperAfter = screen.queryAllByDataRole(PICKER_WRAPPER);
					strictEqual(pickerWrapperAfter.length, 0);
				});

				it("calls valueChanged from the document context when onChange is triggered", async () => {
					const mockControlSettings = getMockControlSettings();
					const mockDocContext = mockDocumentContext();

					const { widgetMap } = setup({
						controlSettings: mockControlSettings,
						docContext: mockDocContext
					});

					await openPicker(widgetMap);

					const pickerProps = query(widgetMap.DatePicker).props();

					const newValue = new Date(0);

					act(() => {
						pickerProps.onChange?.(newValue);
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

				it("focuses the buffered text line when onChange is triggered", async () => {
					const { widgetMap } = setup();

					await openPicker(widgetMap);

					const pickerProps = query(widgetMap.DatePicker).props();

					act(() => {
						pickerProps.onChange?.(new Date(0));
					});

					const bufferedTextLine = screen.getByDataRole(BUFFERED_TEXT_LINE);

					strictEqual(bufferedTextLine, document.activeElement);
				});
			});

			describe("mobile mode", () => {
				beforeEach(() => {
					mock.method(deviceDetector, "get", () => "phone");
				});

				it("renders a DatePickerDialog when the picker button is clicked", async () => {
					const mockControlSettings = getMockControlSettings();
					const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0) });
					const mockFormattedDate = "formatted-date";

					const { widgetMap } = setup({
						controlSettings: mockControlSettings,
						widgetSettings: mockWidgetSettings,
						localizerContext: getMockLocalization({
							formatValue: () => mockFormattedDate
						})
					});

					await openPicker(widgetMap);

					const pickerProps = query(widgetMap.DatePickerDialog).props();

					deepStrictEqual(pickerProps.yearRange, {
						start: mockControlSettings.datePickerConfig?.minYear,
						end: mockControlSettings.datePickerConfig?.maxYear
					});
					strictEqual(pickerProps.value, mockWidgetSettings.value);
					strictEqual(pickerProps.timezone, mockControlSettings.timeZone);

					strictEqual(pickerProps.title, mockFormattedDate);
					notStrictEqual(pickerProps.submitButton, undefined);
					notStrictEqual(pickerProps.onClose, undefined);
					notStrictEqual(pickerProps.onChange, undefined);
				});

				it("renders a submit button in the DatePickerDialog", async () => {
					const mockControlSettings = getMockControlSettings();

					const { widgetMap } = setup({
						controlSettings: mockControlSettings,
						widgetSettings: getMockWidgetSettings({ value: new Date(0) })
					});

					await openPicker(widgetMap);

					const buttonProps = query(widgetMap.Button)
						.withId(`${mockControlSettings.uiId}-submit-button`)
						.props();

					strictEqual(buttonProps.primary, true);
					strictEqual(buttonProps.label, RESOURCE_KEYS.date.button.ok);
					strictEqual(buttonProps.disabled, false);
					notStrictEqual(buttonProps.onClick, undefined);
				});

				it("sets an initial date for the DatePickerDialog when no value is given", async () => {
					const initialDate = new Date(42);
					mock.method(DateUtils, "calculateInitialDate", () => initialDate);

					const { widgetMap } = setup();

					await openPicker(widgetMap);

					const pickerProps = query(widgetMap.DatePickerDialog).props();

					strictEqual(pickerProps.value, initialDate);
				});

				it("closes the DatePickerDialog when onClose is triggered", async () => {
					const { widgetMap } = setup();

					await openPicker(widgetMap);

					const pickerDialogBefore = screen.getByDataRole(DATE_PICKER_DIALOG);
					notStrictEqual(pickerDialogBefore, undefined);

					const dialogProps = query(widgetMap.DatePickerDialog).props();

					act(() => {
						dialogProps.onClose?.();
					});

					const pickerDialogAfter = screen.queryAllByDataRole(PICKER_WRAPPER);
					strictEqual(pickerDialogAfter.length, 0);
				});

				it("does not close the DatePickerDialog when onChange is triggered", async () => {
					const { widgetMap } = setup();

					await openPicker(widgetMap);

					const pickerDialogBefore = screen.getByDataRole(DATE_PICKER_DIALOG);
					notStrictEqual(pickerDialogBefore, undefined);

					const dialogProps = query(widgetMap.DatePickerDialog).props();

					act(() => {
						dialogProps.onChange?.(new Date(0));
					});

					const pickerDialogAfter = screen.queryAllByDataRole(DATE_PICKER_DIALOG);
					notStrictEqual(pickerDialogAfter, undefined);
				});

				it("changes the picker value when onChange is triggered", async () => {
					const { widgetMap } = setup();

					await openPicker(widgetMap);

					const dialogPropsBefore = query(widgetMap.DatePickerDialog).props();
					const newValue = new Date(42);

					act(() => {
						dialogPropsBefore.onChange?.(newValue);
					});

					const dialogPropsAfter = query(widgetMap.DatePickerDialog).props();
					strictEqual(dialogPropsAfter.value, newValue);
				});

				/**
				 * The test for clearing the value via the picker has been omitted,
				 * because it's not actually possible in the UI.
				 */

				it("calls valueChanged from the document context when the submit button is clicked", async () => {
					const mockControlSettings = getMockControlSettings();
					const mockDocContext = mockDocumentContext();
					const value = new Date(42);

					const { widgetMap } = setup({
						controlSettings: mockControlSettings,
						widgetSettings: getMockWidgetSettings({ value }),
						docContext: mockDocContext
					});

					await openPicker(widgetMap);

					const buttonProps = query(widgetMap.Button)
						.withId(`${mockControlSettings.uiId}-submit-button`)
						.props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					assertCalledWith(mockDocContext.event.onValueChanged, {
						path: mockControlSettings.dataReference,
						value
					});
				});

				it("closes the DatePickerDialog when the submit button is clicked", async () => {
					const mockControlSettings = getMockControlSettings();

					const { widgetMap } = setup({
						controlSettings: mockControlSettings
					});

					await openPicker(widgetMap);

					const buttonProps = query(widgetMap.Button)
						.withId(`${mockControlSettings.uiId}-submit-button`)
						.props();

					act(() => {
						buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
					});

					const pickerDialogAfter = screen.queryAllByDataRole(PICKER_WRAPPER);
					strictEqual(pickerDialogAfter.length, 0);
				});
			});
		});

		describe("ValueChange on TextLine", () => {
			it("calls valueChanged from the document context when a valid value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const mockDocContext = mockDocumentContext();

				const newValue = new Date(0);

				const { componentMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext,
					localizerContext: getMockLocalization({ parseValue: () => ({ value: newValue }) })
				});

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
				const mockDocContext = mockDocumentContext();

				const { componentMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext
				});

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
				const mockParseValue = mock.fn(() => ({ value: new Date(0) }));

				const { componentMap } = setup({
					localizerContext: getMockLocalization({ parseValue: mockParseValue })
				});

				const props = query(componentMap.BufferedTextLine).props();

				const newValue = "test-value";

				props.onValueSubmit?.(newValue);

				assertCalledWith(mockParseValue, newValue, mockControlSettings.conversionConfig);
			});

			it("calls parsingFailed from the document context when an invalid value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const mockDocContext = mockDocumentContext();

				const parseError = mockConversionError();
				const newValue = "test-value";
				const expectedError = mockParseError(
					parseError,
					mockControlSettings.dataReference,
					newValue
				);

				const { componentMap } = setup({
					docContext: mockDocContext,
					localizerContext: getMockLocalization({ parseValue: () => ({ parseError }) })
				});

				const props = query(componentMap.BufferedTextLine).props();

				props.onValueSubmit?.(newValue);

				assertCalledWith(mockDocContext.event.onParsingFailed, {
					dataReference: mockControlSettings.dataReference,
					parseError: expectedError
				});
			});

			it("closes the PickerWrapper if it was open", async () => {
				const { widgetMap, componentMap } = setup();

				await openPicker(widgetMap);

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

		describe("Hooks", () => {
			it("calls useCommonControlSettings with the given node", () => {
				const { useControlSettingsMock } = setupMockHooks({
					controlSettings: getMockControlSettings(),
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<DateInput node={mockNode()} />);

				assertCalledWith(useControlSettingsMock, mockNode());
			});

			it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
				const mockControlSettings = getMockControlSettings();

				const { useWidgetSettingsMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<DateInput node={mockNode()} />);

				assertCalledWith(useWidgetSettingsMock, mockControlSettings);
			});

			describe("focus hooks", () => {
				function setupFocusTest(options?: {
					groupedMessages?: Message[];
					ungroupedMessages?: Message[];
				}) {
					const mockControlSettings = getMockControlSettings({
						groupedMessages: options?.groupedMessages,
						ungroupedMessages: options?.ungroupedMessages
					});
					const mockWidgetSettings = getMockWidgetSettings();

					setupMockHooks({
						controlSettings: mockControlSettings,
						widgetSettings: mockWidgetSettings
					});

					return renderWrapper(<DateInput node={mockNode()} />);
				}

				it("calls focus hooks when rendered", () => {
					const { functionMap } = setupFocusTest();

					assertCallCount(functionMap.useFocusField, 1);
					assertCallCount(functionMap.useFocusFirstError, 1);
					assertCalledWithArgument(functionMap.useFocusFirstError, 0, false);
					assertCallCount(functionMap.useFocusInput, 1);
				});

				it("calls useFocusFirstError with true when an ungrouped error exists", () => {
					const { functionMap } = setupFocusTest({
						ungroupedMessages: [getMockMessage({ severity: "ERROR" })]
					});

					assertCalledWithArgument(functionMap.useFocusFirstError, 0, true);
				});

				it("calls useFocusFirstError with false when no ungrouped error exists", () => {
					const { functionMap } = setupFocusTest({
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

					assertCalledWithArgument(functionMap.useFocusFirstError, 0, false);
				});
			});
		});
	});
});

function setup(options?: {
	controlSettings?: BaseControlSettings;
	widgetSettings?: BaseWidgetSettings;
	docContext?: DocumentContext;
	localizerContext?: LocalizerContextProps;
	disableDatePicker?: true;
	node?: DatePickerNode;
}) {
	const controlSettings = options?.controlSettings ?? getMockControlSettings();
	const widgetSettings = options?.widgetSettings ?? getMockWidgetSettings();

	setupMockHooks({ controlSettings, widgetSettings });

	const mockDocContext = options?.docContext ?? mockDocumentContext();
	const mockLocalizerContext = options?.localizerContext ?? getMockLocalization();
	const formElementContext = {
		config: { timeMode: "12h" as const, disableDatePicker: options?.disableDatePicker },
		contentModelName: ""
	};
	const node = options?.node ?? mockNode();

	return renderWrapper(
		<LocalizerContext.Provider value={mockLocalizerContext}>
			<DocumentContext.Provider value={mockDocContext}>
				<FormElementContext.Provider value={formElementContext}>
					<DateInput node={node} />
				</FormElementContext.Provider>
			</DocumentContext.Provider>
		</LocalizerContext.Provider>
	);
}

async function openPicker(widgetMap: WidgetMap) {
	const buttonProps = query(widgetMap.Button).props();

	await act(() => {
		buttonProps.onClick?.({} as MouseEvent<HTMLElement>);
	});
}

function mockNode(): DatePickerNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: DATE_PICKER_TYPE,
		props: {
			elementId: "test-id"
		}
	};
}

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
				type: "DateType",
				format: "yyyy-MM-dd"
			}
		},
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: "DateType",
			format: "yyyy-MM-dd"
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

function getMockWidgetSettings(options?: Partial<BaseWidgetSettings>): BaseWidgetSettings {
	return {
		value: undefined,
		formattedValue: "test-value",
		label: "test-label",
		hideLabel: true,
		helperText: "test-helperText",
		error: true,
		warning: true,
		info: true,
		errors: "ERRORS",
		warnings: "WARNINGS",
		infos: "INFOS",
		tooltips: "TOOLTIPS",
		inputProps: { "aria-required": true },
		ariaDescribedBy: [],
		...(options ?? {})
	};
}
