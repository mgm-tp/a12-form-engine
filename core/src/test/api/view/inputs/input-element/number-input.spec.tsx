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

import { deepEqual, deepStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { act } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel, EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { ValueConversionParseError } from "@com.mgmtp.a12.utils/utils-localization";

import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { NumberInput } from "../../../../../view/internal/components/form-engine/cells/controls/number/number-input.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("NumberInput", () => {
		const models = setupModelsFixture("controls.dmtypes");

		const documentElementDataType: DocumentModel.NumberType = {
			type: "NumberType",
			zeroNotAllowed: true
		};

		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "TextField",
			renderFunction: NumberInput,
			formModelPath: createModelPath("foo", "bar")
		};

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(
				() => models,
				{
					...baseProps,
					component: "TextField",
					path: createDocumentPath(["A12T_DmTypes"], ["Number"], ["Number01"])
				},
				{ suffixTest: true, truncateSuffixTest: true, autoCompleteTest: false }
			);
		});

		describe("onValueSubmit", () => {
			const numberPath = createDocumentPath(["A12T_DmTypes"], ["Number"], ["Number01"]);

			interface MockDispatchConfig extends DispatchConfiguration {
				onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
				onParseError: Mock<DispatchConfiguration["onParseError"]>;
			}

			async function setup(
				path?: EntityInstancePath
			): Promise<{ wrapper: RtlRenderWrapper; dispatchConfig: MockDispatchConfig }> {
				const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
				const dispatchConfig = {
					...stubbedDispatch.eventHandlers,
					onValueChange: mock.fn(),
					onParseError: mock.fn()
				};

				const props = createProps({
					...baseProps,
					models: models,
					path: path || numberPath,
					modelElement: {},
					dispatchConfig
				});
				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, {
					componentMap: getComponentMocks()
				});

				return { wrapper, dispatchConfig };
			}

			describe("if the input is valid", () => {
				it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
					const { wrapper, dispatchConfig } = await setup();
					const input = query(wrapper.componentMap.BufferedTextLine).props();
					await act(() => input.onValueSubmit("2"));

					strictEqual(
						dispatchConfig.onValueChange.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
					);

					deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
						numberPath,
						2,
						baseProps.formModelPath
					]);
				});

				it("can handle inputs with leading zeros for fields with 'leadingZerosAllowed'", async () => {
					const { wrapper, dispatchConfig } = await setup();
					const input = query(wrapper.componentMap.BufferedTextLine).props();
					await act(() => input.onValueSubmit("002"));

					strictEqual(
						dispatchConfig.onValueChange.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
					);

					deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
						numberPath,
						"002",
						baseProps.formModelPath
					]);
				});

				it("leading zeros are removed if the field does not have 'leadingZerosAllowed' set", async () => {
					const fieldWithNotLeadingZerosAllowed = createDocumentPath(
						["A12T_DmTypes"],
						["Number"],
						["Number04"]
					);
					const { wrapper, dispatchConfig } = await setup(fieldWithNotLeadingZerosAllowed);
					const input = query(wrapper.componentMap.BufferedTextLine).props();
					await act(() => input.onValueSubmit("002"));

					strictEqual(
						dispatchConfig.onValueChange.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
					);

					deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
						fieldWithNotLeadingZerosAllowed,
						2,
						baseProps.formModelPath
					]);
				});

				it("strips leading and tailing spaces", async () => {
					const { wrapper, dispatchConfig } = await setup();
					const input = query(wrapper.componentMap.BufferedTextLine).props();
					await act(() => input.onValueSubmit("   2   "));

					deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
						numberPath,
						2,
						baseProps.formModelPath
					]);
				});
			});

			describe("if the input is invalid", () => {
				it("calls onParseError with the correct arguments from the dispatch configuration", async () => {
					const { wrapper, dispatchConfig } = await setup();
					const input = query(wrapper.componentMap.BufferedTextLine).props();
					await act(() => input.onValueSubmit("abc"));

					const expectedErrorCode = "zahlHatUngueltigeZeichen";

					strictEqual(
						dispatchConfig.onParseError.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onParseError.mock.callCount()} time(s). Expected call count: ${1}`
					);

					const args = dispatchConfig.onParseError.mock.calls[0].arguments;

					deepEqual(args[0], numberPath);
					deepEqual(args[1], "abc");
					deepEqual((args[2] as ValueConversionParseError).errorCode, expectedErrorCode);
				});
			});
		});

		// onChange: Tests in test\api\features\dirty-state.spec.ts
	});
});
