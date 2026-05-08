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

import type { ReactElement } from "react";

import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/conversion.js";
import type { RadioItemProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/radio/main/radio.api.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import type { EnumerationItem } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
import { DefaultFunctionMap } from "../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../main/core/contentElements/functionMap/functionMapContext.js";
import { RadioModule } from "../../../../main/core/contentElements/modules/radio/radioModule.js";
import type { RadioNode } from "../../../../main/core/contentElements/modules/radio/radioNode.js";
import { RADIO_TYPE } from "../../../../main/core/contentElements/modules/radio/radioNode.js";
import { nmTokensToString } from "../../../../main/core/contentElements/nmtokens.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../main/core/index.js";
import type { BaseControlSettings } from "../../../../main/core/types/controlSettings.js";
import type { BaseWidgetSettings } from "../../../../main/core/types/widgetSettings.js";
import {
	assertCallCount,
	assertCalledWith,
	assertCalledWithArgument
} from "../../../assertions.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../mocks/mockError.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

function setupMocks(controlSettings: BaseControlSettings) {
	return {
		useControlSettingsMock: mock.method(
			USE_COMMON_CONTROL_SETTINGS_WRAPPER,
			"useCommonControlSettings",
			() => controlSettings
		),
		useWidgetSettingsMock: mock.method(
			USE_COMMON_WIDGET_SETTINGS_WRAPPER,
			"useCommonWidgetSettings",
			mock.fn(getMockWidgetSettings)
		),
		useEnumerationValuesMock: mock.method(
			USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER,
			"useLocalizedEnumerationValues",
			mock.fn(getMockEnumerationValues)
		),
		useFocusFieldMock: mock.fn(),
		useFocusFirstErrorMock: mock.fn(),
		useFocusInputMock: mock.fn()
	};
}

describe("core.contentElements", () => {
	describe("Radio", () => {
		it("renders a Radio with the correct properties", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings);

			const { widgetMap } = renderWrapper(<RadioModule.renderer node={getMockNode()} />);

			const props = query(widgetMap.Radio).props();

			strictEqual(props["inline"], mockWidgetSettings.inline);
			strictEqual(props["id"], mockControlSettings.uiId);
			strictEqual(props["value"], mockWidgetSettings.value);
			strictEqual(props["label"], mockWidgetSettings.label);
			strictEqual(props["hideLabel"], mockWidgetSettings.hideLabel);
			strictEqual(props["readonly"], mockWidgetSettings.readonly);
			strictEqual(props["helperText"], mockWidgetSettings.helperText);
			strictEqual(props["tooltips"], mockWidgetSettings.tooltips);
			strictEqual(props["breakTooltipsToNewLine"], mockWidgetSettings.tooltipsOnTop);
			strictEqual(props["error"], mockWidgetSettings.error);
			strictEqual(props["errorMessage"], mockWidgetSettings.errors);
			strictEqual(props["warning"], mockWidgetSettings.warning);
			strictEqual(props["warningMessage"], mockWidgetSettings.warnings);
			strictEqual(props["info"], mockWidgetSettings.info);
			strictEqual(props["infoMessage"], mockWidgetSettings.infos);
			deepStrictEqual(props["groupDOMProps"], mockWidgetSettings.inputProps);
			strictEqual(props["ariaDescribedby"], nmTokensToString(mockWidgetSettings.ariaDescribedBy)); // TODO: additional test for this post-processing?
		});

		it("renders RadioItems for all enumeration options as children of the Radio widget", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings);

			const { widgetMap } = renderWrapper(<RadioModule.renderer node={getMockNode()} />);

			const mockEnumValues = getMockEnumerationValues();

			const radioProps = query(widgetMap.Radio).props();
			const radioChildren = radioProps.children as ReactElement<RadioItemProps>[];

			query(widgetMap.RadioItem).assertRenderedTimes(mockEnumValues.length);
			strictEqual(radioChildren.length, mockEnumValues.length);

			mockEnumValues.forEach((ev, idx) => {
				const props = radioChildren[idx].props;

				strictEqual(props["readonly"], mockWidgetSettings.readonly);
				strictEqual(props["label"], ev.label);
				strictEqual(props["value"], ev.value);
				if (idx === 0) {
					notStrictEqual(props["inputRef"], undefined);
				}
			});
		});

		it("calls useCommonControlSettings with the given node", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockNode = getMockNode();

			const { useControlSettingsMock } = setupMocks(mockControlSettings);

			renderWrapper(<RadioModule.renderer node={mockNode} />);

			assertCalledWith(useControlSettingsMock, mockNode);
		});

		it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });

			const { useWidgetSettingsMock } = setupMocks(mockControlSettings);

			renderWrapper(<RadioModule.renderer node={getMockNode()} />);

			assertCalledWith(useWidgetSettingsMock, mockControlSettings);
		});

		it("calls useLocalizedEnumerationValues with the given dataReference", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });

			const { useEnumerationValuesMock } = setupMocks(mockControlSettings);

			renderWrapper(<RadioModule.renderer node={getMockNode()} />);

			assertCalledWith(useEnumerationValuesMock, mockControlSettings.dataReference);
		});

		describe("focus hooks", () => {
			function setupFocusTest(options?: {
				groupedMessages?: Message[];
				ungroupedMessages?: Message[];
			}) {
				const mockControlSettings = getMockControlSettings({
					fieldType: "EnumerationType",
					groupedMessages: options?.groupedMessages,
					ungroupedMessages: options?.ungroupedMessages
				});

				const { useFocusFieldMock, useFocusFirstErrorMock, useFocusInputMock } =
					setupMocks(mockControlSettings);

				renderWrapper(
					<FunctionMapContext.Provider
						value={{
							...DefaultFunctionMap,
							useFocusField: useFocusFieldMock,
							useFocusFirstError: useFocusFirstErrorMock,
							useFocusInput: useFocusInputMock
						}}
					>
						<RadioModule.renderer node={getMockNode()} />
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

		it("calls valueChanged from the document context when a valid value was entered", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });

			const mockDocContext = mockDocumentContext();

			setupMocks(mockControlSettings);

			const { widgetMap } = renderWrapper(
				<DocumentContext.Provider value={mockDocContext}>
					<RadioModule.renderer node={getMockNode()} />
				</DocumentContext.Provider>
			);

			const props = query(widgetMap.Radio).props();

			props.onValueChanged?.("false");

			assertCalledWith(mockDocContext.event.onValueChanged, {
				path: mockControlSettings.dataReference,
				value: "false",
				userValue: "false"
			});
		});

		it("calls conversion.parseValue with the new value for fields of type boolean", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "BooleanType" });

			setupMocks(mockControlSettings);

			const mockDocContext = mockDocumentContext();

			const mockParseValue = mock.fn(() => ({ value: true }));

			const { widgetMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization(mockParseValue)}>
					<DocumentContext.Provider value={mockDocContext}>
						<RadioModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				</LocalizerContext.Provider>
			);

			const props = query(widgetMap.Radio).props();

			props.onValueChanged?.("true");

			assertCalledWith(mockParseValue, "true", mockControlSettings.conversionConfig);
		});

		it("does not call conversion.parseValue with the new value for fields of type enumeration", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });

			setupMocks(mockControlSettings);

			const mockDocContext = mockDocumentContext();

			const mockParseValue = mock.fn(() => ({ value: true }));

			const { widgetMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization(mockParseValue)}>
					<DocumentContext.Provider value={mockDocContext}>
						<RadioModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				</LocalizerContext.Provider>
			);

			const props = query(widgetMap.Radio).props();

			props.onValueChanged?.("true");

			assertCallCount(mockParseValue, 0);
		});
	});
});

function getMockNode(): RadioNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: RADIO_TYPE,
		props: {
			elementId: "test-id"
		}
	};
}

function getMockControlSettings(options: {
	fieldType: "EnumerationType" | "BooleanType";
	groupedMessages?: Message[];
	ungroupedMessages?: Message[];
}): BaseControlSettings {
	const { fieldType, groupedMessages, ungroupedMessages } = options;

	return {
		uiId: "test-id",
		groupedValidationMessages: groupedMessages ?? [],
		ungroupedValidationMessages: ungroupedMessages ?? [],
		dataReference: "/test[1]/path[1]",
		dmElement: {
			id: "test-element",
			name: "test-name",
			type: "Field",
			fieldType:
				fieldType === "EnumerationType"
					? {
							type: "EnumerationType",
							values: []
						}
					: {
							type: "BooleanType"
						}
		},
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: fieldType
		},
		value: undefined
	};
}

function getMockWidgetSettings(): BaseWidgetSettings {
	return {
		value: "true",
		label: "test-label",
		hideLabel: true,
		helperText: "test-helperText",
		readonly: true,
		error: true,
		warning: true,
		info: true,
		errors: "ERRORS",
		warnings: "WARNINGS",
		infos: "INFOS",
		tooltips: "TOOLTIPS",
		tooltipsOnTop: true,
		inline: true,
		inputProps: { "aria-required": true },
		ariaDescribedBy: ["test-aria1", "test-aria2"]
	};
}

function getMockEnumerationValues(): EnumerationItem[] {
	return [
		{
			label: "label-1",
			value: "true"
		},
		{
			label: "label-2",
			value: "false"
		}
	];
}

function getMockLocalization(parseValue?: ValueConversion["parseValue"]): LocalizerContext.Type {
	return {
		locale: { language: "en", country: "US" },
		localizer: () => "",
		conversion: {
			parseValue:
				parseValue ??
				(() => ({
					value: ""
				})),
			formatValue: () => ""
		},
		dataFormats: {}
	};
}
