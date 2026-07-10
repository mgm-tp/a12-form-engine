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
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";
import { provider } from "@com.mgmtp.a12.widgets/widgets-core";
import type { SizeDetectorProps, MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { MultiSelectData } from "../../../../../models/index.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps, EnumerableHelper } from "../../../../../view/index.js";
import { MultiSelectInput } from "../../../../../view/internal/components/form-engine/cells/controls/multi-select/multi-select-input.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Group, Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("MultiSelectInput", () => {
		const models = setupModelsFixture("controls.dmtypes");

		const documentElementDataType: DocumentModel.Group = Group({
			usageType: "multiselect",
			elements: [Field({ name: "value" })]
		});

		const path = [
			{ elementName: "A12T_DmTypes", index: 1 },
			{ elementName: "MultiSelect", index: 1 },
			{ elementName: "MultiSelect01", index: 1 }
		];

		const baseProps = {
			documentElement: documentElementDataType,
			documentElementDataType,
			component: "Multiselect",
			renderFunction: MultiSelectInput,
			path,
			formModelPath: createModelPath("foo", "bar")
		};

		function setup(options: {
			dispatchConfig?: DispatchConfiguration;
			locale?: Locale;
			value?: MultiSelectData;
			size?: SizeDetectorProps.Size;
		}): Promise<RtlRenderWrapper> {
			const props = createProps({
				...baseProps,
				models: models,
				path: baseProps.path,
				modelElement: {},
				dispatchConfig: options.dispatchConfig,
				locale: options.locale,
				value: options.value
					? { data: options.value, ui: "", path }
					: { data: ["key_blue"], ui: "", path }
			});

			return rtlRenderWrapperAsync(<MultiSelectInput {...props} />, {
				size: options.size,
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
					component: "Multiselect",
					placeholderPropName: "placeholder"
				},
				{
					errorWarningPropTest: false,
					ariaRequiredTest: false,
					autoCompleteTest: false
				}
			);
		});

		describe("onValueChange", () => {
			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
			const dispatchConfig = {
				...stubbedDispatch.eventHandlers,
				onMultiSelectValueChange: mock.fn()
			};

			it(
				"calls onMultiSelectValueChange from the dispatch configuration " +
					"with the correct arguments, where the enumeration options are in the order of the document model",
				async () => {
					const wrapper = await setup({ dispatchConfig });
					const input = query(wrapper.widgetMap.Multiselect).props();
					input.onChange?.([{ id: "key_green" }, { id: "key_blue" }] as MultiselectProps.Item[]);

					strictEqual(
						dispatchConfig.onMultiSelectValueChange.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onMultiSelectValueChange.mock.callCount()} time(s). Expected call count: ${1}`
					);

					deepStrictEqual(dispatchConfig.onMultiSelectValueChange.mock.calls[0].arguments, [
						baseProps.path,
						[{ value: "key_blue" }, { value: "key_green" }],
						baseProps.formModelPath
					]);
				}
			);
		});

		describe("Localization", () => {
			describe("locale=en", () => {
				const locale = US_LOCALE;
				it("gives the correct localized hintTemplate as prop to the component", async () => {
					const wrapper = await setup({ locale });
					const component = query(wrapper.widgetMap.Multiselect).props();
					equal(component.hintTemplate, "{count} out of {total} options");
				});

				describe("Items", () => {
					it("gives the labels of the enumeration values to the component", async () => {
						const wrapper = await setup({ locale });
						const component = query(wrapper.widgetMap.Multiselect).props();
						deepEqual(component.items, [
							{ id: "key_blue", value: "key_blue", label: "Blue", selected: false },
							{ id: "key_red", value: "key_red", label: "Red", selected: false },
							{ id: "key_green", value: "key_green", label: "Green", selected: false }
						]);
					});
				});
			});

			describe("locale=de", () => {
				const locale = DE_LOCALE;
				it("gives the correct localized hintTemplate as prop to the component", async () => {
					const wrapper = await setup({ locale });
					const component = query(wrapper.widgetMap.Multiselect).props();
					equal(component.hintTemplate, "{count} von {total} Optionen");
				});

				describe("Items", () => {
					it("gives the labels of the enumeration values to the component", async () => {
						const wrapper = await setup({ locale });
						const component = query(wrapper.widgetMap.Multiselect).props();
						deepEqual(component.items, [
							{ id: "key_blue", value: "key_blue", label: "Blau", selected: false },
							{ id: "key_red", value: "key_red", label: "Rot", selected: false },
							{ id: "key_green", value: "key_green", label: "Grün", selected: false }
						]);
					});
				});
			});
		});

		describe("value", () => {
			it("gives the ui value from the document to the value prop of the `MultiSelect`", async () => {
				const wrapper = await setup({ value: [{ value: "key_blue" }, { value: "key_green" }] });
				const component = query(wrapper.widgetMap.Multiselect).props();
				const items = component.items;
				deepEqual(items, [
					{ id: "key_blue", value: "key_blue", label: "Blue", selected: true },
					{ id: "key_red", value: "key_red", label: "Red", selected: false },
					{ id: "key_green", value: "key_green", label: "Green", selected: true }
				]);
			});
		});

		describe("given a non-mobile device", () => {
			beforeEach(() => {
				mock.method(provider, "get", () => "desktop");
			});

			it("renders the MultiSelectComponent with mobile=false", async () => {
				const wrapper = await setup({ size: "sm" });
				const component = query(wrapper.widgetMap.Multiselect).props();
				equal(component.mobile, false);
			});
		});

		describe("given a mobile device", () => {
			beforeEach(() => {
				mock.method(provider, "get", () => "phone");
			});

			it("renders the MultiSelectComponent with mobile=true", async () => {
				const wrapper = await setup({ size: "sm" });
				const component = query(wrapper.widgetMap.Multiselect).props();
				equal(component.mobile, true);
			});
		});

		it("uses `EnumerableHelper.getLocalizedEnumerationValues` to retrieve the dependent enumeration values", () => {
			const spy = mock.method(EnumerableHelper, "getLocalizedEnumerationValues");
			setup({});
			strictEqual(spy.mock.callCount(), 1);
		});
	});
});
