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

import { deepStrictEqual } from "assert";

import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import {
	ContentEngineContextProvider,
	DocumentContext,
	DocumentPathContextProvider
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";
import type { LocalizerContextProps } from "@com.mgmtp.a12.utils/utils-localization-react";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import {
	FormElementContext,
	MessageGroupContext,
	USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER
} from "../../../../main/core/index.js";
import type { FormElementConfig, MessageGroupFilter } from "../../../../main/core/index.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { mockStore } from "../../../mocks/mockStore.js";

describe("core.contentElements.elementConfiguration", () => {
	describe("useLocalizedEnumerationValues", () => {
		describe("Enumeration fields", () => {
			it("returns localized enum values", () => {
				const { result } = renderHook(
					() =>
						USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues("test-data-ref"),
					{
						wrapper: createWrapper({
							documentContext: {
								model: {
									getElementByPath: () => enumField()
								},
								document: {
									getEnumerationValues: () => enumValues()
								}
							}
						})
					}
				);

				deepStrictEqual(result.current, [
					{
						value: "value3",
						label: "label3.de"
					},
					{
						value: "value1",
						label: "label1.de"
					},
					{
						value: "value2",
						label: "label2.de"
					}
				]);
			});

			it("sorts the result if alphabeticalSorting is set at the field", () => {
				const { result } = renderHook(
					() =>
						USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues("test-data-ref"),
					{
						wrapper: createWrapper({
							documentContext: {
								model: {
									getElementByPath: () => enumField(true)
								},
								document: {
									getEnumerationValues: () => enumValues()
								}
							}
						})
					}
				);

				deepStrictEqual(result.current, [
					{
						value: "value1",
						label: "label1.de"
					},
					{
						value: "value2",
						label: "label2.de"
					},
					{
						value: "value3",
						label: "label3.de"
					}
				]);
			});
		});

		describe("String fields with a hint list", () => {
			it("returns localized enum values", () => {
				const { result } = renderHook(
					() =>
						USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues("test-data-ref"),
					{
						wrapper: createWrapper({
							documentContext: {
								model: {
									getElementByPath: () => stringFieldWithHints()
								}
							}
						})
					}
				);

				deepStrictEqual(result.current, [
					{
						value: "label3.de",
						label: "label3.de"
					},
					{
						value: "label1.de",
						label: "label1.de"
					},
					{
						value: "label2.de",
						label: "label2.de"
					}
				]);
			});

			it("sorts the result if alphabeticalSorting is set at the field", () => {
				const { result } = renderHook(
					() =>
						USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues("test-data-ref"),
					{
						wrapper: createWrapper({
							documentContext: {
								model: {
									getElementByPath: () => stringFieldWithHints(true)
								}
							}
						})
					}
				);

				deepStrictEqual(result.current, [
					{
						value: "label1.de",
						label: "label1.de"
					},
					{
						value: "label2.de",
						label: "label2.de"
					},
					{
						value: "label3.de",
						label: "label3.de"
					}
				]);
			});

			it("returns an empty array for locales that do not have hints", () => {
				const locale = { language: "fr", country: "FR" };

				const { result } = renderHook(
					() =>
						USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues("test-data-ref"),
					{
						wrapper: createWrapper({
							localizerContext: {
								locale,
								localizer: defaultLocalizerFactory({ locale }),
								conversion: {
									parseValue: () => ({ value: "" }),
									formatValue: () => ""
								},
								dataFormats: {}
							},
							documentContext: {
								model: {
									getElementByPath: () => stringFieldWithHints()
								}
							}
						})
					}
				);

				deepStrictEqual(result.current, []);
			});
		});

		it("returns localized enum values for boolean fields", () => {
			const { result } = renderHook(
				() =>
					USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues("test-data-ref"),
				{
					wrapper: createWrapper({
						documentContext: {
							model: {
								getElementByPath: () => booleanField()
							}
						}
					})
				}
			);

			deepStrictEqual(result.current, [
				{
					value: "true",
					label: "Ja"
				},
				{
					value: "false",
					label: "Nein"
				}
			]);
		});

		it("returns an empty array for other field types", () => {
			const { result } = renderHook(
				() =>
					USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues("test-data-ref"),
				{
					wrapper: createWrapper({
						documentContext: {
							model: {
								getElementByPath: () => stringField()
							}
						}
					})
				}
			);

			deepStrictEqual(result.current, []);
		});
	});
});

function enumField(sorting?: true): DocumentModel.Field {
	return {
		id: "element-id",
		name: "element-name",
		type: "Field",
		fieldType: {
			type: "EnumerationType",
			alphabeticalSorting: sorting,
			values: []
		}
	};
}

function enumValues(): DocumentModel.EnumValue[] {
	return [
		{
			value: "value3",
			label: [
				{ locale: "en", text: "label3.en" },
				{ locale: "de", text: "label3.de" }
			]
		},
		{
			value: "value1",
			label: [
				{ locale: "en", text: "label1.en" },
				{ locale: "de", text: "label1.de" }
			]
		},
		{
			value: "value2",
			label: [
				{ locale: "en", text: "label2.en" },
				{ locale: "de", text: "label2.de" }
			]
		}
	];
}

function stringFieldWithHints(sorting?: true): DocumentModel.Field {
	return {
		id: "element-id",
		name: "element-name",
		type: "Field",
		fieldType: {
			type: "StringType",
			alphabeticalSorting: sorting,
			hintList: [
				{
					locale: "en",
					values: ["label3.en", "label1.en", "label2.en"]
				},
				{
					locale: "de",
					values: ["label3.de", "label1.de", "label2.de"]
				}
			]
		}
	};
}

function stringField(): DocumentModel.Field {
	return {
		id: "element-id",
		name: "element-name",
		type: "Field",
		fieldType: { type: "StringType" }
	};
}

function booleanField(): DocumentModel.Field {
	return {
		id: "element-id",
		name: "element-name",
		type: "Field",
		fieldType: { type: "BooleanType" }
	};
}

function createWrapper(options?: {
	dataContext?: string;
	localizerContext?: LocalizerContextProps;
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

	const defaultMessageFilter = {
		id: "test-message-group",
		editableElements: [],
		getGroupedValidationMessages: () => [],
		getUngroupedValidationMessages: () => []
	};

	const defaultLocale: Locale = { language: "de", country: "DE" };

	return function Wrapper(props: PropsWithChildren) {
		return (
			<Provider store={mockStore()}>
				<LocalizerContext.Provider
					value={
						options?.localizerContext ?? {
							locale: defaultLocale,
							localizer: defaultLocalizerFactory({ locale: defaultLocale }),
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
