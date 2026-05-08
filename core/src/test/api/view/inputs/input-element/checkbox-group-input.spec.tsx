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

import { deepEqual, deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { CheckboxItemProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox-group/main/checkbox-group.api.js";

import type { MultiSelectData } from "../../../../../models/index.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { CheckboxGroupInput } from "../../../../../view/internal/components/form-engine/cells/controls/multi-select/checkbox-group-input.js";
import type { Inputs } from "../../../../../view/internal/configuration/engine-configuration.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Group, Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("CheckboxGroupInput", () => {
		const models = setupModelsFixture("controls.picustypes");

		const documentElementDataType: DocumentModel.Group = Group({
			usageType: "multiselect",
			elements: [Field({ name: "value" })]
		});

		const path = DocumentHelpers.createDocumentPath(
			["A12T_PicusTypes"],
			["MultiSelect"],
			["MultiSelect02"]
		);

		const baseProps = {
			documentElement: documentElementDataType,
			documentElementDataType,
			component: "CheckboxGroup",
			renderFunction: CheckboxGroupInput,
			path,
			formModelPath: createModelPath("foo", "bar")
		};

		function setup(options: {
			dispatchConfig?: DispatchConfiguration;
			locale?: Locale;
			value?: MultiSelectData;
			modelElement?: Partial<Inputs.ModelElement>;
		}): Promise<RtlRenderWrapper> {
			const props = createProps({
				...baseProps,
				models: models,
				path: baseProps.path,
				modelElement: options.modelElement || {},
				dispatchConfig: options.dispatchConfig,
				locale: options.locale,
				value: options.value
					? { data: options.value, ui: "", path }
					: { data: ["key_blue"], ui: "", path }
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
					component: "CheckboxGroup"
				},
				{
					errorWarningPropTest: false,
					ariaRequiredTest: false,
					autoCompleteTest: false,
					// FIXME: how did this pass before with placeholderTest???
					placeholderTest: false
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
					const wrapper = await setup({ dispatchConfig, value: [{ value: "key_blue" }] });
					const input = query(wrapper.widgetMap.CheckboxGroup).props();
					input.onValueChanged?.("key_green");

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

				describe("Items", () => {
					it("gives the labels of the enumeration values to the component", async () => {
						const wrapper = await setup({ locale });

						const items = query(wrapper.widgetMap.CheckboxGroupItem).propsHistory();
						const labels = items.map(i => i.label);
						deepEqual(labels, ["Blue", "Red", "Green"]);
					});
				});
			});

			describe("locale=de", () => {
				const locale = DE_LOCALE;

				describe("Items", () => {
					it("gives the labels of the enumeration values to the component", async () => {
						const wrapper = await setup({ locale });
						const items = query(wrapper.widgetMap.CheckboxGroupItem).propsHistory();
						const labels = items.map(i => i.label);
						deepEqual(labels, ["Blau", "Rot", "Grün"]);
					});
				});
			});
		});

		describe("Select all option", () => {
			describe("given a multi-select with a field configuration entry where enableSelectAll=true ", () => {
				describe("and exposition inline", () => {
					it("renders a indeterminate checkbox", async () => {
						const wrapper = await setup({
							modelElement: { exposition: "INLINE", enableSelectAll: true }
						});
						query(wrapper.widgetMap.CheckboxIndeterminate).assertRenderedTimes(1);
					});
				});

				describe("and exposition full", () => {
					it("renders a indeterminate checkbox", async () => {
						const wrapper = await setup({
							modelElement: { exposition: "FULL", enableSelectAll: true }
						});
						query(wrapper.widgetMap.CheckboxIndeterminate).assertRenderedTimes(1);
					});
				});

				describe("and exposition autocomplete", () => {
					it("renders no indeterminate checkbox", async () => {
						const wrapper = await setup({
							modelElement: { exposition: "AUTOCOMPLETE", enableSelectAll: true }
						});
						query(wrapper.widgetMap.CheckboxIndeterminate).assertNotRendered();
					});
				});
			});

			describe("given a multi-select with a field configuration entry where enableSelectAll=false ", () => {
				describe("and exposition inline", () => {
					it("renders no indeterminate checkbox", async () => {
						const wrapper = await setup({
							modelElement: { exposition: "INLINE", enableSelectAll: false }
						});
						query(wrapper.widgetMap.CheckboxIndeterminate).assertNotRendered();
					});
				});

				describe("and exposition full", () => {
					it("renders no indeterminate checkbox", async () => {
						const wrapper = await setup({
							modelElement: { exposition: "FULL", enableSelectAll: false }
						});
						query(wrapper.widgetMap.CheckboxIndeterminate).assertNotRendered();
					});
				});

				describe("and exposition autocomplete", () => {
					it("renders no indeterminate checkbox", async () => {
						const wrapper = await setup({
							modelElement: { exposition: "AUTOCOMPLETE", enableSelectAll: false }
						});
						query(wrapper.widgetMap.CheckboxIndeterminate).assertNotRendered();
					});
				});
			});
		});

		describe("value", () => {
			it("gives the ui value from the document to the value prop of the `MultiSelect`", async () => {
				const wrapper = await setup({ value: [{ value: "key_blue" }, { value: "key_green" }] });

				const items = query(wrapper.widgetMap.CheckboxGroupItem).propsHistory();
				const valueSelectedTuple = (item: CheckboxItemProps) => [item.value, item.selected];
				const valueSelectedTuples = items.map(valueSelectedTuple);
				deepEqual(valueSelectedTuples, [
					["key_blue", true],
					["key_red", false],
					["key_green", true]
				]);
			});
		});
	});
});
