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
import type { Mock } from "node:test";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { CheckboxInput } from "../../../../../view/internal/components/form-engine/cells/controls/boolean/checkbox-input.js";
import type { Inputs } from "../../../../../view/internal/configuration/engine-configuration.js";
import { changeEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";
import { executeAriaLabelledbyTest } from "./generic-tests/test-cases/aria-labelledby.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("BooleanInput", () => {
		const models = setupModelsFixture("controls.picustypes");

		const documentElementDataType: DocumentModel.BooleanType = { type: "BooleanType" };
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "Checkbox",
			renderFunction: CheckboxInput,
			path: DocumentHelpers.createDocumentPath(["A12T_PicusTypes"], ["Boolean"], ["Boolean01"]),
			formModelPath: createModelPath("foo", "bar")
		};

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(
				() => models,
				{
					...baseProps,
					breakTooltipsToNewLine: true,
					component: "Checkbox"
				},
				{ placeholderTest: false, autoCompleteTest: false }
			);
		});

		describe("aria-labelledby", () => {
			executeAriaLabelledbyTest({ ...baseProps, component: "Checkbox" });
		});

		describe("onChange", () => {
			const path = DocumentHelpers.createDocumentPath(
				["A12T_PicusTypes"],
				["Boolean"],
				["Boolean01"]
			);

			interface MockDispatchConfig extends DispatchConfiguration {
				onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
				onParseError: Mock<DispatchConfiguration["onParseError"]>;
			}

			async function setup(value?: {
				data: string | number | boolean | Date | null | object;
				ui: string;
			}): Promise<{ wrapper: RtlRenderWrapper; dispatchConfig: MockDispatchConfig }> {
				const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
				const dispatchConfig = {
					...stubbedDispatch.eventHandlers,
					onValueChange: mock.fn(),
					onParseError: mock.fn()
				};

				const props: Inputs.InputProps<DocumentModel.BooleanType> = createProps({
					...baseProps,
					models: models,
					path: path,
					modelElement: {},
					dispatchConfig,
					value: value ? { ...value, path } : undefined
				});
				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />);

				return { wrapper, dispatchConfig };
			}

			it("calls onValueChange with the changed data (true -> false)", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.widgetMap.Checkbox).props();
				input?.onChange(false, changeEventMock);

				strictEqual(
					dispatchConfig.onValueChange.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: 1`
				);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					path,
					false,
					baseProps.formModelPath
				]);
			});

			it("calls onValueChange with the changed data (false -> true)", async () => {
				const { wrapper, dispatchConfig } = await setup({ data: false, ui: "false" });
				const input = query(wrapper.widgetMap.Checkbox).props();
				input?.onChange(false, changeEventMock);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					path,
					true,
					baseProps.formModelPath
				]);
			});
		});
	});
});
