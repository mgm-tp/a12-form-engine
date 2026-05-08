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

import { deepEqual, deepStrictEqual, equal, ok, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { RadioInput } from "../../../../../view/internal/components/form-engine/cells/controls/enumeration/radio-input.js";
import type { Inputs } from "../../../../../view/internal/configuration/engine-configuration.js";
import { changeEventMock } from "../../../../rtl-utils/mock-utils.js";
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
	describe("RadioInput", () => {
		const models = setupModelsFixture("controls.picustypes");

		const documentElementDataType: DocumentModel.EnumerationType = {
			type: "EnumerationType",
			values: [{ value: "1" }, { value: "2" }]
		};

		const fieldPath = DocumentHelpers.createDocumentPath(
			["A12T_PicusTypes"],
			["Enumeration"],
			["Enumeration03"]
		);

		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "Radio",
			renderFunction: RadioInput,
			path: fieldPath,
			formModelPath: createModelPath("foo", "bar")
		} as const;

		function setup(options: {
			dispatchConfig?: DispatchConfiguration;
			locale?: Locale;
			modelElement?: Partial<Inputs.ModelElement>;
		}): Promise<RtlRenderWrapper> {
			const props = createProps({
				...baseProps,
				models: models,
				modelElement: options.modelElement || {},
				dispatchConfig: options.dispatchConfig,
				locale: options.locale,
				value: {
					data: "key_blue",
					ui: "blue",
					path: fieldPath
				}
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
					label: false
				},
				{
					placeholderTest: false,
					ariaRequiredTest: false,
					autoCompleteTest: false
				}
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
				const wrapper = await setup({ dispatchConfig });
				const input = query(wrapper.widgetMap.RadioItem).propsHistory().at(0);
				input?.onChange?.(changeEventMock);

				strictEqual(
					dispatchConfig.onValueChange.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
				);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					fieldPath,
					"key_1",
					baseProps.formModelPath
				]);
			});
		});

		describe("Items", () => {
			describe("locale=en", () => {
				it("renders the RadioItems with the localized label", async () => {
					const wrapper = await setup({ locale: US_LOCALE });
					const input = query(wrapper.widgetMap.RadioItem).propsHistory();
					const labels = input.map(i => i.label);
					deepEqual(labels.slice(0, 3), ["One", "Two", "Three"]);
				});
			});

			describe("locale=de", () => {
				it("renders the RadioItems with the localized label", async () => {
					const wrapper = await setup({ locale: DE_LOCALE });
					const input = query(wrapper.widgetMap.RadioItem).propsHistory();
					const labels = input.map(i => i.label);
					deepEqual(labels.slice(0, 3), ["Eins", "Zwei", "Drei"]);
				});
			});
		});

		describe("Exposition", () => {
			it("sets the prop 'inline' to true if the exposition is 'INLINE'", async () => {
				const wrapper = await setup({
					modelElement: { exposition: "INLINE" }
				});

				const radio = query(wrapper.widgetMap.Radio).props();
				equal(radio.inline, true);
			});

			it("sets the prop 'inline' to false if the exposition is not 'INLINE'", async () => {
				const wrapper = await setup({
					modelElement: { exposition: "FULL" }
				});

				const radio = query(wrapper.widgetMap.Radio).props();
				equal(radio.inline, false);
			});
		});

		describe("value", () => {
			it("gives the data value from the document to the value prop of the `Select`", async () => {
				const wrapper = await setup({});
				const component = query(wrapper.widgetMap.RadioItem).propsHistory();
				deepEqual(component.at(0)?.value, "key_1");
			});
		});

		describe("aria-required", () => {
			it("renders a RadioInput with empty inputProps if the field is not required", async () => {
				const wrapper = await setup({});
				const component = query(wrapper.widgetMap.Radio).props();
				deepEqual(component.groupDOMProps, undefined);

				// The radio items should not have any input props
				const items = query(wrapper.widgetMap.RadioItem).propsHistory();
				ok(
					items.at(0)?.inputProps === undefined,
					"Expected that the first radio item does not have any inputProps defined"
				);
				ok(
					items.at(1)?.inputProps === undefined,
					"Expected that the second radio item does not have any inputProps defined"
				);
			});

			it("renders a RadioInput with aria-required=true if the field is required but does not set the property to the RadioItems", async () => {
				const wrapper = await setup({ modelElement: { required: true, autoComplete: undefined } });
				const component = query(wrapper.widgetMap.Radio).props();
				deepEqual(component.groupDOMProps, {
					"aria-required": true,
					autoComplete: undefined
				});

				// The radio items should not have any input props
				const items = query(wrapper.widgetMap.RadioItem).propsHistory();
				ok(
					items.at(0)?.inputProps === undefined,
					"Expected that the first radio item does not have any inputProps defined"
				);
				ok(
					items.at(1)?.inputProps === undefined,
					"Expected that the second radio item does not have any inputProps defined"
				);
			});
		});
	});
});
