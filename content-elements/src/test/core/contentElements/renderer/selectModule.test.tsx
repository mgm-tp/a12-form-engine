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

import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import type { EnumerationItem } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
import { DefaultFunctionMap } from "../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../main/core/contentElements/functionMap/functionMapContext.js";
import { SelectModule } from "../../../../main/core/contentElements/modules/select/selectModule.js";
import type { SelectNode } from "../../../../main/core/contentElements/modules/select/selectNode.js";
import { SELECT_TYPE } from "../../../../main/core/contentElements/modules/select/selectNode.js";
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
		useEnumerationValuesMock: mock.method(
			USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER,
			"useLocalizedEnumerationValues",
			mock.fn(() => [...getMockEnumerationValues()])
		),
		useFocusFieldMock: mock.fn(),
		useFocusFirstErrorMock: mock.fn(),
		useFocusInputMock: mock.fn()
	};
}

describe("core.contentElements", () => {
	describe("Select", () => {
		it("renders a Select with the correct properties", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings("false");

			setupMocks(mockControlSettings, mockWidgetSettings);

			const { widgetMap } = renderWrapper(<SelectModule.renderer node={getMockNode()} />);

			const props = query(widgetMap.Select).props();

			strictEqual(props["id"], mockControlSettings.uiId);
			strictEqual(props["value"], mockWidgetSettings.value); // TODO: add test for special boolean logic here? add test for non-matching value?
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
			strictEqual(props["inputProps"], mockWidgetSettings.inputProps);
			strictEqual(props["ariaDescribedby"], nmTokensToString(mockWidgetSettings.ariaDescribedBy)); // TODO: additional test for this post-processing?
			notStrictEqual(props["selectRef"], undefined);
		});

		describe("Placeholder", () => {
			it("hands placeholder to the Select widget if no value is given", () => {
				const mockControlSettings = getMockControlSettings({
					fieldType: "EnumerationType",
					placeholder: "test-placeholder"
				});
				const mockWidgetSettings = getMockWidgetSettings();

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SelectModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Select).props();

				strictEqual(props["placeholder"], mockControlSettings.placeholder);
			});

			it("does not hand placeholder to the Select widget if a value is given", () => {
				const mockControlSettings = getMockControlSettings({
					fieldType: "EnumerationType",
					placeholder: "test-placeholder"
				});
				const mockWidgetSettings = getMockWidgetSettings("false");

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SelectModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Select).props();

				strictEqual(props["placeholder"], undefined);
			});
		});

		describe("Enumeration options", () => {
			it("adds an empty option to the enumeration options if a value is given", () => {
				const mockControlSettings = getMockControlSettings({
					fieldType: "EnumerationType",
					placeholder: "test-placeholder"
				});
				const mockWidgetSettings = getMockWidgetSettings("false");

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SelectModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Select).props();

				deepStrictEqual(props["items"], getMockSelectItems(true));
			});

			it("adds an empty option to the enumeration options if no placeholder is defined", () => {
				const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
				const mockWidgetSettings = getMockWidgetSettings();

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SelectModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Select).props();

				deepStrictEqual(props["items"], getMockSelectItems(true));
			});

			it("does not add an empty option to the enumeration options if no value is given, but a placeholder is defined", () => {
				const mockControlSettings = getMockControlSettings({
					fieldType: "EnumerationType",
					placeholder: "test-placeholder"
				});
				const mockWidgetSettings = getMockWidgetSettings();

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SelectModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Select).props();

				deepStrictEqual(props["items"], getMockSelectItems());
			});
		});

		it("calls useCommonControlSettings with the given node", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings();

			const { useControlSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<SelectModule.renderer node={mockNode} />);

			assertCalledWith(useControlSettingsMock, mockNode);
		});

		it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings();

			const { useWidgetSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<SelectModule.renderer node={mockNode} />);

			assertCalledWith(useWidgetSettingsMock, mockControlSettings);
		});

		it("calls useLocalizedEnumerationValues with the given dataReference", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings();

			const { useEnumerationValuesMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<SelectModule.renderer node={mockNode} />);

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
				const mockWidgetSettings = getMockWidgetSettings();

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
						<SelectModule.renderer node={getMockNode()} />
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
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings, mockWidgetSettings);

			const mockDocContext = mockDocumentContext();

			const { widgetMap } = renderWrapper(
				<DocumentContext.Provider value={mockDocContext}>
					<SelectModule.renderer node={getMockNode()} />
				</DocumentContext.Provider>
			);

			const props = query(widgetMap.Select).props();

			props.onValueChanged?.("true");

			assertCalledWith(mockDocContext.event.onValueChanged, {
				path: mockControlSettings.dataReference,
				value: "true",
				userValue: "true"
			});
		});

		it("calls valueChanged from the document context with null when an empty value was entered for fields of type enumeration", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings, mockWidgetSettings);

			const mockDocContext = mockDocumentContext();

			const { widgetMap } = renderWrapper(
				<DocumentContext.Provider value={mockDocContext}>
					<SelectModule.renderer node={getMockNode()} />
				</DocumentContext.Provider>
			);

			const props = query(widgetMap.Select).props();

			props.onValueChanged?.("");

			assertCalledWith(mockDocContext.event.onValueChanged, {
				path: mockControlSettings.dataReference,
				value: null,
				userValue: ""
			});
		});

		it("calls conversion.parseValue with the new value for fields of type boolean", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "BooleanType" });
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings, mockWidgetSettings);

			const mockParseValue = mock.fn(() => ({ value: true }));

			const { widgetMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization(mockParseValue)}>
					<DocumentContext.Provider value={mockDocumentContext()}>
						<SelectModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				</LocalizerContext.Provider>
			);

			const props = query(widgetMap.Select).props();

			props.onValueChanged?.("true");

			assertCalledWith(mockParseValue, "true", mockControlSettings.conversionConfig);
		});

		it("does not call conversion.parseValue with the new value for fields of type enumeration", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings, mockWidgetSettings);

			const mockParseValue = mock.fn(() => ({}));

			const { widgetMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization(mockParseValue)}>
					<DocumentContext.Provider value={mockDocumentContext()}>
						<SelectModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				</LocalizerContext.Provider>
			);

			const props = query(widgetMap.Select).props();

			props.onValueChanged?.("true");

			assertCallCount(mockParseValue, 0);
		});
	});
});

function getMockNode(): SelectNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: SELECT_TYPE,
		props: {
			elementId: "test-id"
		}
	};
}

function getMockControlSettings(options: {
	fieldType: "EnumerationType" | "BooleanType";
	placeholder?: string;
	groupedMessages?: Message[];
	ungroupedMessages?: Message[];
}): BaseControlSettings {
	const { fieldType, placeholder, groupedMessages, ungroupedMessages } = options;

	const base = {
		uiId: "test-id",
		groupedValidationMessages: groupedMessages ?? [],
		ungroupedValidationMessages: ungroupedMessages ?? [],
		dataReference: "/test[1]/path[1]"
	};

	return {
		...base,
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
		placeholder,
		value: undefined
	};
}

function getMockWidgetSettings(value?: string): BaseWidgetSettings {
	return {
		value,
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
		suffixes: "SUFFIXES",
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

function getMockSelectItems(withEmptyOption?: true): SelectItem[] {
	const enumValues = [
		...(withEmptyOption ? [{ label: "", value: "" }] : []),
		...getMockEnumerationValues()
	];

	return enumValues.map((item, index) => ({
		label: item.label,
		value: item.value,
		key: String(index)
	}));
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
