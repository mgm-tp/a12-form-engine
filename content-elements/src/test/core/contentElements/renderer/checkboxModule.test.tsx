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

import type { ChangeEvent } from "react";

import {
	DocumentContext,
	TableScreenReaderContextProvider
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { CheckboxModule } from "../../../../main/core/contentElements/modules/checkbox/checkboxModule.js";
import type { CheckboxNode } from "../../../../main/core/contentElements/modules/checkbox/checkboxNode.js";
import { CHECKBOX_TYPE } from "../../../../main/core/contentElements/modules/checkbox/checkboxNode.js";
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
import { setupMockHooks } from "../../../mocks/setupMockHooks.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("Checkbox", () => {
		it("renders a Checkbox with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings({ value: false });

			const { widgetMap } = setup({
				controlSettings: mockControlSettings,
				widgetSettings: mockWidgetSettings
			});

			const props = query(widgetMap.Checkbox).props();

			strictEqual(props["id"], mockControlSettings.uiId);
			strictEqual(props["label"], mockWidgetSettings.label);
			strictEqual(props["readonly"], mockWidgetSettings.readonly);
			strictEqual(props["hideLabel"], mockWidgetSettings.hideLabel);
			strictEqual(props["tooltips"], mockWidgetSettings.tooltips);
			strictEqual(props["breakTooltipsToNewLine"], mockWidgetSettings.tooltipsOnTop);
			strictEqual(props["helperText"], mockWidgetSettings.helperText);
			strictEqual(props["error"], mockWidgetSettings.error);
			strictEqual(props["errorMessage"], mockWidgetSettings.errors);
			strictEqual(props["warning"], mockWidgetSettings.warning);
			strictEqual(props["warningMessage"], mockWidgetSettings.warnings);
			strictEqual(props["info"], mockWidgetSettings.info);
			strictEqual(props["infoMessage"], mockWidgetSettings.infos);
			strictEqual(props["inputProps"], mockWidgetSettings.inputProps);
			notStrictEqual(props["inputRef"], undefined);
		});

		describe("ariaDescribedBy", () => {
			it("sets undefined if ariaDescribedBy is empty", () => {
				const { widgetMap } = setup();

				const props = query(widgetMap.Checkbox).props();

				strictEqual(props.ariaDescribedby, undefined);
			});

			it("converts tokens into a single string if ariaDescribedBy is not empty", () => {
				const mockWidgetSettings = getMockWidgetSettings({
					ariaDescribedBy: ["token1", "token2"]
				});

				const { widgetMap } = setup({ widgetSettings: mockWidgetSettings });

				const props = query(widgetMap.Checkbox).props();

				strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy));
			});
		});

		it("renders a Checkbox with aria-labelledby when cellId is present", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			setupMockHooks({ controlSettings: mockControlSettings, widgetSettings: mockWidgetSettings });

			const mockCellId = "another-id";

			const { widgetMap } = renderWrapper(
				<TableScreenReaderContextProvider screenReaderCellId={mockCellId}>
					<CheckboxModule.renderer node={getMockNode()} />
				</TableScreenReaderContextProvider>
			);

			const props = query(widgetMap.Checkbox).props();

			deepStrictEqual(props["inputProps"], {
				...mockWidgetSettings.inputProps,
				"aria-labelledby": `${mockControlSettings.uiId} ${mockCellId}`
			});
		});

		describe("Checked", () => {
			it("sets checked to true when the value is true", () => {
				const { widgetMap } = setup({ widgetSettings: getMockWidgetSettings({ value: true }) });

				const props = query(widgetMap.Checkbox).props();

				strictEqual(props["checked"], true);
			});

			it("sets checked to false when the value is false", () => {
				const { widgetMap } = setup({ widgetSettings: getMockWidgetSettings({ value: false }) });

				const props = query(widgetMap.Checkbox).props();

				strictEqual(props["checked"], false);
			});

			it("sets checked to false when the value is undefined", () => {
				const { widgetMap } = setup();

				const props = query(widgetMap.Checkbox).props();

				strictEqual(props["checked"], false);
			});
		});

		describe("Value Change", () => {
			it("calls valueChanged from the document context when a new value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext
				});

				const props = query(widgetMap.Checkbox).props();
				props.onChange(true, {} as ChangeEvent<HTMLInputElement>);

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: true
				});
			});

			it("calls valueChanged from the document context with the value 'null' when a confirm field was de-selected", () => {
				const mockControlSettings = getMockControlSettings({ confirm: true });
				const mockDocContext = mockDocumentContext();

				const { widgetMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext
				});

				const props = query(widgetMap.Checkbox).props();
				props.onChange(false, {} as ChangeEvent<HTMLInputElement>);

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: null
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

				renderWrapper(<CheckboxModule.renderer node={mockNode} />);

				assertCalledWith(useControlSettingsMock, mockNode);
			});

			it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
				const mockControlSettings = getMockControlSettings();

				const { useWidgetSettingsMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<CheckboxModule.renderer node={getMockNode()} />);

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

					return renderWrapper(<CheckboxModule.renderer node={getMockNode()} />);
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
	node?: CheckboxNode;
}) {
	const controlSettings = options?.controlSettings ?? getMockControlSettings();
	const widgetSettings = options?.widgetSettings ?? getMockWidgetSettings();

	setupMockHooks({ controlSettings, widgetSettings });

	const mockDocContext = options?.docContext ?? mockDocumentContext();
	const node = options?.node ?? getMockNode();

	return renderWrapper(
		<DocumentContext.Provider value={mockDocContext}>
			<CheckboxModule.renderer node={node} />
		</DocumentContext.Provider>
	);
}

function getMockNode(): CheckboxNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: CHECKBOX_TYPE,
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
		inputProps: { "aria-required": true },
		ariaDescribedBy: [],
		...(options ?? {})
	};
}
