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

import { type ChangeEvent } from "react";

import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import { DefaultFunctionMap } from "../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../main/core/contentElements/functionMap/functionMapContext.js";
import { SwitchModule } from "../../../../main/core/contentElements/modules/switch/switchModule.js";
import type { SwitchNode } from "../../../../main/core/contentElements/modules/switch/switchNode.js";
import { SWITCH_TYPE } from "../../../../main/core/contentElements/modules/switch/switchNode.js";
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
		useFocusFieldMock: mock.fn(),
		useFocusFirstErrorMock: mock.fn(),
		useFocusInputMock: mock.fn()
	};
}

describe("core.contentElements", () => {
	describe("Switch", () => {
		it("renders a Switch with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings(false);

			setupMocks(mockControlSettings, mockWidgetSettings);

			const { widgetMap } = renderWrapper(<SwitchModule.renderer node={getMockNode()} />);

			const props = query(widgetMap.Switch).props();

			strictEqual(props["id"], mockControlSettings.uiId);
			strictEqual(props["label"], mockWidgetSettings.label);
			strictEqual(props["uncheckedOption"], mockWidgetSettings.uncheckedLabel);
			strictEqual(props["checkedOption"], mockWidgetSettings.checkedLabel);
			strictEqual(props["readonly"], mockWidgetSettings.readonly);
			strictEqual(props["hideLabel"], mockWidgetSettings.hideLabel);
			strictEqual(props["tooltips"], mockWidgetSettings.tooltips); // TODO: add another test for addonAfter
			strictEqual(props["helperText"], mockWidgetSettings.helperText);
			strictEqual(props["error"], mockWidgetSettings.error);
			strictEqual(props["errorMessage"], mockWidgetSettings.errors);
			strictEqual(props["warning"], mockWidgetSettings.warning);
			strictEqual(props["warningMessage"], mockWidgetSettings.warnings);
			strictEqual(props["info"], mockWidgetSettings.info);
			strictEqual(props["infoMessage"], mockWidgetSettings.infos);
			strictEqual(
				props["inputProps"]?.["aria-required"],
				mockWidgetSettings.inputProps?.["aria-required"]
			);
			notStrictEqual(props["inputProps"]?.ref, undefined);
			strictEqual(props["ariaDescribedby"], nmTokensToString(mockWidgetSettings.ariaDescribedBy)); // TODO: additional test for this post-processing?
		});

		describe("Checked", () => {
			it("sets checked to true when the value is true", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings(true);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SwitchModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Switch).props();

				strictEqual(props["checked"], true);
			});

			it("sets checked to false when the value is false", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings(false);

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SwitchModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Switch).props();

				strictEqual(props["checked"], false);
			});

			it("sets checked to false when the value is undefined", () => {
				const mockControlSettings = getMockControlSettings();
				const mockWidgetSettings = getMockWidgetSettings();

				setupMocks(mockControlSettings, mockWidgetSettings);

				const { widgetMap } = renderWrapper(<SwitchModule.renderer node={getMockNode()} />);

				const props = query(widgetMap.Switch).props();

				strictEqual(props["checked"], false);
			});
		});

		it("calls useCommonControlSettings with the given node", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			const { useControlSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<SwitchModule.renderer node={mockNode} />);

			assertCalledWith(useControlSettingsMock, mockNode);
		});

		it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			const { useWidgetSettingsMock } = setupMocks(mockControlSettings, mockWidgetSettings);

			renderWrapper(<SwitchModule.renderer node={mockNode} />);

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
						<SwitchModule.renderer node={getMockNode()} />
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

		it("calls valueChanged from the document context when a new value was entered", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings, mockWidgetSettings);

			const mockDocContext = mockDocumentContext();

			const { widgetMap } = renderWrapper(
				<DocumentContext.Provider value={mockDocContext}>
					<SwitchModule.renderer node={mockNode} />
				</DocumentContext.Provider>
			);

			const props = query(widgetMap.Switch).props();

			props.onChange(true, {} as ChangeEvent<HTMLInputElement>);

			assertCalledWith(mockDocContext.event.onValueChanged, {
				path: mockControlSettings.dataReference,
				value: true
			});
		});

		it("calls valueChanged from the document context with the value 'null' when a confirm field was switched off", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings({ confirm: true });
			const mockWidgetSettings = getMockWidgetSettings();

			setupMocks(mockControlSettings, mockWidgetSettings);

			const mockDocContext = mockDocumentContext();

			const { widgetMap } = renderWrapper(
				<DocumentContext.Provider value={mockDocContext}>
					<SwitchModule.renderer node={mockNode} />
				</DocumentContext.Provider>
			);

			const props = query(widgetMap.Switch).props();

			props.onChange(false, {} as ChangeEvent<HTMLInputElement>);

			assertCalledWith(mockDocContext.event.onValueChanged, {
				path: mockControlSettings.dataReference,
				value: null
			});
		});
	});
});

function getMockNode(): SwitchNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: SWITCH_TYPE,
		props: {
			elementId: "test-id"
		}
	};
}

function getMockControlSettings(options?: {
	confirm?: true;
	groupedMessages?: Message[];
	ungroupedMessages?: Message[];
}): BaseControlSettings {
	const { confirm, groupedMessages, ungroupedMessages } = options ?? {};

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
				type: confirm ? "ConfirmType" : "BooleanType"
			}
		},
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: confirm ? "ConfirmType" : "BooleanType"
		},
		value: undefined
	};
}

function getMockWidgetSettings(value?: boolean): BaseWidgetSettings {
	return {
		value,
		label: "test-label",
		uncheckedLabel: "test-uncheckedLabel",
		checkedLabel: "test-checkedLabel",
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
		inputProps: { "aria-required": true },
		ariaDescribedBy: ["test-aria1", "test-aria2"]
	};
}
