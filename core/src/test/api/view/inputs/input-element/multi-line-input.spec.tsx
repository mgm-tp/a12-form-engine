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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { MultilineInput } from "../../../../../view/internal/components/form-engine/cells/controls/string/multi-line-input.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps, primitivePropsTest } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("MultiLineInput", () => {
		const models = setupModelsFixture("controls.dmtypes");

		const documentElementDataType: DocumentModel.StringType = {
			type: "StringType",
			lineBreaksPermitted: true
		};
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "TextAreaStateless",
			renderFunction: MultilineInput,
			path: createDocumentPath(["A12T_DmTypes"], ["String"], ["String04"]),
			formModelPath: createModelPath("foo", "bar")
		} as const;

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(() => models, baseProps, { autoCompleteTest: false });
		});

		describe("autoExpand", () => {
			describe("true", () => {
				it(`renders a BufferedTextArea with prop autoExpand=true`, () => {
					primitivePropsTest({
						models,
						baseProps,
						modelElement: { autoExpand: true },
						propName: "autoExpand",
						propValue: true,
						path: baseProps.path,
						formModelPath: []
					});
				});
			});

			describe("false", () => {
				it(`renders a BufferedTextArea with prop autoExpand=false`, () => {
					primitivePropsTest({
						models,
						baseProps,
						modelElement: { autoExpand: false },
						propName: "autoExpand",
						propValue: false,
						path: baseProps.path,
						formModelPath: []
					});
				});
			});
		});

		describe("onValueSubmit", () => {
			const stringPath = baseProps.path;

			interface MockDispatchConfig extends DispatchConfiguration {
				onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
				onParseError: Mock<DispatchConfiguration["onParseError"]>;
			}

			async function setup(): Promise<{
				wrapper: RtlRenderWrapper;
				dispatchConfig: MockDispatchConfig;
			}> {
				const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
				const dispatchConfig = {
					...stubbedDispatch.eventHandlers,
					onValueChange: mock.fn(),
					onParseError: mock.fn()
				};

				const props = createProps({
					...baseProps,
					models: models,
					path: stringPath,
					modelElement: {},
					dispatchConfig
				});
				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, {
					componentMap: getComponentMocks()
				});

				return { wrapper, dispatchConfig };
			}

			it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.componentMap.BufferedTextArea).props();
				input.onValueSubmit("abc");

				strictEqual(
					dispatchConfig.onValueChange.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: 1`
				);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					"abc",
					baseProps.formModelPath
				]);
			});

			it("strips leading and tailing spaces", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.componentMap.BufferedTextArea).props();
				input.onValueSubmit("   abc def   ");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					"abc def",
					baseProps.formModelPath
				]);
			});

			it("converts empty strings to null", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.componentMap.BufferedTextArea).props();
				input.onValueSubmit("");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					null,
					baseProps.formModelPath
				]);
			});
		});

		// onChange: Tests in test\api\features\dirty-state.spec.ts
	});
});
