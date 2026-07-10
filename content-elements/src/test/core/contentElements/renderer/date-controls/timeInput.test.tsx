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

import { notStrictEqual, strictEqual } from "node:assert/strict";

import { act } from "@testing-library/react";

import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query, screen } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { ValueConversionParseError } from "@com.mgmtp.a12.utils/utils-localization";
import type { LocalizerContextProps } from "@com.mgmtp.a12.utils/utils-localization-react";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DatePickerNode } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { DATE_PICKER_TYPE } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { TimeInput } from "../../../../../main/core/contentElements/modules/datePicker/inputTypes/timeInput.js";
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
import { HEADER } from "../../../../rtl-utils/data-roles.js";
import { renderWrapper } from "../../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("TimeInput", () => {
		it("renders a TimePicker with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings({ value: new Date(0), readonly: true });

			const { widgetMap } = setup({
				controlSettings: mockControlSettings,
				widgetSettings: mockWidgetSettings,
				timeMode: "12h"
			});

			const props = query(widgetMap.TimePicker).props();

			strictEqual(props.id, mockControlSettings.uiId);
			strictEqual(props.label, mockWidgetSettings.label);
			strictEqual(props.readonly, mockWidgetSettings.readonly);
			strictEqual(props.hideLabel, mockWidgetSettings.hideLabel);
			strictEqual(props.helperText, mockWidgetSettings.helperText);
			strictEqual(props.placeholder, mockControlSettings.placeholder);
			strictEqual(props.value, mockWidgetSettings.value);
			strictEqual(props.error, mockWidgetSettings.error);
			strictEqual(props.errorMessage, mockWidgetSettings.errors);
			strictEqual(props.warning, mockWidgetSettings.warning);
			strictEqual(props.warningMessage, mockWidgetSettings.warnings);
			strictEqual(props.info, mockWidgetSettings.info);
			strictEqual(props.infoMessage, mockWidgetSettings.infos);
			strictEqual(props.mode, "12h");
			strictEqual(props.timezone, mockControlSettings.timeZone);
			strictEqual(props.okLabel, RESOURCE_KEYS.time.button.ok);
			strictEqual(props.clearLabel, RESOURCE_KEYS.time.button.clear);
			strictEqual(props.focusOnInputAfterPicking, true);
			strictEqual(props.inputProps, mockWidgetSettings.inputProps);
			notStrictEqual(props.timePickerInputRef, undefined);
		});

		describe("Tooltips", () => {
			it("sets tooltips in addOnAfter if tooltipsOnTop is not set", () => {
				const mockWidgetSettings = getMockWidgetSettings();

				const { widgetMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(widgetMap.TimePicker).props();

				strictEqual(props.addonAfter, mockWidgetSettings.tooltips);
				strictEqual(props.tooltips, undefined);
			});

			it("sets tooltips in tooltips prop if tooltipsOnTop is set", () => {
				const mockWidgetSettings = getMockWidgetSettings({ tooltipsOnTop: true });

				const { widgetMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(widgetMap.TimePicker).props();

				strictEqual(props.addonAfter, undefined);
				strictEqual(props.tooltips, mockWidgetSettings.tooltips);
			});
		});

		describe("ariaDescribedBy", () => {
			it("sets undefined if ariaDescribedBy is empty", () => {
				const { widgetMap } = setup();

				const props = query(widgetMap.TimePicker).props();

				strictEqual(props.ariaDescribedby, undefined);
			});

			it("converts tokens into a single string if ariaDescribedBy is not empty", () => {
				const mockWidgetSettings = getMockWidgetSettings({ ariaDescribedBy: ["token1", "token2"] });

				const { widgetMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(widgetMap.TimePicker).props();

				strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy));
			});
		});

		describe("Picker button", () => {
			it("does not set hidePickerButton if the picker is not disabled and the control is not readonly", () => {
				const { widgetMap } = setup();

				const props = query(widgetMap.TimePicker).props();

				strictEqual(props.hidePickerButton, undefined);
			});

			it("sets hidePickerButton if the picker is disabled", () => {
				const { widgetMap } = setup({
					disableDatePicker: true
				});

				const props = query(widgetMap.TimePicker).props();

				strictEqual(props.hidePickerButton, true);
			});

			it("sets hidePickerButton if the control is readonly", () => {
				const mockWidgetSettings = getMockWidgetSettings({ readonly: true });

				const { widgetMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(widgetMap.TimePicker).props();

				strictEqual(props.hidePickerButton, true);
			});
		});

		describe("Custom Header", () => {
			function setupForCustomHeader(options: {
				value?: Date;
				localizerContextValue: LocalizerContextProps;
			}) {
				const mockWidgetSettings = getMockWidgetSettings({ value: options?.value });

				setup({
					widgetSettings: mockWidgetSettings,
					localizerContext: options.localizerContextValue,
					widgetMap: {
						TimePicker: timePickerProps => {
							const customHeaderElement =
								timePickerProps.customHeaderElement as TimePickerProps.Renderer;

							return customHeaderElement(timePickerProps.value);
						}
					}
				});
			}

			it("renders a Header containing the formatted time", () => {
				const formattedTime = "formatted-time";

				setupForCustomHeader({
					value: new Date(0),
					localizerContextValue: getMockLocalization({ formatValue: () => formattedTime })
				});

				const header = screen.getByDataRole(HEADER);
				strictEqual(header.textContent, formattedTime);
			});

			it("renders a Header containing a placeholder if no value is given", () => {
				setupForCustomHeader({ localizerContextValue: getMockLocalization() });

				const header = screen.getByDataRole(HEADER);
				strictEqual(header.textContent, RESOURCE_KEYS.time.placeholderTime);
			});
		});

		describe("Callbacks", () => {
			describe("onChange", () => {
				it("calls valueChanged from the document context with the given date", () => {
					const mockControlSettings = getMockControlSettings();
					const mockDocContext = mockDocumentContext();

					const { widgetMap } = setup({
						controlSettings: mockControlSettings,
						docContext: mockDocContext
					});

					const pickerProps = query(widgetMap.TimePicker).props();

					const newValue = new Date(0);

					act(() => {
						pickerProps.onChange?.(newValue);
					});

					assertCalledWith(mockDocContext.event.onValueChanged, {
						path: mockControlSettings.dataReference,
						value: newValue
					});
				});

				it("calls valueChanged with null when no value was entered", () => {
					const mockControlSettings = getMockControlSettings();
					const mockDocContext = mockDocumentContext();

					const { widgetMap } = setup({
						controlSettings: mockControlSettings,
						docContext: mockDocContext
					});

					const props = query(widgetMap.TimePicker).props();

					props.onChange?.();

					assertCalledWith(mockDocContext.event.onValueChanged, {
						path: mockControlSettings.dataReference,
						value: null
					});
				});
			});

			describe("onValidate", () => {
				it("does not call parsingFailed from the document context when a valid value was given", () => {
					const mockDocContext = mockDocumentContext();

					const { widgetMap } = setup({
						docContext: mockDocContext
					});

					const pickerProps = query(widgetMap.TimePicker).props();

					act(() => {
						pickerProps.onValidate?.({ value: "valid-value", valid: true });
					});

					assertCallCount(mockDocContext.event.onParsingFailed, 0);
				});

				it("calls parsingFailed from the document context when an invalid value was given", () => {
					const mockControlSettings = getMockControlSettings();
					const mockDocContext = mockDocumentContext();

					const parseError = mockConversionError();
					const newValue = "test-value";
					const expectedError = mockParseError(
						parseError,
						mockControlSettings.dataReference,
						newValue
					);

					const { widgetMap } = setup({
						controlSettings: mockControlSettings,
						docContext: mockDocContext,
						localizerContext: getMockLocalization({ parseValue: () => ({ parseError }) })
					});

					const pickerProps = query(widgetMap.TimePicker).props();

					act(() => {
						pickerProps.onValidate?.({ value: newValue, valid: false });
					});

					assertCalledWith(mockDocContext.event.onParsingFailed, {
						dataReference: mockControlSettings.dataReference,
						parseError: expectedError
					});
				});
			});

			describe("timeFormatter", () => {
				it("returns value from conversion.formatValue when a time is given", () => {
					const formattedValue = "formatted-time";

					const { widgetMap } = setup({
						localizerContext: getMockLocalization({ formatValue: () => formattedValue })
					});

					const pickerProps = query(widgetMap.TimePicker).props();

					const result = pickerProps.timeFormatter?.(new Date(0));
					strictEqual(result, formattedValue);
				});

				it("returns formatted value from the widget settings when no time is given", () => {
					const mockWidgetSettings = getMockWidgetSettings();

					const { widgetMap } = setup({
						widgetSettings: mockWidgetSettings
					});

					const pickerProps = query(widgetMap.TimePicker).props();

					const result = pickerProps.timeFormatter?.(undefined);
					strictEqual(result, mockWidgetSettings.formattedValue);
				});
			});

			describe("timeConverter", () => {
				it("returns parsed value when a valid value was given", () => {
					const parsedValue = new Date(0);

					const { widgetMap } = setup({
						localizerContext: getMockLocalization({
							parseValue: () => ({ value: parsedValue })
						})
					});

					const pickerProps = query(widgetMap.TimePicker).props();

					const result = pickerProps.timeConverter?.("valid-value");
					strictEqual(result, parsedValue);
				});

				it("returns undefined when an invalid value was given", () => {
					const { widgetMap } = setup({
						localizerContext: getMockLocalization({
							parseValue: () => ({ parseError: {} as ValueConversionParseError })
						})
					});

					const pickerProps = query(widgetMap.TimePicker).props();

					const result = pickerProps.timeConverter?.("invalid-value");
					strictEqual(result, undefined);
				});
			});
		});

		describe("Hooks", () => {
			it("calls useCommonControlSettings with the given node", () => {
				const { useControlSettingsMock } = setupMockHooks({
					controlSettings: getMockControlSettings(),
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<TimeInput node={mockNode()} />);

				assertCalledWith(useControlSettingsMock, mockNode());
			});

			it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
				const mockControlSettings = getMockControlSettings();

				const { useWidgetSettingsMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<TimeInput node={mockNode()} />);

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

					return renderWrapper(<TimeInput node={mockNode()} />);
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
	timeMode?: "12h" | "24h";
	widgetMap?: Partial<WidgetMap>;
}) {
	const mockControlSettings = options?.controlSettings ?? getMockControlSettings();
	const mockWidgetSettings = options?.widgetSettings ?? getMockWidgetSettings();

	setupMockHooks({ controlSettings: mockControlSettings, widgetSettings: mockWidgetSettings });

	const formElementContext = {
		contentModelName: "",
		config: {
			timeMode: options?.timeMode ?? "24h",
			disableDatePicker: options?.disableDatePicker
		}
	};

	const renderOptions = options?.widgetMap ? { widgetMap: options?.widgetMap } : undefined;

	const result = renderWrapper(
		<LocalizerContext.Provider value={options?.localizerContext ?? getMockLocalization()}>
			<DocumentContext.Provider value={options?.docContext ?? mockDocumentContext()}>
				<FormElementContext.Provider value={formElementContext}>
					<TimeInput node={mockNode()} />
				</FormElementContext.Provider>
			</DocumentContext.Provider>
		</LocalizerContext.Provider>,
		renderOptions
	);

	return result;
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
	return {
		uiId: "test-id",
		groupedValidationMessages: options?.groupedMessages ?? [],
		ungroupedValidationMessages: options?.ungroupedMessages ?? [],
		dataReference: "/test[1]/path[1]",
		dmElement: {
			id: "test-element",
			name: "test-name",
			type: "Field",
			fieldType: {
				type: "TimeType",
				format: "HH:mm:ss"
			}
		},
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: "TimeType",
			format: "HH:mm:ss"
		},
		placeholder: "test-placeholder",
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
