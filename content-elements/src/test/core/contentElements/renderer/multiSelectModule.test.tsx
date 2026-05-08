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

import { DataReference } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	GroupInstance,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.api.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import {
	USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER,
	type EnumerationItem
} from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
import { DefaultFunctionMap } from "../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../main/core/contentElements/functionMap/functionMapContext.js";
import { MultiSelectModule } from "../../../../main/core/contentElements/modules/multiSelect/multiSelectModule.js";
import type { MultiSelectNode } from "../../../../main/core/contentElements/modules/multiSelect/multiSelectNode.js";
import { MULTI_SELECT_TYPE } from "../../../../main/core/contentElements/modules/multiSelect/multiSelectNode.js";
import { nmTokensToString } from "../../../../main/core/contentElements/nmtokens.js";
import { FORM_ELEMENTS_NAMESPACE, RESOURCE_KEYS } from "../../../../main/core/index.js";
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
			mock.fn(getMockEnumerationValues)
		),
		useFocusFieldMock: mock.fn(),
		useFocusFirstErrorMock: mock.fn(),
		useFocusInputMock: mock.fn()
	};
}

describe("core.contentElements", () => {
	describe("MultiSelect", () => {
		it("renders a MultiSelect with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings([{ value: "value-1" }]);

			setupMocks(mockControlSettings, mockWidgetSettings);

			const { widgetMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization()}>
					<MultiSelectModule.renderer node={getMockNode()} />
				</LocalizerContext.Provider>
			);

			const props = query(widgetMap.MultiSelect).props();

			strictEqual(props.id, mockControlSettings.uiId);
			deepStrictEqual(props.items, getMockMultiSelectItems(["value-1"]));
			strictEqual(props.label, mockWidgetSettings.label);
			strictEqual(props.placeholder, mockControlSettings.placeholder);
			strictEqual(props.hideLabel, mockWidgetSettings.hideLabel);
			strictEqual(props.readonly, mockWidgetSettings.readonly);
			strictEqual(props.helperText, mockWidgetSettings.helperText);
			strictEqual(props.tooltips, mockWidgetSettings.tooltips);
			strictEqual(props.breakTooltipsToNewLine, mockWidgetSettings.tooltipsOnTop);
			strictEqual(props.hintTemplate, RESOURCE_KEYS.multiSelect.hintTemplate);
			strictEqual(props.selectAllText, RESOURCE_KEYS.multiSelect.selectAllText);
			strictEqual(props.mobileHeadingTitle, RESOURCE_KEYS.multiSelect.mobileHeadingText);
			strictEqual(props.errorMessage, mockWidgetSettings.errors);
			strictEqual(props.warningMessage, mockWidgetSettings.warnings);
			strictEqual(props.infoMessage, mockWidgetSettings.infos);
			strictEqual(props.inputProps, mockWidgetSettings.inputProps);
			notStrictEqual(props.inputRef, undefined);
			strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy)); // TODO: additional test for this post-processing?
		});

		// TODO: add test for mobile prop

		it("calls useCommonControlSettings with the given node", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			const { useControlSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<MultiSelectModule.renderer node={mockNode} />);

			assertCalledWith(useControlSettingsMock, mockNode);
		});

		it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			const { useWidgetSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<MultiSelectModule.renderer node={getMockNode()} />);

			assertCalledWith(useWidgetSettingsMock, mockControlSettings);
		});

		it("calls useLocalizedEnumerationValues with the dataReference to the multiSelect's value field", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			const { useEnumerationValuesMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<MultiSelectModule.renderer node={getMockNode()} />);

			const expectedDataReference = DataReference.resolveWithIndex(
				mockControlSettings.dataReference,
				"multiselect-field-name",
				1
			);

			assertCalledWith(useEnumerationValuesMock, expectedDataReference);
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
						<MultiSelectModule.renderer node={getMockNode()} />
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

		it("calls valueChanged from the document context when a valid value was entered", async () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();
			const mockEnumerationValues = getMockEnumerationValues();

			setupMocks(mockControlSettings, mockWidgetSettings);

			const mockDocContext = mockDocumentContext();

			const { widgetMap } = renderWrapper(
				<DocumentContext.Provider value={mockDocContext}>
					<MultiSelectModule.renderer node={getMockNode()} />
				</DocumentContext.Provider>
			);

			const props = query(widgetMap.MultiSelect).props();

			props.onChange?.(getMockMultiSelectItems([]).slice(1));

			assertCalledWith(mockDocContext.event.onValueChanged, {
				path: "/test/path",
				value: [
					{
						["multiselect-field-name"]: mockEnumerationValues[1].value
					},
					{
						["multiselect-field-name"]: mockEnumerationValues[2].value
					}
				]
			});
		});
	});
});

function getMockNode(): MultiSelectNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: MULTI_SELECT_TYPE,
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

	const base = {
		uiId: "test-id",
		groupedValidationMessages: groupedMessages ?? [],
		ungroupedValidationMessages: ungroupedMessages ?? [],
		dataReference: "/test/path"
	};

	return {
		...base,
		dmElement: {
			id: "test-element",
			name: "test-name",
			type: "Group",
			usageType: "multi-select",
			repeatability: 99,
			elements: [
				{
					id: "multiselect-field",
					name: "multiselect-field-name",
					type: "Field",
					fieldType: { type: "EnumerationType", values: [] }
				}
			]
		},
		value: undefined
	};
}

function getMockWidgetSettings(value?: GroupInstance[]): BaseWidgetSettings {
	return {
		value,
		label: "test-label",
		hideLabel: true,
		helperText: "test-helperText",
		readonly: true,
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
			value: "value-1"
		},
		{
			label: "label-2",
			value: "value-2"
		},
		{
			label: "label-3",
			value: "value-3"
		}
	];
}

function getMockMultiSelectItems(selectedValues: string[]): MultiselectProps.Item[] {
	return getMockEnumerationValues().map(item => ({
		id: item.value,
		label: item.label,
		value: item.value,
		selected: selectedValues.some(e => e === item.value)
	}));
}

function getMockLocalization(parseValue?: ValueConversion["parseValue"]): LocalizerContext.Type {
	return {
		locale: { language: "en", country: "US" },
		localizer: localizable => localizable.key,
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
