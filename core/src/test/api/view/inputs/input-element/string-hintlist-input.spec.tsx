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

import { deepEqual, deepStrictEqual, equal, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { StringWithHintListInput } from "../../../../../view/internal/components/form-engine/cells/controls/string/string-hintlist-input.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("StringWithHintListInput", () => {
		const models = setupModelsFixture("controls.picustypes");

		const documentElementDataType: DocumentModel.StringType = {
			type: "StringType",
			hintList: [
				{
					locale: "en",
					values: ["ABC", "DEF", "GHI"]
				},
				{
					locale: "de",
					values: ["JKL", "MNO", "PQR"]
				}
			]
		};
		const path = DocumentHelpers.createDocumentPath(["A12T_PicusTypes"], ["String"], ["String03"]);
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "Autocomplete",
			renderFunction: StringWithHintListInput,
			path,
			formModelPath: createModelPath("foo", "bar")
		};

		function setup(options: {
			dispatchConfig?: DispatchConfiguration;
			locale?: Locale;
			path?: EntityInstancePath;
		}): Promise<RtlRenderWrapper> {
			const props = createProps({
				...baseProps,
				models: models,
				path: options.path || baseProps.path,
				modelElement: { elementPath: options.path || baseProps.path },
				dispatchConfig: options.dispatchConfig,
				locale: options.locale,
				value: {
					data: "XYZ",
					ui: "XYZ",
					path
				}
			});
			const Component = baseProps.renderFunction;
			return rtlRenderWrapperAsync(<Component {...props} />, {
				localizer: options.locale ? defaultLocalizerFactory({ locale: options.locale }) : undefined,
				locale: options.locale
			});
		}

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(() => models, {
				...baseProps,
				breakTooltipsToNewLine: true,
				component: "Autocomplete",
				placeholderPropName: "inputPlaceHolder"
			});
		});

		describe("onValueChange", () => {
			function setupDispatchConfig() {
				const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
				return {
					...stubbedDispatch.eventHandlers,
					onValueChange: mock.fn(),
					onParseError: mock.fn()
				};
			}

			it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
				const dispatchConfig = setupDispatchConfig();
				const wrapper = await setup({ dispatchConfig });
				const input = query(wrapper.widgetMap.Autocomplete).props();
				input.onValueChange?.("XYZ");

				strictEqual(
					dispatchConfig.onValueChange.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
				);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					baseProps.path,
					"XYZ",
					baseProps.formModelPath
				]);
			});

			it("strips leading and tailing spaces", async () => {
				const dispatchConfig = setupDispatchConfig();
				const wrapper = await setup({ dispatchConfig });
				const input = query(wrapper.widgetMap.Autocomplete).props();
				input.onValueChange?.("   abc def   ");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					baseProps.path,
					"abc def",
					baseProps.formModelPath
				]);
			});

			it("converts empty strings to null", async () => {
				const dispatchConfig = setupDispatchConfig();
				const wrapper = await setup({ dispatchConfig });
				const input = query(wrapper.widgetMap.Autocomplete).props();
				input.onValueChange?.("");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					baseProps.path,
					null,
					baseProps.formModelPath
				]);
			});
		});

		describe("Localization", () => {
			describe("locale=en", () => {
				const locale = US_LOCALE;
				it("gives the correct localized hintTemplate as prop to the component", async () => {
					const wrapper = await setup({ locale });
					const autocomplete = query(wrapper.widgetMap.Autocomplete).props();
					equal(autocomplete.hintTemplate, "{count} out of {total} options");
				});

				describe("Items", () => {
					it("gives the values of the hint list to the component", async () => {
						const wrapper = await setup({ locale });
						const autocomplete = query(wrapper.widgetMap.Autocomplete).props();
						const items = autocomplete.items;
						deepEqual(items, ["ABC", "DEF", "GHI"]);
					});
				});
			});

			describe("locale=de", () => {
				const locale = DE_LOCALE;
				it("gives the correct localized hintTemplate as prop to the component", async () => {
					const wrapper = await setup({ locale });
					const autocomplete = query(wrapper.widgetMap.Autocomplete).props();
					equal(autocomplete.hintTemplate, "{count} von {total} Optionen");
				});

				describe("Items", () => {
					it("gives the values of the hint list to the component", async () => {
						const wrapper = await setup({ locale });
						const autocomplete = query(wrapper.widgetMap.Autocomplete).props();
						const items = autocomplete.items;
						deepEqual(items, ["JKL", "MNO", "PQR"]);
					});
				});
			});
		});

		describe("selected", () => {
			it("selects the value from the document", async () => {
				const wrapper = await setup({});
				const component = query(wrapper.widgetMap.Autocomplete).props();
				const selected = component.value;
				const value = typeof selected === "string" ? selected : selected?.value;
				deepEqual(value, "XYZ");
			});
		});
	});
});
