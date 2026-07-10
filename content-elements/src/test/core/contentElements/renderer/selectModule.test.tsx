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

import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { LocalizerContextProps } from "@com.mgmtp.a12.utils/utils-localization-react";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core";

import type { EnumerationItem } from "../../../../main/core/contentElements/elementConfiguration/useLocalizedEnumerationValues.js";
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
import { getMockLocalization } from "../../../mocks/getMockLocalization.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../mocks/mockError.js";
import { setupMockHooks } from "../../../mocks/setupMockHooks.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("Select", () => {
		it("renders a Select with the correct properties", () => {
			const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
			const mockWidgetSettings = getMockWidgetSettings({ value: "false" });

			const { widgetMap } = setup({
				controlSettings: mockControlSettings,
				widgetSettings: mockWidgetSettings
			});

			const props = query(widgetMap.Select).props();

			strictEqual(props["id"], mockControlSettings.uiId);
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
			notStrictEqual(props["selectRef"], undefined);
		});

		describe("Value", () => {
			it("sets value to the selected value for enumeration fields", () => {
				const mockWidgetSettings = getMockWidgetSettings({ value: "false" });

				const { widgetMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(widgetMap.Select).props();
				strictEqual(props["value"], mockWidgetSettings.value);
			});

			it("sets value to the stringified value for boolean fields", () => {
				const mockWidgetSettings = getMockWidgetSettings({ value: false });

				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({ fieldType: "BooleanType" }),
					widgetSettings: mockWidgetSettings
				});

				const props = query(widgetMap.Select).props();
				strictEqual(props["value"], "" + mockWidgetSettings.value);
			});

			it("sets value to the empty string if no value was given", () => {
				const { widgetMap } = setup();

				const props = query(widgetMap.Select).props();
				strictEqual(props["value"], "");
			});
		});

		describe("ariaDescribedBy", () => {
			it("sets undefined if ariaDescribedBy is empty", () => {
				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({ fieldType: "BooleanType" })
				});

				const props = query(widgetMap.Select).props();

				strictEqual(props.ariaDescribedby, undefined);
			});

			it("converts tokens into a single string if ariaDescribedBy is not empty", () => {
				const mockWidgetSettings = getMockWidgetSettings({
					ariaDescribedBy: ["token1", "token2"]
				});

				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({ fieldType: "BooleanType" }),
					widgetSettings: mockWidgetSettings
				});

				const props = query(widgetMap.Select).props();

				strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy));
			});
		});

		describe("Placeholder", () => {
			it("hands placeholder to the Select widget if no value is given", () => {
				const mockControlSettings = getMockControlSettings({
					fieldType: "EnumerationType",
					placeholder: "test-placeholder"
				});

				const { widgetMap } = setup({
					controlSettings: mockControlSettings
				});

				const props = query(widgetMap.Select).props();

				strictEqual(props["placeholder"], mockControlSettings.placeholder);
			});

			it("does not hand placeholder to the Select widget if a value is given", () => {
				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({
						fieldType: "EnumerationType",
						placeholder: "test-placeholder"
					}),
					widgetSettings: getMockWidgetSettings({ value: "false" })
				});

				const props = query(widgetMap.Select).props();

				strictEqual(props["placeholder"], undefined);
			});
		});

		describe("Enumeration options", () => {
			it("adds an empty option to the enumeration options if a value is given", () => {
				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({
						fieldType: "EnumerationType",
						placeholder: "test-placeholder"
					}),
					widgetSettings: getMockWidgetSettings({ value: "false" })
				});

				const props = query(widgetMap.Select).props();

				deepStrictEqual(props["items"], getMockSelectItems(true));
			});

			it("adds an empty option to the enumeration options if no placeholder is defined", () => {
				const { widgetMap } = setup();

				const props = query(widgetMap.Select).props();

				deepStrictEqual(props["items"], getMockSelectItems(true));
			});

			it("does not add an empty option to the enumeration options if no value is given, but a placeholder is defined", () => {
				const { widgetMap } = setup({
					controlSettings: getMockControlSettings({
						fieldType: "EnumerationType",
						placeholder: "test-placeholder"
					})
				});

				const props = query(widgetMap.Select).props();

				deepStrictEqual(props["items"], getMockSelectItems());
			});
		});

		describe("Value Change", () => {
			it("calls valueChanged from the document context when a valid value was entered", () => {
				const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext
				});

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
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext
				});

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
				const mockParseValue = mock.fn(() => ({ value: true }));

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					localizerContext: getMockLocalization({ parseValue: mockParseValue })
				});

				const props = query(widgetMap.Select).props();

				props.onValueChanged?.("true");

				assertCalledWith(mockParseValue, "true", mockControlSettings.conversionConfig);
			});

			it("does not call conversion.parseValue with the new value for fields of type enumeration", () => {
				const mockParseValue = mock.fn(() => ({}));

				const { widgetMap } = setup({
					localizerContext: getMockLocalization({ parseValue: mockParseValue })
				});

				const props = query(widgetMap.Select).props();

				props.onValueChanged?.("true");

				assertCallCount(mockParseValue, 0);
			});
		});

		describe("Hooks", () => {
			it("calls useCommonControlSettings with the given node", () => {
				const mockNode = getMockNode();

				const { useControlSettingsMock } = setupMockHooks({
					controlSettings: getMockControlSettings({ fieldType: "EnumerationType" }),
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<SelectModule.renderer node={mockNode} />);

				assertCalledWith(useControlSettingsMock, mockNode);
			});

			it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
				const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });

				const { useWidgetSettingsMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<SelectModule.renderer node={getMockNode()} />);

				assertCalledWith(useWidgetSettingsMock, mockControlSettings);
			});

			it("calls useLocalizedEnumerationValues with the given dataReference", () => {
				const mockControlSettings = getMockControlSettings({ fieldType: "EnumerationType" });

				const { useEnumerationValuesMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<SelectModule.renderer node={getMockNode()} />);

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

					setupMockHooks({
						controlSettings: mockControlSettings,
						widgetSettings: mockWidgetSettings
					});

					return renderWrapper(<SelectModule.renderer node={getMockNode()} />);
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
	node?: SelectNode;
}) {
	const controlSettings =
		options?.controlSettings ?? getMockControlSettings({ fieldType: "EnumerationType" });
	const widgetSettings = options?.widgetSettings ?? getMockWidgetSettings();
	const enumerationValues = getMockEnumerationValues();

	setupMockHooks({ controlSettings, widgetSettings, enumerationValues });

	const mockDocContext = options?.docContext ?? mockDocumentContext();
	const mockLocalizerContext = options?.localizerContext ?? getMockLocalization();
	const node = options?.node ?? getMockNode();

	return renderWrapper(
		<LocalizerContext.Provider value={mockLocalizerContext}>
			<DocumentContext.Provider value={mockDocContext}>
				<SelectModule.renderer node={node} />
			</DocumentContext.Provider>
		</LocalizerContext.Provider>
	);
}

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
