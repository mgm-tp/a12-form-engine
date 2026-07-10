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

import { DataReference } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { provider as deviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { EnumerationItem } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
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
import { getMockLocalization } from "../../../mocks/getMockLocalization.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../mocks/mockError.js";
import { setupMockHooks } from "../../../mocks/setupMockHooks.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("MultiSelect", () => {
		it("renders a MultiSelect with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings({ value: [{ value: "value-1" }] });

			const { widgetMap } = setup({
				controlSettings: mockControlSettings,
				widgetSettings: mockWidgetSettings
			});

			const props = query(widgetMap.Multiselect).props();

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
		});

		describe("ariaDescribedBy", () => {
			it("sets undefined if ariaDescribedBy is empty", () => {
				const { widgetMap } = setup();

				const props = query(widgetMap.Multiselect).props();

				strictEqual(props.ariaDescribedby, undefined);
			});

			it("converts tokens into a single string if ariaDescribedBy is not empty", () => {
				const mockWidgetSettings = getMockWidgetSettings({
					ariaDescribedBy: ["token1", "token2"]
				});

				const { widgetMap } = setup({ widgetSettings: mockWidgetSettings });

				const props = query(widgetMap.Multiselect).props();

				strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy));
			});
		});

		describe("mobile", () => {
			it("sets mobile to false if the device === 'desktop'", () => {
				mock.method(deviceDetector, "get", () => "desktop");

				const { widgetMap } = setup();

				const props = query(widgetMap.Multiselect).props();
				strictEqual(props.mobile, false);
			});

			it("sets mobile to true if the device === 'phone'", () => {
				mock.method(deviceDetector, "get", () => "phone");

				const { widgetMap } = setup();

				const props = query(widgetMap.Multiselect).props();
				strictEqual(props.mobile, true);
			});
		});

		describe("Value Change", () => {
			it("calls valueChanged from the document context when a valid value was entered", async () => {
				const mockEnumerationValues = getMockEnumerationValues();
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					enumerationValues: mockEnumerationValues,
					docContext: mockDocContext
				});

				const props = query(widgetMap.Multiselect).props();

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

		describe("Hooks", () => {
			it("calls useCommonControlSettings with the given node", () => {
				const mockNode = getMockNode();

				const { useControlSettingsMock } = setupMockHooks({
					controlSettings: getMockControlSettings(),
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<MultiSelectModule.renderer node={mockNode} />);

				assertCalledWith(useControlSettingsMock, mockNode);
			});

			it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
				const mockControlSettings = getMockControlSettings();

				const { useWidgetSettingsMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<MultiSelectModule.renderer node={getMockNode()} />);

				assertCalledWith(useWidgetSettingsMock, mockControlSettings);
			});

			it("calls useLocalizedEnumerationValues with the dataReference to the multiSelect's value field", () => {
				const mockControlSettings = getMockControlSettings();

				const { useEnumerationValuesMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

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

					setupMockHooks({
						controlSettings: mockControlSettings,
						widgetSettings: mockWidgetSettings
					});

					return renderWrapper(<MultiSelectModule.renderer node={getMockNode()} />);
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
	enumerationValues?: EnumerationItem[];
	docContext?: DocumentContext;
}) {
	const controlSettings = options?.controlSettings ?? getMockControlSettings();
	const widgetSettings = options?.widgetSettings ?? getMockWidgetSettings();
	const enumerationValues = options?.enumerationValues ?? getMockEnumerationValues();

	setupMockHooks({ controlSettings, widgetSettings, enumerationValues });

	const mockDocContext = options?.docContext ?? mockDocumentContext();
	const mockLocalizerContext = getMockLocalization();
	const node = getMockNode();

	return renderWrapper(
		<LocalizerContext.Provider value={mockLocalizerContext}>
			<DocumentContext.Provider value={mockDocContext}>
				<MultiSelectModule.renderer node={node} />
			</DocumentContext.Provider>
		</LocalizerContext.Provider>
	);
}

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

function getMockWidgetSettings(options?: Partial<BaseWidgetSettings>): BaseWidgetSettings {
	return {
		value: undefined,
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
		ariaDescribedBy: [],
		...(options ?? {})
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
