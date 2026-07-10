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

import type { MouseEvent, PropsWithChildren, ReactElement } from "react";

import { DataReference } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import type { EnumerationItem } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
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
import { getMockLocalization } from "../../../mocks/getMockLocalization.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../mocks/mockError.js";
import { setupMockHooks } from "../../../mocks/setupMockHooks.js";
import {
	getReactElementName,
	isReactElement,
	isReactElementArray
} from "../../../react-element-utils.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("CheckboxGroup", () => {
		it("renders a CheckboxGroup with the correct properties", () => {
			const mockControlSettings = getMockControlSettings({ enableSelectAll: true });
			const mockWidgetSettings = getMockWidgetSettings({
				value: [{ ["multiselect-field-name"]: "value-1" }]
			});

			const { widgetMap } = setup({
				controlSettings: mockControlSettings,
				widgetSettings: mockWidgetSettings
			});

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
		});

		describe("ariaDescribedBy", () => {
			it("sets undefined if ariaDescribedBy is empty", () => {
				const { widgetMap } = setup({ widgetSettings: getMockWidgetSettings({ value: [] }) });

				const props = query(widgetMap.CheckboxGroup).props();

				strictEqual(props.ariaDescribedby, undefined);
			});

			it("converts tokens into a single string if ariaDescribedBy is not empty", () => {
				const mockWidgetSettings = getMockWidgetSettings({
					value: [],
					ariaDescribedBy: ["token1", "token2"]
				});

				const { widgetMap } = setup({ widgetSettings: mockWidgetSettings });

				const props = query(widgetMap.CheckboxGroup).props();

				strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy));
			});
		});

		describe("CheckboxGroup Children", () => {
			it("hands CheckboxGroupItems for all enumeration options to the CheckboxGroup widget", () => {
				const mockEnumerationValues = getMockEnumerationValues();

				const { widgetMap } = setup({
					widgetSettings: getMockWidgetSettings({
						value: [{ ["multiselect-field-name"]: "value-1" }]
					}),
					enumerationValues: mockEnumerationValues
				});

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
				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({ enableSelectAll: true }),
					widgetSettings: getMockWidgetSettings({
						value: [
							{ ["multiselect-field-name"]: "value-1" },
							{ ["multiselect-field-name"]: "value-2" },
							{ ["multiselect-field-name"]: "value-3" }
						]
					})
				});

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
				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({ enableSelectAll: true }),
					widgetSettings: getMockWidgetSettings({
						value: [{ ["multiselect-field-name"]: "value-3" }]
					})
				});

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
				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({ enableSelectAll: true })
				});

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
				const { widgetMap } = setup();

				query(widgetMap.CheckboxIndeterminate).assertNotRendered();
			});
		});

		describe("Value Change", () => {
			it("calls valueChanged from the document context when a new value was selected", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings({
					value: [{ ["multiselect-field-name"]: "value-1" }]
				});
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					widgetSettings: mockWidgetSettings,
					docContext: mockDocContext
				});

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
				const mockWidgetSettings = getMockWidgetSettings({
					value: [
						{ ["multiselect-field-name"]: "value-1" },
						{ ["multiselect-field-name"]: "value-3" }
					]
				});
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					widgetSettings: mockWidgetSettings,
					docContext: mockDocContext
				});

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
				const mockWidgetSettings = getMockWidgetSettings({ value: [] });
				const mockEnumerationValues = getMockEnumerationValues();
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					widgetSettings: mockWidgetSettings,
					docContext: mockDocContext
				});

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
				const mockWidgetSettings = getMockWidgetSettings({
					value: [
						{ ["multiselect-field-name"]: "value-1" },
						{ ["multiselect-field-name"]: "value-2" },
						{ ["multiselect-field-name"]: "value-3" }
					]
				});
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					widgetSettings: mockWidgetSettings,
					docContext: mockDocContext
				});

				const props = query(widgetMap.CheckboxIndeterminate).props();

				props.onChange(false, {} as MouseEvent);

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: []
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

				renderWrapper(<CheckboxGroupModule.renderer node={mockNode} />);

				assertCalledWith(useControlSettingsMock, mockNode);
			});

			it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
				const mockControlSettings = getMockControlSettings();

				const { useWidgetSettingsMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<CheckboxGroupModule.renderer node={getMockNode()} />);

				assertCalledWith(useWidgetSettingsMock, mockControlSettings);
			});

			it("calls useLocalizedEnumerationValues with the given dataReference", () => {
				const mockControlSettings = getMockControlSettings();

				const { useEnumerationValuesMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

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
					const mockWidgetSettings = getMockWidgetSettings();

					setupMockHooks({
						controlSettings: mockControlSettings,
						widgetSettings: mockWidgetSettings
					});

					return renderWrapper(<CheckboxGroupModule.renderer node={getMockNode()} />);
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
				<CheckboxGroupModule.renderer node={node} />
			</DocumentContext.Provider>
		</LocalizerContext.Provider>
	);
}

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

function getMockWidgetSettings(options?: Partial<BaseWidgetSettings>): BaseWidgetSettings {
	return {
		value: undefined,
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
