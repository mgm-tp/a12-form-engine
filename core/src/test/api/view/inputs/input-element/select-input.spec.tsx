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

import { deepEqual, deepStrictEqual, equal, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel, EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";

import type { DispatchConfiguration, Value } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { DropDownInput } from "../../../../../view/internal/components/form-engine/cells/controls/enumeration/select-input.js";
import type { Inputs } from "../../../../../view/internal/configuration/engine-configuration.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("SelectInput", () => {
		const models = setupModelsFixture("controls.dmtypes");

		const documentElementDataType: DocumentModel.EnumerationType = {
			type: "EnumerationType",
			values: []
		};
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "Select",
			renderFunction: DropDownInput,
			formModelPath: createModelPath("foo", "bar")
		};

		const selectPathCompactNotRequired = createDocumentPath(
			["A12T_DmTypes"],
			["Enumeration"],
			["Enumeration011"]
		);
		const selectPathCompactRequired = createDocumentPath(
			["A12T_DmTypes"],
			["Enumeration"],
			["Enumeration012"]
		);
		const selectPathCompactRequiredInitialValue = createDocumentPath(
			["A12T_DmTypes"],
			["Enumeration"],
			["Enumeration013"]
		);

		function setup(options: {
			dispatchConfig?: DispatchConfiguration;
			locale?: Locale;
			modelElement?: Partial<Inputs.ModelElement>;
			elementPath?: EntityInstancePath;
			value?: Value;
		}): Promise<RtlRenderWrapper> {
			const props = createProps({
				...baseProps,
				models: models,
				path: options.elementPath || selectPathCompactNotRequired,
				modelElement: options.modelElement || {},
				dispatchConfig: options.dispatchConfig,
				locale: options.locale,
				value: options.value
			});
			const Component = baseProps.renderFunction;
			return rtlRenderWrapperAsync(<Component {...props} />, {
				localizer: options.locale ? defaultLocalizerFactory({ locale: options.locale }) : undefined
			});
		}

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(
				() => models,
				{
					...baseProps,
					breakTooltipsToNewLine: true,
					component: "Select",
					path: createDocumentPath(["A12T_DmTypes"], ["Enumeration"], ["Enumeration011"])
				},
				{ autoCompleteTest: false }
			);
		});

		describe("onValueChanged", () => {
			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
			const dispatchConfig = {
				...stubbedDispatch.eventHandlers,
				onValueChange: mock.fn(),
				onParseError: mock.fn()
			};

			it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
				const wrapper = await setup({ elementPath: selectPathCompactNotRequired, dispatchConfig });
				const input = query(wrapper.widgetMap.Select).props();
				input.onValueChanged?.("key_2");

				strictEqual(
					dispatchConfig.onValueChange.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
				);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					selectPathCompactNotRequired,
					"key_2",
					baseProps.formModelPath
				]);
			});
		});

		describe("Items", () => {
			describe("locale=en", () => {
				it("renders the SelectItems with the localized label", async () => {
					const wrapper = await setup({ locale: US_LOCALE });
					const items = query(wrapper.widgetMap.Select).props().items;
					const labels = items.map(i => i.label);
					deepEqual(labels.slice(1, 4), ["One", "Two", "Three"]);
				});
			});

			describe("locale=de", () => {
				it("renders the SelectItems with the localized label", async () => {
					const wrapper = await setup({ locale: DE_LOCALE });

					const items = query(wrapper.widgetMap.Select).props().items;
					const labels = items.map(i => i.label);
					deepEqual(labels.slice(1, 4), ["Eins", "Zwei", "Drei"]);
				});
			});

			describe("if the input is not required", () => {
				describe("and no placeholder is given", () => {
					it("renders the SelectItems for each enumeration value and one empty entry", async () => {
						const wrapper = await setup({
							modelElement: {
								elementPath: selectPathCompactNotRequired
							},
							elementPath: selectPathCompactNotRequired
						});

						assertItems(wrapper, true);
					});
				});

				describe("and a placeholder is given", () => {
					describe("and no value is selected", () => {
						it("renders the SelectItems for each enumeration value, no empty entry and the placeholder", async () => {
							const wrapper = await setup({
								modelElement: {
									elementPath: selectPathCompactNotRequired,
									placeholder: "Placeholder test"
								},
								elementPath: selectPathCompactNotRequired,
								value: { data: undefined, ui: "", path: [] }
							});
							assertItems(wrapper, false, "Placeholder test");
						});
					});

					describe("and a value is selected", () => {
						it("renders the SelectItems for each enumeration value and one empty entry", async () => {
							const wrapper = await setup({
								modelElement: {
									elementPath: selectPathCompactNotRequired,
									placeholder: "Placeholder test"
								},
								elementPath: selectPathCompactNotRequired,
								value: { data: "key_1", ui: "one", path: selectPathCompactNotRequired }
							});

							assertItems(wrapper, true);
						});
					});
				});
			});

			describe("if the input is required", () => {
				describe("and no initial value is given", () => {
					it("renders the SelectItems for each enumeration value and one empty entry", async () => {
						const wrapper = await setup({
							modelElement: {
								elementPath: selectPathCompactRequired
							},
							elementPath: selectPathCompactRequired
						});
						assertItems(wrapper, true);
					});
				});

				describe("and an initial value is given", () => {
					it("renders the SelectItems for each enumeration value and no empty entry", async () => {
						const wrapper = await setup({
							modelElement: {
								elementPath: selectPathCompactRequiredInitialValue,
								elementRef: "fieldimpl_c38cc"
							},
							elementPath: selectPathCompactRequiredInitialValue
						});
						assertItems(wrapper, false);
					});
				});
			});

			describe("value", () => {
				it("gives the data value from the document to the value prop of the `Select`", async () => {
					const wrapper = await setup({
						value: { data: "key_1", ui: "one", path: selectPathCompactNotRequired }
					});
					const component = query(wrapper.widgetMap.Select).props();
					deepEqual(component.value, "key_1");
				});
			});

			function assertItems(
				wrapper: RtlRenderWrapper,
				emptyOptionShown: boolean,
				expectedPlaceholder?: string
			): void {
				const { placeholder, items } = query(wrapper.widgetMap.Select).props();

				let startIndex = 0;
				if (emptyOptionShown) {
					equal(items[startIndex].value, "");
					startIndex = 1;
				}

				if (placeholder) {
					equal(placeholder, expectedPlaceholder);
				}

				equal(items[startIndex].value, "key_1");
				equal(items[startIndex + 1].value, "key_2");
				equal(items[startIndex + 2].value, "key_3");
			}
		});
	});
});
