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

import type { ParseError } from "@com.mgmtp.a12.client/client-data";
import { DocumentPath, KernelMessage } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import { DefaultFunctionMap } from "../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../main/core/contentElements/functionMap/functionMapContext.js";
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
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../mocks/mockError.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

function setupMocks(controlSettings = getMockControlSettings()) {
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
		useFocusFieldMock: mock.fn(),
		useFocusFirstErrorMock: mock.fn(),
		useFocusInputMock: mock.fn()
	};
}

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

			setupMocks();

			const { componentMap } = renderWrapper(<TextLineModule.renderer node={getMockNode()} />);

			const props = query(componentMap.BufferedTextLine).props();

			strictEqual(props["id"], mockControlSettings.uiId);
			strictEqual(props["label"], mockWidgetSettings.label);
			strictEqual(props["readonly"], mockWidgetSettings.readonly);
			strictEqual(props["hideLabel"], mockWidgetSettings.hideLabel);
			strictEqual(props["addonAfter"], undefined);
			strictEqual(props["tooltips"], mockWidgetSettings.tooltips);
			strictEqual(props["helperText"], mockWidgetSettings.helperText);
			strictEqual(props["placeholder"], mockControlSettings.placeholder); // TODO: why is the placeholder the only localized text, that's not in the widget settings?
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
			strictEqual(props["ariaDescribedby"], nmTokensToString(mockWidgetSettings.ariaDescribedBy)); // TODO: additional test for this post-processing?
		});

		it("calls useCommonControlSettings with the given node", () => {
			const mockNode = getMockNode();

			const { useControlSettingsMock } = setupMocks();

			renderWrapper(<TextLineModule.renderer node={mockNode} />);

			assertCalledWith(useControlSettingsMock, mockNode);
		});

		it("calls useCommonWidgetSettings with the result from useCommonControlSettings", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();

			const { useWidgetSettingsMock } = setupMocks();

			renderWrapper(<TextLineModule.renderer node={mockNode} />);

			assertCalledWith(useWidgetSettingsMock, mockControlSettings);
		});

		describe("focus hooks", () => {
			function setupFocusTest(options?: {
				groupedMessages?: Message[];
				ungroupedMessages?: Message[];
			}) {
				const { useFocusFieldMock, useFocusFirstErrorMock, useFocusInputMock } = setupMocks(
					getMockControlSettings(options)
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
						<TextLineModule.renderer node={getMockNode()} />
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
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();

			setupMocks();

			const mockDocContext = mockDocumentContext();

			const { componentMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization(() => ({ value: 69 }))}>
					<DocumentContext.Provider value={mockDocContext}>
						<TextLineModule.renderer node={mockNode} />
					</DocumentContext.Provider>
				</LocalizerContext.Provider>
			);

			const props = query(componentMap.BufferedTextLine).props();
			props.onValueSubmit("69");

			assertCalledWith(mockDocContext.event.onValueChanged, {
				path: mockControlSettings.dataReference,
				value: 69,
				userValue: "69"
			});
		});

		it("calls parsingFailed from the document context when an invalid value was entered", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();

			setupMocks();

			const parseError: ValueConversion.ParseError = {
				errorCode: "",
				errorKey: "",
				errorText: { key: "" },
				severity: "ERROR" as const
			};

			const expectedError: ParseError = {
				message: {
					errorCode: parseError.errorCode,
					errorText: [parseError.errorText],
					severity: "ERROR",
					messageType: "VALUE_ERROR",
					entityInstance: DocumentPath.fromString(mockControlSettings.dataReference),
					referencedFields: [DocumentPath.fromString(mockControlSettings.dataReference)],
					rulePath: KernelMessage.FORMAL_VALIDATION,
					refOmissionErrorResponsible: []
				},
				value: "abc"
			};

			const mockDocContext = mockDocumentContext();

			const { componentMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization(() => ({ parseError }))}>
					<DocumentContext.Provider value={mockDocContext}>
						<TextLineModule.renderer node={mockNode} />
					</DocumentContext.Provider>
				</LocalizerContext.Provider>
			);

			const props = query(componentMap.BufferedTextLine).props();
			props.onValueSubmit("abc");

			assertCalledWith(mockDocContext.event.onParsingFailed, {
				dataReference: mockControlSettings.dataReference,
				parseError: expectedError
			});
		});

		it("calls conversion.parseValue with the trimmed value if the input is non-empty", () => {
			const mockNode = getMockNode();
			const mockControlSettings = getMockControlSettings();

			setupMocks();

			const mockParseValue = mock.fn(() => ({}));

			const { componentMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization(mockParseValue)}>
					<DocumentContext.Provider value={mockDocumentContext()}>
						<TextLineModule.renderer node={mockNode} />
					</DocumentContext.Provider>
				</LocalizerContext.Provider>
			);

			const props = query(componentMap.BufferedTextLine).props();
			props.onValueSubmit("   42   ");

			assertCalledWith(mockParseValue, "42", mockControlSettings.conversionConfig);
		});
	});
});

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

function getMockWidgetSettings(): BaseWidgetSettings {
	return {
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
		tooltipsOnTop: true,
		suffixes: "SUFFIXES",
		inputProps: { "aria-required": true },
		ariaDescribedBy: ["test-aria1", "test-aria2"],
		value: undefined
	};
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
