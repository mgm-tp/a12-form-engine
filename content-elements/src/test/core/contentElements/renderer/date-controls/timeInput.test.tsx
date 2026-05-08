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

import { mock } from "node:test";

import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import { DefaultFunctionMap } from "../../../../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../../../../../main/core/contentElements/functionMap/functionMapContext.js";
import type { DatePickerNode } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { DATE_PICKER_TYPE } from "../../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { TimeInput } from "../../../../../main/core/contentElements/modules/datePicker/inputTypes/timeInput.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../../main/core/index.js";
import type { BaseControlSettings } from "../../../../../main/core/types/controlSettings.js";
import type { BaseWidgetSettings } from "../../../../../main/core/types/widgetSettings.js";
import { assertCallCount, assertCalledWithArgument } from "../../../../assertions.js";
import { getMockMessage } from "../../../../mocks/mockError.js";
import { renderWrapper } from "../../../../rtl-utils/render-wrapper.js";

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

describe("core.contentElements.dateControls", () => {
	describe("TimeInput", () => {
		describe("focus hooks", () => {
			function setupFocusTest(options?: {
				groupedMessages?: Message[];
				ungroupedMessages?: Message[];
			}) {
				const mockControlSettings = getMockControlSettings(options);
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
						<TimeInput node={mockNode} />
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
	});
});

const mockNode: DatePickerNode = {
	id: "test-node-id",
	namespace: FORM_ELEMENTS_NAMESPACE,
	type: DATE_PICKER_TYPE,
	props: {
		elementId: "test-id"
	}
};

function getMockControlSettings(options?: {
	groupedMessages?: Message[];
	ungroupedMessages?: Message[];
}): BaseControlSettings {
	const { groupedMessages, ungroupedMessages } = options ?? {};

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
				type: "TimeType",
				format: "HH:mm:ss"
			}
		},
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: "TimeType",
			format: "HH:mm:ss"
		},
		placeholder: "test-placeholder",
		value: undefined
	};
}

function getMockWidgetSettings(options?: { value?: Date; readonly?: true }): BaseWidgetSettings {
	return {
		value: options?.value,
		formattedValue: "test-value",
		label: "test-label",
		hideLabel: true,
		helperText: "test-helperText",
		readonly: options?.readonly,
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
