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

import { strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import {
	ContentEngineContextProvider,
	DocumentContext,
	DocumentPathContextProvider
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	DocumentModel,
	EntityInstancePath,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ValueConversionConfig } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type {
	DynamicAmountSuffix,
	StaticAmountSuffix
} from "../../../../main/core/configuration/formElementConfig.js";
import {
	GET_LOCALIZED_MODEL_TEXTS_WRAPPER,
	type LocalizedModelTexts
} from "../../../../main/core/contentElements/elementConfiguration/getLocalizedModelTexts.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/useCommonControlSettings.js";
import { TEXT_LINE_TYPE } from "../../../../main/core/contentElements/modules/textLine/textLineNode.js";
import type {
	BaseControlProps,
	FormElementConfig,
	MessageGroupFilter
} from "../../../../main/core/index.js";
import {
	FORM_ELEMENTS_NAMESPACE,
	FormElementContext,
	MessageGroupContext
} from "../../../../main/core/index.js";
import { assertCalledWith } from "../../../assertions.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { mockStore } from "../../../mocks/mockStore.js";

function setupMocks(localizedTexts?: LocalizedModelTexts) {
	return {
		getLocalizedModelTextsMock: mock.method(
			GET_LOCALIZED_MODEL_TEXTS_WRAPPER,
			"getLocalizedModelTexts",
			() => localizedTexts ?? {}
		)
	};
}

describe("core.contentElements.elementConfiguration", () => {
	describe("useCommonControlsSettings", () => {
		it("returns the uiIdPrefix from the FormElementContext", () => {
			setupMocks();

			const uiIdPrefix = "test-uiId-prefix";

			const { result } = renderHook(
				() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
				{
					wrapper: createWrapper({
						formElementConfig: { uiIdPrefix }
					})
				}
			);

			strictEqual(result.current.uiIdPrefix, uiIdPrefix);
		});

		it("generates and returns an uiId", () => {
			setupMocks();

			const uiIdPrefix = "test-uiId-prefix";
			const mockNode = getMockNode();

			const { result } = renderHook(
				() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(mockNode),
				{
					wrapper: createWrapper({
						formElementConfig: { uiIdPrefix }
					})
				}
			);

			strictEqual(result.current.uiId, `${uiIdPrefix}-a12-${mockNode.id}-element`);
		});

		it("returns some control props unchanged", () => {
			setupMocks();

			const mockNode = getMockNode({
				hideLabel: true,
				tooltipsOnTop: true,
				truncateSuffix: true,
				autoComplete: "email",
				secret: true,
				autoExpand: true,
				datePickerConfig: {
					absolute: true,
					minYear: 2000,
					maxYear: 2050,
					preselectionYear: 2025
				},
				enableSelectAll: true,
				inline: true
			});

			const { result } = renderHook(
				() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(mockNode),
				{
					wrapper: createWrapper()
				}
			);

			strictEqual(result.current.hideLabel, mockNode.props.hideLabel);
			strictEqual(result.current.tooltipsOnTop, mockNode.props.tooltipsOnTop);
			strictEqual(result.current.truncateSuffix, mockNode.props.truncateSuffix);
			strictEqual(result.current.autoComplete, mockNode.props.autoComplete);
			strictEqual(result.current.secret, mockNode.props.secret);
			strictEqual(result.current.autoExpand, mockNode.props.autoExpand);
			strictEqual(result.current.datePickerConfig, mockNode.props.datePickerConfig);
			strictEqual(result.current.enableSelectAll, mockNode.props.enableSelectAll);
			strictEqual(result.current.inline, mockNode.props.inline);
		});

		it("retrieves settings via the DocumentContext", () => {
			setupMocks();

			const mockValue = "test-value";
			const mockUiValue = "test-ui-value";
			const mockRequired = true;
			const mockNotRelevant = true;
			const mockTimeZone = "Europe/Berlin";
			const mockElement: DocumentModel.Element = {
				id: "test-element",
				name: "test-name",
				type: "Field",
				fieldType: {
					type: "NumberType"
				}
			};
			const mockConversionConfig: ValueConversionConfig = {
				modelId: "test-model-id",
				modelPath: [],
				type: "NumberType"
			};

			const { result } = renderHook(
				() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
				{
					wrapper: createWrapper({
						documentContext: {
							model: {
								getTimeZone: () => mockTimeZone,
								getElementByPath: () => mockElement,
								getConversionConfig: () => mockConversionConfig,
								getRequired: () => mockRequired
							},
							document: {
								getElementValue: () => mockValue,
								getFieldDisplayValue: () => mockUiValue,
								getNotRelevant: () => mockNotRelevant
							}
						}
					})
				}
			);

			strictEqual(result.current.value, mockValue);
			strictEqual(result.current.formattedValue, mockUiValue);
			strictEqual(result.current.required, mockRequired);
			strictEqual(result.current.notRelevant, mockNotRelevant);
			strictEqual(result.current.timeZone, mockTimeZone);
			strictEqual(result.current.dmElement, mockElement);
			strictEqual(result.current.conversionConfig, mockConversionConfig);
		});

		describe("getLocalizedModelTexts", () => {
			it("calls getLocalizedModelTexts with the correct parameters for a static amountSuffix", () => {
				const { getLocalizedModelTextsMock } = setupMocks();

				const dummyLocalizer = () => "";

				const mockNode = getMockNode({ readonly: true });
				const mockDmName = "test-document-model";
				const mockElement: DocumentModel.Element = {
					id: "test-element",
					name: "test-name",
					type: "Field",
					fieldType: {
						type: "NumberType"
					}
				};
				const mockAmountSuffix: StaticAmountSuffix = {
					type: "static",
					value: "test-amount-suffix"
				};
				const mockFormElementConfig: Partial<FormElementConfig> = {
					amountSuffix: mockAmountSuffix,
					markingOfRequiredFields: "NONE"
				};
				const mockDataContext = "/root[1]/group[2]";

				renderHook(() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(mockNode), {
					wrapper: createWrapper({
						dataContext: mockDataContext,
						documentContext: {
							model: {
								getDocumentModelName: () => mockDmName,
								getElementByPath: () => mockElement,
								getRequired: () => true
							}
						},
						formElementConfig: mockFormElementConfig,
						localizerContext: {
							locale: { language: "en", country: "US" },
							localizer: dummyLocalizer,
							conversion: {
								parseValue: () => ({ value: "" }),
								formatValue: () => ""
							},
							dataFormats: {}
						}
					})
				});

				assertCalledWith(getLocalizedModelTextsMock, {
					contentModelName: "test-content-model",
					node: mockNode,
					documentModelName: mockDmName,
					dmElement: mockElement,
					dataReference: `${mockDataContext}/element[1]`,
					readonly: true,
					required: true,
					markingOfRequiredFields: mockFormElementConfig.markingOfRequiredFields,
					amountSuffixValue: mockAmountSuffix.value,
					localizer: dummyLocalizer
				});
			});

			it("calls getLocalizedModelTexts with the correct parameters for a dynamic amountSuffix", () => {
				const { getLocalizedModelTextsMock } = setupMocks();

				const dummyLocalizer = () => "";

				const mockNode = getMockNode({ readonly: true });
				const mockDmName = "test-document-model";
				const mockElement: DocumentModel.Element = {
					id: "test-element",
					name: "test-name",
					type: "Field",
					fieldType: {
						type: "NumberType"
					}
				};
				const mockAmountSuffix: DynamicAmountSuffix = {
					type: "dynamic",
					fieldRef: "/root/suffix"
				};
				const mockSuffixValue = "dynamic-test-suffix";
				const mockFormElementConfig: Partial<FormElementConfig> = {
					amountSuffix: mockAmountSuffix,
					markingOfRequiredFields: "NONE"
				};
				const mockDataContext = "/root[1]/group[2]";

				renderHook(() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(mockNode), {
					wrapper: createWrapper({
						dataContext: mockDataContext,
						documentContext: {
							model: {
								getDocumentModelName: () => mockDmName,
								getElementByPath: () => mockElement,
								getRequired: () => true
							},
							document: {
								getFieldDisplayValue: () => mockSuffixValue
							}
						},
						formElementConfig: mockFormElementConfig,
						localizerContext: {
							locale: { language: "en", country: "US" },
							localizer: dummyLocalizer,
							conversion: {
								parseValue: () => ({ value: "" }),
								formatValue: () => ""
							},
							dataFormats: {}
						}
					})
				});

				assertCalledWith(getLocalizedModelTextsMock, {
					contentModelName: "test-content-model",
					node: mockNode,
					documentModelName: mockDmName,
					dmElement: mockElement,
					dataReference: `${mockDataContext}/element[1]`,
					readonly: true,
					required: true,
					markingOfRequiredFields: mockFormElementConfig.markingOfRequiredFields,
					amountSuffixValue: mockSuffixValue,
					localizer: dummyLocalizer
				});
			});

			it("returns the localized texts as returned by getLocalizedModelTexts", () => {
				const mockTexts: LocalizedModelTexts = {
					label: "localized-label",
					hint: "localized-hint",
					helperText: "localized-helper-text",
					placeholder: "localized-placeholder",
					suffix: "localized-suffix",
					uncheckedLabel: "localized-unchecked-label",
					checkedLabel: "localized-checked-label"
				};

				setupMocks(mockTexts);

				const { result } = renderHook(
					() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
					{
						wrapper: createWrapper()
					}
				);

				strictEqual(result.current.label, mockTexts.label);
				strictEqual(result.current.hint, mockTexts.hint);
				strictEqual(result.current.helperText, mockTexts.helperText);
				strictEqual(result.current.placeholder, mockTexts.placeholder);
				strictEqual(result.current.suffix, mockTexts.suffix);
				strictEqual(result.current.uncheckedLabel, mockTexts.uncheckedLabel);
				strictEqual(result.current.checkedLabel, mockTexts.checkedLabel);
			});
		});

		describe("DataReference", () => {
			describe("Field", () => {
				it("Computes the data reference from the data context and the field path, when given an absolute path", () => {
					setupMocks();

					const { result } = renderHook(
						() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
						{
							wrapper: createWrapper({ dataContext: "/root[1]/group[2]" })
						}
					);

					strictEqual(result.current.dataReference, "/root[1]/group[2]/element[1]");
				});
			});

			describe("MultiSelect", () => {
				it("Computes the data reference from the data context and the group path", () => {
					setupMocks();

					const { result } = renderHook(
						() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
						{
							wrapper: createWrapper({
								dataContext: "/root[1]/group[2]",
								documentContext: {
									model: {
										getElementByPath: () => ({
											id: "test-multiSelect",
											name: "ms",
											type: "Group",
											repeatability: 5,
											usageType: "multi-select",
											elements: [
												{
													id: "multiSelect-field",
													name: "ms-field",
													type: "Field",
													fieldType: { type: "StringType" }
												}
											]
										})
									}
								}
							})
						}
					);

					strictEqual(result.current.dataReference, "/root[1]/group[2]/element[0]");
				});
			});
		});

		describe("Readonly", () => {
			it("returns readonly === true when the node is set to readonly", () => {
				setupMocks();

				const { result } = renderHook(
					() =>
						USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(
							getMockNode({ readonly: true })
						),
					{ wrapper: createWrapper() }
				);

				strictEqual(result.current.readonly, true);
			});

			it("returns readonly === true when the field is computed", () => {
				setupMocks();

				const { result } = renderHook(
					() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
					{
						wrapper: createWrapper({
							documentContext: { model: { getComputed: () => true } }
						})
					}
				);

				strictEqual(result.current.readonly, true);
			});

			it("returns readonly === false when the node is not readonly and the field is not computed", () => {
				setupMocks();

				const { result } = renderHook(
					() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
					{
						wrapper: createWrapper()
					}
				);

				strictEqual(result.current.readonly, false);
			});
		});

		describe("showMessagesAsTooltip", () => {
			it("returns showMessagesAsTooltip === true when the messageExposition is set to 'TOOLTIP'", () => {
				setupMocks();

				const { result } = renderHook(
					() =>
						USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(
							getMockNode({ messageExposition: "TOOLTIP" })
						),
					{ wrapper: createWrapper() }
				);

				strictEqual(result.current.showMessagesAsTooltip, true);
			});

			it("returns showMessagesAsTooltip === false when the messageExposition is not set to 'TOOLTIP'", () => {
				setupMocks();

				const { result } = renderHook(
					() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
					{
						wrapper: createWrapper()
					}
				);

				strictEqual(result.current.showMessagesAsTooltip, false);
			});
		});

		describe("MessageGroup", () => {
			it("returns messageGroupId from the MessageGroupContext", () => {
				setupMocks();

				const { result } = renderHook(
					() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
					{
						wrapper: createWrapper()
					}
				);

				strictEqual(result.current.messageGroupId, "test-message-group");
			});

			it("calls getGroupedValidationMessages and getUngroupedValidationMessages with the filtered messages for the current element", () => {
				setupMocks();

				const getGroupedValidationMessages = mock.fn(() => []);
				const getUngroupedValidationMessages = mock.fn(() => []);

				const allMessages = [
					getMockError(DocumentPath.fromString("/root[1]/group[1]/element[1]"), [
						DocumentPath.fromString("/root[1]/group[1]/element[1]")
					]),
					getMockError(DocumentPath.fromString("/root[1]/group[1]/otherElement[1]"), [
						DocumentPath.fromString("/root[1]/group[1]/element[1]"),
						DocumentPath.fromString("/root[1]/group[1]/otherElement[1]")
					]),
					getMockError(DocumentPath.fromString("/root[1]/group[1]/otherElement[1]"), [
						DocumentPath.fromString("/root[1]/group[1]/otherElement[1]")
					])
				];

				renderHook(
					() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
					{
						wrapper: createWrapper({
							documentContext: {
								document: {
									getAllMessages: () => allMessages
								}
							},
							messageGroupContext: {
								getGroupedValidationMessages,
								getUngroupedValidationMessages
							}
						})
					}
				);

				assertCalledWith(getGroupedValidationMessages, allMessages.slice(0, 2));
				assertCalledWith(getUngroupedValidationMessages, allMessages.slice(0, 2));
			});

			it("returns groupedValidationMessages and ungroupedValidationMessages as returned by the MessageGroupFilter", () => {
				setupMocks();

				const groupedValidationMessages = [
					getMockError(DocumentPath.fromString("/root[1]/field1[1]"), [
						DocumentPath.fromString("/root[1]/field1[1]")
					])
				];
				const ungroupedValidationMessages = [
					getMockError(DocumentPath.fromString("/root[1]/field2[1]"), [
						DocumentPath.fromString("/root[1]/field2[1]")
					])
				];

				const { result } = renderHook(
					() => USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(getMockNode()),
					{
						wrapper: createWrapper({
							messageGroupContext: {
								getGroupedValidationMessages: () => groupedValidationMessages,
								getUngroupedValidationMessages: () => ungroupedValidationMessages
							}
						})
					}
				);

				strictEqual(result.current.groupedValidationMessages, groupedValidationMessages);
				strictEqual(result.current.ungroupedValidationMessages, ungroupedValidationMessages);
			});
		});
	});
});

function getMockNode(controlProps?: Partial<BaseControlProps>) {
	return {
		id: "node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: TEXT_LINE_TYPE,
		props: {
			...controlProps,
			elementId: controlProps?.elementId ?? "element-id"
		}
	};
}

function getMockError(
	entityInstance: EntityInstancePath,
	referencedFields: EntityInstancePath[]
): Message {
	return {
		errorCode: "",
		errorText: [],
		severity: "ERROR",
		messageType: "VALUE_ERROR",
		entityInstance,
		referencedFields,
		rulePath: "/test/rule",
		refOmissionErrorResponsible: []
	};
}

function createWrapper(options?: {
	dataContext?: string;
	localizerContext?: LocalizerContext.Type;
	contentModelName?: string;
	formElementConfig?: Partial<FormElementConfig>;
	documentContext?: {
		model?: Partial<DocumentContext["model"]>;
		document?: Partial<DocumentContext["document"]>;
		event?: Partial<DocumentContext["event"]>;
	};
	messageGroupContext?: Partial<MessageGroupFilter>;
}) {
	const defaultDocContext = mockDocumentContext({
		getDocumentModelName: "test-dm",
		getModelPathById: ModelPath.fromString("/root/group/element"),
		getConversionConfig: {
			modelId: "test-model-id",
			modelPath: [],
			type: "NumberType"
		}
	});

	const defaultMessageFilter: MessageGroupFilter = {
		id: "test-message-group",
		getGroupedValidationMessages: () => [],
		getUngroupedValidationMessages: () => []
	};

	return function Wrapper(props: PropsWithChildren) {
		return (
			<Provider store={mockStore()}>
				<LocalizerContext.Provider
					value={
						options?.localizerContext ?? {
							locale: { language: "en", country: "US" },
							localizer: () => "",
							conversion: {
								parseValue: () => ({
									value: ""
								}),
								formatValue: () => ""
							},
							dataFormats: {}
						}
					}
				>
					<ContentEngineContextProvider libraryId={"test-library"} size="lg">
						<DocumentPathContextProvider groupPath={options?.dataContext ?? ""}>
							<DocumentContext.Provider
								value={{
									...defaultDocContext,
									model: {
										...defaultDocContext.model,
										...options?.documentContext?.model
									},
									document: {
										...defaultDocContext.document,
										...options?.documentContext?.document
									},
									event: {
										...defaultDocContext.event,
										...options?.documentContext?.event
									}
								}}
							>
								<FormElementContext.Provider
									value={{
										contentModelName: options?.contentModelName ?? "test-content-model",
										config: { timeMode: "12h", ...options?.formElementConfig }
									}}
								>
									<MessageGroupContext.Provider
										value={{
											...defaultMessageFilter,
											...options?.messageGroupContext
										}}
									>
										{props.children}
									</MessageGroupContext.Provider>
								</FormElementContext.Provider>
							</DocumentContext.Provider>
						</DocumentPathContextProvider>
					</ContentEngineContextProvider>
				</LocalizerContext.Provider>
			</Provider>
		);
	};
}
