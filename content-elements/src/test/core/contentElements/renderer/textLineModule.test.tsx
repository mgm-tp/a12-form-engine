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

import { TextLineModule } from "../../../../main/core/contentElements/modules/textLine/textLineModule.js";
import type { TextLineNode } from "../../../../main/core/contentElements/modules/textLine/textLineNode.js";
import { TEXT_LINE_TYPE } from "../../../../main/core/contentElements/modules/textLine/textLineNode.js";
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
import { getMockMessage, mockConversionError, mockParseError } from "../../../mocks/mockError.js";
import { setupMockHooks } from "../../../mocks/setupMockHooks.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("TextLine", () => {
		/**
		 * TODO: add more tests for different scenarios? it's only important
		 * here to test that the props are handed to the widget. The values of
		 * the props are not important. We already test almost all props here
		 * (except addonAfter, so another test just for this?).
		 */
		it("renders a BufferedTextLine with the correct properties", () => {
			const mockControlSettings = getMockControlSettings();
			const mockWidgetSettings = getMockWidgetSettings();

			const { componentMap } = setup({
				controlSettings: mockControlSettings,
				widgetSettings: mockWidgetSettings
			});

			const props = query(componentMap.BufferedTextLine).props();

			strictEqual(props["id"], mockControlSettings.uiId);
			strictEqual(props["label"], mockWidgetSettings.label);
			strictEqual(props["readonly"], mockWidgetSettings.readonly);
			strictEqual(props["hideLabel"], mockWidgetSettings.hideLabel);
			strictEqual(props["helperText"], mockWidgetSettings.helperText);
			strictEqual(props["placeholder"], mockControlSettings.placeholder);
			strictEqual(props["suffixes"], mockWidgetSettings.suffixes);
			strictEqual(props["value"], mockWidgetSettings.formattedValue);
			strictEqual(props["error"], mockWidgetSettings.error);
			strictEqual(props["errorMessage"], mockWidgetSettings.errors);
			strictEqual(props["warning"], mockWidgetSettings.warning);
			strictEqual(props["warningMessage"], mockWidgetSettings.warnings);
			strictEqual(props["info"], mockWidgetSettings.info);
			strictEqual(props["infoMessage"], mockWidgetSettings.infos);
			deepStrictEqual(props["inputProps"], mockWidgetSettings.inputProps);
			notStrictEqual(props["inputRef"], undefined);
		});

		describe("Tooltips", () => {
			it("sets tooltips in addOnAfter if tooltipsOnTop is not set", () => {
				const mockWidgetSettings = getMockWidgetSettings();

				const { componentMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.addonAfter, mockWidgetSettings.tooltips);
				strictEqual(props.tooltips, undefined);
			});

			it("sets tooltips in tooltips prop if tooltipsOnTop is set", () => {
				const mockWidgetSettings = getMockWidgetSettings({ tooltipsOnTop: true });

				const { componentMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.addonAfter, undefined);
				strictEqual(props.tooltips, mockWidgetSettings.tooltips);
			});
		});

		describe("ariaDescribedBy", () => {
			it("sets undefined if ariaDescribedBy is empty", () => {
				const { componentMap } = setup();

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.ariaDescribedby, undefined);
			});

			it("converts tokens into a single string if ariaDescribedBy is not empty", () => {
				const mockWidgetSettings = getMockWidgetSettings({
					ariaDescribedBy: ["token1", "token2"]
				});

				const { componentMap } = setup({
					widgetSettings: mockWidgetSettings
				});

				const props = query(componentMap.BufferedTextLine).props();

				strictEqual(props.ariaDescribedby, nmTokensToString(mockWidgetSettings.ariaDescribedBy));
			});
		});

		describe("Value Change", () => {
			it("calls valueChanged from the document context when a valid value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const mockDocContext = mockDocumentContext();

				const { componentMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext,
					localizerContext: getMockLocalization({ parseValue: () => ({ value: 69 }) })
				});

				const props = query(componentMap.BufferedTextLine).props();
				props.onValueSubmit("69");

				assertCalledWith(mockDocContext.event.onValueChanged, {
					path: mockControlSettings.dataReference,
					value: 69,
					userValue: "69"
				});
			});

			it("calls parsingFailed from the document context when an invalid value was entered", () => {
				const mockControlSettings = getMockControlSettings();
				const parseError = mockConversionError();
				const expectedError = mockParseError(parseError, mockControlSettings.dataReference, "abc");
				const mockDocContext = mockDocumentContext();

				const { componentMap } = setup({
					controlSettings: mockControlSettings,
					docContext: mockDocContext,
					localizerContext: getMockLocalization({ parseValue: () => ({ parseError }) })
				});

				const props = query(componentMap.BufferedTextLine).props();
				props.onValueSubmit("abc");

				assertCalledWith(mockDocContext.event.onParsingFailed, {
					dataReference: mockControlSettings.dataReference,
					parseError: expectedError
				});
			});

			it("calls conversion.parseValue with the trimmed value if the input is non-empty", () => {
				const mockControlSettings = getMockControlSettings();
				const mockParseValue = mock.fn(() => ({}));

				const { componentMap } = setup({
					controlSettings: mockControlSettings,
					localizerContext: getMockLocalization({ parseValue: mockParseValue })
				});

				const props = query(componentMap.BufferedTextLine).props();
				props.onValueSubmit("   42   ");

				assertCalledWith(mockParseValue, "42", mockControlSettings.conversionConfig);
			});
		});

		describe("Hooks", () => {
			it("calls useCommonControlSettings with the given node", () => {
				const mockNode = getMockNode();

				const { useControlSettingsMock } = setupMockHooks({
					controlSettings: getMockControlSettings(),
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<TextLineModule.renderer node={mockNode} />);

				assertCalledWith(useControlSettingsMock, mockNode);
			});

			it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
				const mockControlSettings = getMockControlSettings();

				const { useWidgetSettingsMock } = setupMockHooks({
					controlSettings: mockControlSettings,
					widgetSettings: getMockWidgetSettings()
				});

				renderWrapper(<TextLineModule.renderer node={getMockNode()} />);

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

					return renderWrapper(<TextLineModule.renderer node={getMockNode()} />);
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
	node?: TextLineNode;
}) {
	const controlSettings = options?.controlSettings ?? getMockControlSettings();
	const widgetSettings = options?.widgetSettings ?? getMockWidgetSettings();

	setupMockHooks({ controlSettings, widgetSettings });

	const mockDocContext = options?.docContext ?? mockDocumentContext();
	const mockLocalizerContext = options?.localizerContext ?? getMockLocalization();
	const node = options?.node ?? getMockNode();

	return renderWrapper(
		<LocalizerContext.Provider value={mockLocalizerContext}>
			<DocumentContext.Provider value={mockDocContext}>
				<TextLineModule.renderer node={node} />
			</DocumentContext.Provider>
		</LocalizerContext.Provider>
	);
}

function getMockNode(): TextLineNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: TEXT_LINE_TYPE,
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

	return {
		uiId: "test-id",
		placeholder: "test-placeholder",
		groupedValidationMessages: groupedMessages ?? [],
		ungroupedValidationMessages: ungroupedMessages ?? [],
		dmElement: {
			id: "test-element",
			name: "test-name",
			type: "Field",
			fieldType: {
				type: "NumberType"
			}
		},
		dataReference: "/test[1]/path[1]",
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: "NumberType"
		},
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
		readonly: true,
		error: true,
		warning: true,
		info: true,
		errors: "ERRORS",
		warnings: "WARNINGS",
		infos: "INFOS",
		tooltips: "TOOLTIPS",
		tooltipsOnTop: options?.tooltipsOnTop,
		suffixes: "SUFFIXES",
		inputProps: { "aria-required": true },
		ariaDescribedBy: [],
		...(options ?? {})
	};
}
