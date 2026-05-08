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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	EntityInstancePath,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonWidgetSettings.js";
import type { BaseControlSettings } from "../../../../main/core/types/controlSettings.js";
import { getReactElementName, isReactElement } from "../../../react-element-utils.js";
import { renderHookWrapper, renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements.elementConfiguration", () => {
	describe("useCommonWidgetSettings", () => {
		it("returns some control settings unchanged", () => {
			const mockControlSettings: BaseControlSettings = {
				...getMockControlSettings(),
				value: "test-value",
				formattedValue: "test-formatted-value",
				messageGroupId: "test-messageGroupId",
				required: true,
				readonly: true,
				label: "test-label",
				hideLabel: true,
				hint: "test-hint",
				helperText: "test-helperText",
				showMessagesAsTooltip: true,
				tooltipsOnTop: true,
				placeholder: "test-placeholder",
				autoComplete: "email",
				autoExpand: true,
				secret: true,
				suffix: "test-suffix",
				truncateSuffix: true,
				uncheckedLabel: "test-unchecked-label",
				checkedLabel: "test-checked-label",
				timeZone: "Europe/Berlin",
				datePickerConfig: {},
				enableSelectAll: true,
				inline: true
			};

			const { result } = renderHookWrapper(() =>
				USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
			);

			strictEqual(result.current.value, mockControlSettings.value);
			strictEqual(result.current.formattedValue, mockControlSettings.formattedValue);
			strictEqual(result.current.readonly, mockControlSettings.readonly);
			strictEqual(result.current.label, mockControlSettings.label);
			strictEqual(result.current.hideLabel, mockControlSettings.hideLabel);
			strictEqual(result.current.helperText, mockControlSettings.helperText);
			strictEqual(result.current.tooltipsOnTop, mockControlSettings.tooltipsOnTop);
			strictEqual(result.current.uncheckedLabel, mockControlSettings.uncheckedLabel);
			strictEqual(result.current.checkedLabel, mockControlSettings.checkedLabel);
			strictEqual(result.current.inline, mockControlSettings.inline);
		});

		describe("Suffix", () => {
			it("returns the pre-rendered suffix in a Suffix component if a suffix is given", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					suffix: "test-suffix",
					truncateSuffix: true
				};

				const DummyComponent = () =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings).suffixes;

				const { componentMap } = renderWrapper(<DummyComponent />);

				const suffixProps = query(componentMap.Suffix).props();

				deepStrictEqual(suffixProps, {
					id: "test-id-suffix",
					suffix: "test-suffix",
					truncateSuffix: true
				});
			});

			it("does not return a pre-rendered suffix if no suffix is given", () => {
				const mockControlSettings = getMockControlSettings();

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				strictEqual(result.current.suffixes, undefined);
			});
		});

		describe("Messages", () => {
			describe("errors", () => {
				it("returns error === true if grouped errors are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: [getMockMessage()]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.error, true);
				});

				it("returns error === true if ungrouped errors are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [getMockMessage()]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.error, true);
				});

				it("returns error === false if no grouped/ungrouped errors are given", () => {
					const mockControlSettings = getMockControlSettings();

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.error, false);
				});

				it("returns the pre-rendered errors in a ValidationMessages component if ungrouped errors are given", () => {
					const mockError = getMockMessage();
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [mockError]
					};

					const DummyComponent = () =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings).errors;

					const { componentMap } = renderWrapper(<DummyComponent />);

					const validationMessagesProps = query(componentMap.ValidationMessages).props();

					deepStrictEqual(validationMessagesProps, {
						id: `${mockControlSettings.uiId}-error`,
						messages: [mockError.errorText]
					});
				});

				it("does not return a pre-rendered error if no ungrouped errors are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: [getMockMessage()]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.errors, undefined);
				});
			});

			describe("warnings", () => {
				it("returns warning === true if grouped warnings are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: [getMockMessage({ severity: "WARNING" })]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.warning, true);
				});

				it("returns warning === true if ungrouped warnings are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [getMockMessage({ severity: "WARNING" })]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.warning, true);
				});

				it("returns warning === false if no grouped/ungrouped warnings are given", () => {
					const mockControlSettings = getMockControlSettings();

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.warning, false);
				});

				it("returns the pre-rendered warnings in a ValidationMessages component if ungrouped warnings are given", () => {
					const mockWarning = getMockMessage({ severity: "WARNING" });
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [mockWarning]
					};

					const DummyComponent = () =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
							.warnings;

					const { componentMap } = renderWrapper(<DummyComponent />);

					const validationMessagesProps = query(componentMap.ValidationMessages).props();

					deepStrictEqual(validationMessagesProps, {
						id: `${mockControlSettings.uiId}-warning`,
						messages: [mockWarning.errorText]
					});
				});

				it("does not return a pre-rendered warning if no ungrouped warnings are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: [getMockMessage({ severity: "WARNING" })]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.warnings, undefined);
				});
			});

			describe("infos", () => {
				it("returns info === true if grouped infos are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: [getMockMessage({ severity: "INFO" })]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.info, true);
				});

				it("returns info === true if ungrouped infos are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [getMockMessage({ severity: "INFO" })]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.info, true);
				});

				it("returns info === false if no grouped/ungrouped infos are given", () => {
					const mockControlSettings = getMockControlSettings();

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.info, false);
				});

				it("returns the pre-rendered infos in a ValidationMessages component if ungrouped infos are given", () => {
					const mockInfo = getMockMessage({ severity: "INFO" });
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [mockInfo]
					};

					const DummyComponent = () =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings).infos;

					const { componentMap } = renderWrapper(<DummyComponent />);

					const validationMessagesProps = query(componentMap.ValidationMessages).props();

					deepStrictEqual(validationMessagesProps, {
						id: `${mockControlSettings.uiId}-info`,
						messages: [mockInfo.errorText]
					});
				});

				it("does not return a pre-rendered info if no ungrouped infos are given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: [getMockMessage({ severity: "INFO" })]
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					strictEqual(result.current.infos, undefined);
				});
			});
		});

		describe("Tooltips", () => {
			it("returns the pre-rendered tooltips in a Tooltips component if a hint is given", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					hint: "test-hint"
				};

				const DummyComponent = () =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings).tooltips;

				const { componentMap } = renderWrapper(<DummyComponent />);

				const tooltipsProps = query(componentMap.Tooltips).props();

				deepStrictEqual(tooltipsProps, {
					hintTooltip: {
						id: `${mockControlSettings.uiId}-hint-tooltip`,
						content: mockControlSettings.hint
					}
				});
			});

			it("returns the pre-rendered tooltips in a Tooltips component if an ungrouped error is given and showMessagesAsTooltip is set", () => {
				const mockError = getMockMessage({ severity: "ERROR" });
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					ungroupedValidationMessages: [mockError],
					showMessagesAsTooltip: true
				};

				const DummyComponent = () =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings).tooltips;

				const { componentMap } = renderWrapper(<DummyComponent />);

				const tooltipsProps = query(componentMap.Tooltips).props();

				const errorTooltip =
					isReactElement(tooltipsProps.errorTooltip?.content) &&
					getReactElementName(tooltipsProps.errorTooltip?.content) === "ValidationMessagesMock"
						? tooltipsProps.errorTooltip.content
						: undefined;

				deepStrictEqual(errorTooltip?.props["messages"], [mockError.errorText]);
			});

			it("returns the pre-rendered tooltips in a Tooltips component if an ungrouped warning is given and showMessagesAsTooltip is set", () => {
				const mockWarning = getMockMessage({ severity: "WARNING" });
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					ungroupedValidationMessages: [mockWarning],
					showMessagesAsTooltip: true
				};

				const DummyComponent = () =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings).tooltips;

				const { componentMap } = renderWrapper(<DummyComponent />);

				const tooltipsProps = query(componentMap.Tooltips).props();

				const warningTooltip =
					isReactElement(tooltipsProps.warningTooltip?.content) &&
					getReactElementName(tooltipsProps.warningTooltip?.content) === "ValidationMessagesMock"
						? tooltipsProps.warningTooltip.content
						: undefined;

				deepStrictEqual(warningTooltip?.props["messages"], [mockWarning.errorText]);
			});

			it("returns the pre-rendered tooltips in a Tooltips component if an ungrouped info is given and showMessagesAsTooltip is set", () => {
				const mockInfo = getMockMessage({ severity: "INFO" });
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					ungroupedValidationMessages: [mockInfo],
					showMessagesAsTooltip: true
				};

				const DummyComponent = () =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings).tooltips;

				const { componentMap } = renderWrapper(<DummyComponent />);

				const tooltipsProps = query(componentMap.Tooltips).props();

				const infoTooltip =
					isReactElement(tooltipsProps.infoTooltip?.content) &&
					getReactElementName(tooltipsProps.infoTooltip?.content) === "ValidationMessagesMock"
						? tooltipsProps.infoTooltip.content
						: undefined;

				deepStrictEqual(infoTooltip?.props["messages"], [mockInfo.errorText]);
			});

			it("does not return pre-rendered tooltips if no hint and no ungrouped messages are given", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					groupedValidationMessages: [
						getMockMessage({ severity: "ERROR" }),
						getMockMessage({ severity: "WARNING" }),
						getMockMessage({ severity: "INFO" })
					],
					showMessagesAsTooltip: true
				};

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				strictEqual(result.current.tooltips, undefined);
			});

			it("does not return pre-rendered tooltips if no hint is given and showMessagesAsTooltip is not set", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					ungroupedValidationMessages: [
						getMockMessage({ severity: "ERROR" }),
						getMockMessage({ severity: "WARNING" }),
						getMockMessage({ severity: "INFO" })
					]
				};

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				strictEqual(result.current.tooltips, undefined);
			});
		});

		describe("ariaDescribedBy", () => {
			it("returns an empty array by default", () => {
				const mockControlSettings: BaseControlSettings = getMockControlSettings();

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				deepStrictEqual(result.current.ariaDescribedBy, []);
			});

			// TODO: mock ID generation?
			it("returns an array containing the hint tooltip ID if a hint is given", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					hint: "test-hint"
				};

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				deepStrictEqual(result.current.ariaDescribedBy, ["test-id-hint-tooltip"]);
			});

			it("returns an entry for every given grouped validation message if a messageGroupId is set", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					messageGroupId: "test-messageGroupId",
					groupedValidationMessages: [
						getMockMessage({
							entityInstance: DocumentPath.fromString("/test[1]/field1[1]"),
							rulePath: "/test/rule1"
						}),
						getMockMessage({
							entityInstance: DocumentPath.fromString("/test[1]/field1[1]"),
							rulePath: "/test/rule2"
						})
					]
				};

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);

				deepStrictEqual(result.current.ariaDescribedBy, [
					"test-id-prefix-test-messageGroupId-/test[1]/field1[1]-/test/rule1",
					"test-id-prefix-test-messageGroupId-/test[1]/field1[1]-/test/rule2"
				]);
			});

			describe("showMessagesAsTooltip === true", () => {
				it("returns an entry for the error tooltip if an ungrouped error message is given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [getMockMessage()],
						showMessagesAsTooltip: true
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					deepStrictEqual(result.current.ariaDescribedBy, ["test-id-errors-tooltip"]);
				});

				it("returns an entry for the warning tooltip if an ungrouped warning message is given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [getMockMessage({ severity: "WARNING" })],
						showMessagesAsTooltip: true
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					deepStrictEqual(result.current.ariaDescribedBy, ["test-id-warnings-tooltip"]);
				});

				it("returns an entry for the info tooltip if an ungrouped info message is given", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						ungroupedValidationMessages: [getMockMessage({ severity: "INFO" })],
						showMessagesAsTooltip: true
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					deepStrictEqual(result.current.ariaDescribedBy, ["test-id-infos-tooltip"]);
				});

				it("does not return entries for grouped messages", () => {
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: [
							getMockMessage(),
							getMockMessage({ severity: "WARNING" }),
							getMockMessage({ severity: "INFO" })
						],
						showMessagesAsTooltip: true
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					deepStrictEqual(result.current.ariaDescribedBy, []);
				});
			});

			describe("showMessagesAsTooltip === undefined", () => {
				it("does not return entries for grouped or ungrouped messages", () => {
					const mockMessages = [
						getMockMessage(),
						getMockMessage({ severity: "WARNING" }),
						getMockMessage({ severity: "INFO" })
					];
					const mockControlSettings: BaseControlSettings = {
						...getMockControlSettings(),
						groupedValidationMessages: mockMessages,
						ungroupedValidationMessages: mockMessages
					};

					const { result } = renderHookWrapper(() =>
						USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
					);
					deepStrictEqual(result.current.ariaDescribedBy, []);
				});
			});
		});

		describe("inputProps", () => {
			it("returns inputProps = undefined by default", () => {
				const mockControlSettings = getMockControlSettings();

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				strictEqual(result.current.inputProps, undefined);
			});

			it("sets aria-required to true if required is set to true", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					required: true
				};

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				deepStrictEqual(result.current.inputProps, {
					"aria-required": true,
					autoComplete: undefined,
					type: undefined
				});
			});

			it("sets autoComplete to the given value", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					autoComplete: "email"
				};

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				deepStrictEqual(result.current.inputProps, {
					"aria-required": undefined,
					autoComplete: "email",
					type: undefined
				});
			});

			it("sets type = 'password' if secret is set to true", () => {
				const mockControlSettings: BaseControlSettings = {
					...getMockControlSettings(),
					secret: true
				};

				const { result } = renderHookWrapper(() =>
					USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(mockControlSettings)
				);
				deepStrictEqual(result.current.inputProps, {
					"aria-required": undefined,
					autoComplete: undefined,
					type: "password"
				});
			});
		});
	});
});

function getMockControlSettings(): BaseControlSettings {
	return {
		uiIdPrefix: "test-id-prefix",
		uiId: "test-id",
		groupedValidationMessages: [],
		ungroupedValidationMessages: [],
		dmElement: {
			id: "test-element",
			name: "test-name",
			type: "Field",
			fieldType: {
				type: "StringType"
			}
		},
		conversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: "StringType"
		},
		dataReference: "test-data-reference",
		value: undefined
	};
}

function getMockMessage(options?: {
	severity?: Message.Severity;
	entityInstance?: EntityInstancePath;
	rulePath?: string;
}): Message {
	return {
		errorCode: "",
		errorText: [{ key: `${options?.severity}-localizable` }],
		severity: options?.severity ?? "ERROR",
		messageType: "VALUE_ERROR",
		entityInstance: options?.entityInstance ?? [],
		referencedFields: [],
		rulePath: options?.rulePath,
		refOmissionErrorResponsible: []
	};
}
