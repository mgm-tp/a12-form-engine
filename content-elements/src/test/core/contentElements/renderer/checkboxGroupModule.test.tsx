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

import { notStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { MouseEvent, PropsWithChildren, ReactElement } from "react";

import { DataReference } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	GroupInstance,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import type { EnumerationItem } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
import { DefaultFunctionMap } from "../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../main/core/contentElements/functionMap/functionMapContext.js";
import { CheckboxGroupModule } from "../../../../main/core/contentElements/modules/checkboxGroup/checkboxGroupModule.js";
import type { CheckboxGroupNode } from "../../../../main/core/contentElements/modules/checkboxGroup/checkboxGroupNode.js";
import { CHECKBOX_GROUP_TYPE } from "../../../../main/core/contentElements/modules/checkboxGroup/checkboxGroupNode.js";
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
import {
	getReactElementName,
	isReactElement,
	isReactElementArray
} from "../../../react-element-utils.js";
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
	describe("CheckboxGroup", () => {
		it("renders a CheckboxGroup with the correct properties", () => {
			const mockControlSettings = getMockControlSettings({ enableSelectAll: true });
			const mockWidgetSettings = getMockWidgetSettings([{ ["multiselect-field-name"]: "value-1" }]);

			setupMocks(mockControlSettings, mockWidgetSettings);

			const { widgetMap } = renderWrapper(<CheckboxGroupModule.renderer node={getMockNode()} />);

			const props = query(widgetMap.CheckboxGroup).props();

			strictEqual(props.inline, mockWidgetSettings.inline);
			strictEqual(props.id, mockControlSettings.uiId);
			strictEqual(props.label, mockWidgetSettings.label);
			strictEqual(props.hideLabel, mockWidgetSettings.hideLabel);
			strictEqual(props.readonly, mockWidgetSettings.readonly);
			strictEqual(props.helperText, mockWidgetSettings.helperText);
			strictEqual(props.tooltips, mockWidgetSettings.tooltips);
			strictEqual(props.breakTooltipsToNewLine, mockWidgetSettings.tooltipsOnTop);
			strictEqual(props.error, mockWidgetSettings.error);
			strictEqual(props.errorMessage, mockWidgetSettings.errors);
			strictEqual(props.warning, mockWidgetSettings.warning);
			strictEqual(props.warningMessage, mockWidgetSettings.warnings);
			strictEqual(props.info, mockWidgetSettings.info);
			strictEqual(props.infoMessage, mockWidgetSettings.infos);
			strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy)); // TODO: additional test for this post-processing?
		});

		describe("CheckboxGroup Children", () => {
			it("hands CheckboxGroupItems for all enumeration options to the CheckboxGroup widget", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings([
					{ ["multiselect-field-name"]: "value-1" }
				]);
				const mockEnumerationValues = getMockEnumerationValues();

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<CheckboxGroupModule.renderer node={getMockNode()} />);

				const checkboxGroupProps = query(widgetMap.CheckboxGroup).props();
				const checkboxGroupChildren = isReactElementArray(checkboxGroupProps.children)
					? checkboxGroupProps.children
					: [];

				query(widgetMap.CheckboxGroupItem).assertRenderedTimes(mockEnumerationValues.length);
				strictEqual(checkboxGroupChildren.length, mockEnumerationValues.length);

				mockEnumerationValues.forEach((ev, idx) => {
					const element = checkboxGroupChildren[idx];

					strictEqual(getReactElementName(element), "CheckboxGroupItemMock");

					strictEqual(element.props.label, ev.label);
					strictEqual(element.props.value, ev.value);
					strictEqual(element.props.selected, ev.value === "value-1");
					if (idx === 0) {
						notStrictEqual(element.props.inputRef, undefined);
					}
				});
			});

			it("hands a CheckboxIndeterminate to the CheckboxGroup with checked === true if enableSelectAll is true and all enumeration options are selected", () => {
				const mockControlSettings = getMockControlSettings({ enableSelectAll: true });
				const mockWidgetSettings = getMockWidgetSettings([
					{ ["multiselect-field-name"]: "value-1" },
					{ ["multiselect-field-name"]: "value-2" },
					{ ["multiselect-field-name"]: "value-3" }
				]);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization()}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</LocalizerContext.Provider>
				);

				const props = query(widgetMap.CheckboxGroup).props();
				const filteredChildren = isReactElementArray(props.children)
					? props.children.filter(c => getReactElementName(c) === "CheckboxIndeterminateMock")
					: [];

				query(widgetMap.CheckboxIndeterminate).assertRenderedTimes(1);
				strictEqual(filteredChildren.length, 1);

				strictEqual(
					(filteredChildren[0].props["label"] as ReactElement<PropsWithChildren>).props["children"],
					RESOURCE_KEYS.multiSelect.selectAllText
				);
				strictEqual(filteredChildren[0].props.checked, true);
			});

			it("hands a CheckboxIndeterminate to the CheckboxGroup with checked === 'mixed' if enableSelectAll is true and some enumeration options are selected", () => {
				const mockControlSettings = getMockControlSettings({ enableSelectAll: true });
				const mockWidgetSettings = getMockWidgetSettings([
					{ ["multiselect-field-name"]: "value-3" }
				]);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization()}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</LocalizerContext.Provider>
				);

				const props = query(widgetMap.CheckboxGroup).props();
				const filteredChildren = isReactElementArray(props.children)
					? props.children.filter(c => getReactElementName(c) === "CheckboxIndeterminateMock")
					: [];

				query(widgetMap.CheckboxIndeterminate).assertRenderedTimes(1);
				strictEqual(filteredChildren.length, 1);

				const checkboxIndeterminateProps = filteredChildren[0].props;
				const label = isReactElement(checkboxIndeterminateProps.label)
					? (checkboxIndeterminateProps.label as ReactElement<PropsWithChildren>).props.children
					: undefined;

				strictEqual(label, RESOURCE_KEYS.multiSelect.selectAllText);
				strictEqual(checkboxIndeterminateProps.checked, "mixed");
			});

			it("hands a CheckboxIndeterminate to the CheckboxGroup with checked === false if enableSelectAll is true and no enumeration options are selected", () => {
				const mockControlSettings = getMockControlSettings({ enableSelectAll: true });
				const mockWidgetSettings = getMockWidgetSettings([]);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization()}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</LocalizerContext.Provider>
				);

				const props = query(widgetMap.CheckboxGroup).props();
				const filteredChildren = isReactElementArray(props.children)
					? props.children.filter(c => getReactElementName(c) === "CheckboxIndeterminateMock")
					: [];

				query(widgetMap.CheckboxIndeterminate).assertRenderedTimes(1);
				strictEqual(filteredChildren.length, 1);

				const checkboxIndeterminateProps = filteredChildren[0].props;
				const label = isReactElement(checkboxIndeterminateProps.label)
					? (checkboxIndeterminateProps.label as ReactElement<PropsWithChildren>).props.children
					: undefined;

				strictEqual(label, RESOURCE_KEYS.multiSelect.selectAllText);
				strictEqual(checkboxIndeterminateProps.checked, false);
			});

			it("does not hand a CheckboxIndeterminate to the CheckboxGroup if enableSelectAll is undefined", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings([]);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(
					<LocalizerContext.Provider value={getMockLocalization()}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</LocalizerContext.Provider>
				);

				query(widgetMap.CheckboxIndeterminate).assertNotRendered();
			});
		});

		it("calls useCommonControlSettings with the given node", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings([]);

			const { useControlSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<CheckboxGroupModule.renderer node={mockNode} />);

			assertCalledWith(useControlSettingsMock, mockNode);
		});

		it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings([]);

			const { useWidgetSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<CheckboxGroupModule.renderer node={getMockNode()} />);

			assertCalledWith(useWidgetSettingsMock, mockControlSettings);
		});

		it("calls useLocalizedEnumerationValues with the given dataReference", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings([]);

			const { useEnumerationValuesMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<CheckboxGroupModule.renderer node={getMockNode()} />);

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
				const mockWidgetSettings = getMockWidgetSettings([]);

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
						<CheckboxGroupModule.renderer node={getMockNode()} />
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

		describe("valueChange", () => {
			it("calls valueChanged from the document context when a new value was selected", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings([
					{ ["multiselect-field-name"]: "value-1" }
				]);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const mockDocContext = mockDocumentContext();

				const { widgetMap } = renderWrapper(
					<DocumentContext.Provider value={mockDocContext}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				);

				assertCallCount(widgetMap.CheckboxGroup, 1);

				const props = query(widgetMap.CheckboxGroup).props();

				props.onValueChanged?.("value-3");

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: [
						{ ["multiselect-field-name"]: "value-1" },
						{ ["multiselect-field-name"]: "value-3" }
					]
				});
			});

			it("calls valueChanged from the document context when a value was de-selected", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings([
					{ ["multiselect-field-name"]: "value-1" },
					{ ["multiselect-field-name"]: "value-3" }
				]);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const mockDocContext = mockDocumentContext();

				const { widgetMap } = renderWrapper(
					<DocumentContext.Provider value={mockDocContext}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				);

				assertCallCount(widgetMap.CheckboxGroup, 1);

				const props = query(widgetMap.CheckboxGroup).props();

				props.onValueChanged?.("value-3");

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: [{ ["multiselect-field-name"]: "value-1" }]
				});
			});

			it("calls valueChanged with all enumeration options when 'select all' was checked", () => {
				const mockControlSettings = getMockControlSettings({ enableSelectAll: true });
				const mockWidgetSettings = getMockWidgetSettings([]);
				const mockEnumerationValues = getMockEnumerationValues();

				setupMocks(mockControlSettings, mockWidgetSettings);

				const mockDocContext = mockDocumentContext();

				const { widgetMap } = renderWrapper(
					<DocumentContext.Provider value={mockDocContext}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				);

				assertCallCount(widgetMap.CheckboxIndeterminate, 1);

				const props = query(widgetMap.CheckboxIndeterminate).props();

				props.onChange(true, {} as MouseEvent);

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: mockEnumerationValues.map(ev => ({
						["multiselect-field-name"]: ev.value
					}))
				});
			});

			it("calls valueChanged with no enumeration options when 'select all' was unchecked", () => {
				const mockControlSettings = getMockControlSettings({ enableSelectAll: true });
				const mockWidgetSettings = getMockWidgetSettings([
					{ ["multiselect-field-name"]: "value-1" },
					{ ["multiselect-field-name"]: "value-2" },
					{ ["multiselect-field-name"]: "value-3" }
				]);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const mockDocContext = mockDocumentContext();

				const { widgetMap } = renderWrapper(
					<DocumentContext.Provider value={mockDocContext}>
						<CheckboxGroupModule.renderer node={getMockNode()} />
					</DocumentContext.Provider>
				);

				const props = query(widgetMap.CheckboxIndeterminate).props();

				props.onChange(false, {} as MouseEvent);

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: []
				});
			});
		});
	});
});

function getMockNode(): CheckboxGroupNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: CHECKBOX_GROUP_TYPE,
		props: {
			elementId: "test-id"
		}
	};
}

function getMockControlSettings(options?: {
	enableSelectAll?: true;
	groupedMessages?: Message[];
	ungroupedMessages?: Message[];
}): BaseControlSettings {
	const { enableSelectAll, groupedMessages, ungroupedMessages } = options ?? {};

	return {
		uiId: "test-id",
		groupedValidationMessages: groupedMessages ?? [],
		ungroupedValidationMessages: ungroupedMessages ?? [],
		dataReference: "/test[1]/path[1]",
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
		enableSelectAll,
		value: undefined
	};
}

function getMockWidgetSettings(value: GroupInstance[]): BaseWidgetSettings {
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
		inline: true,
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

// TODO: maybe remove again if the select all label is not tested
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
