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

import { deepStrictEqual, equal, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { StringInput } from "../../../../../view/internal/components/form-engine/cells/controls/string/string-input.js";
import type { ComponentMap } from "../../../../../view/internal/configuration/componentMap/component-map.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("StringInput", () => {
		const models = setupModelsFixture("controls.picustypes");

		const documentElementDataType: DocumentModel.StringType = {
			type: "StringType",
			lineBreaksPermitted: false
		};
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			renderFunction: StringInput,
			component: "BufferedTextLine",
			path: DocumentHelpers.createDocumentPath(["A12T_PicusTypes"], ["String"], ["String01"]),
			formModelPath: createModelPath("foo", "bar")
		} as const;

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(() => models, baseProps);
		});

		describe("onValueSubmit", () => {
			const stringPath = DocumentHelpers.createDocumentPath(
				["A12T_PicusTypes"],
				["String"],
				["String01"]
			);

			interface MockDispatchConfig extends DispatchConfiguration {
				onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
				onParseError: Mock<DispatchConfiguration["onParseError"]>;
			}

			async function setup(
				componentMap: ComponentMap = getComponentMocks()
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
					path: stringPath,
					modelElement: {},
					dispatchConfig
				});
				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, {
					componentMap
				});

				return { wrapper, dispatchConfig };
			}

			it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.componentMap.BufferedTextLine).props();
				input.onValueSubmit("abc");

				strictEqual(
					dispatchConfig.onValueChange.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
				);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					"abc",
					baseProps.formModelPath
				]);
			});

			it("strips leading and tailing spaces", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.componentMap.BufferedTextLine).props();
				input.onValueSubmit("   abc def   ");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					"abc def",
					baseProps.formModelPath
				]);
			});

			it("converts empty strings to null", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.componentMap.BufferedTextLine).props();
				input.onValueSubmit("");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					null,
					baseProps.formModelPath
				]);
			});
		});

		describe("secret", () => {
			async function executeTest(secret?: boolean): Promise<void> {
				const stringPath = DocumentHelpers.createDocumentPath(
					["A12T_PicusTypes"],
					["String"],
					["String01"]
				);
				const props = createProps<DocumentModel.StringType>({
					documentElement: baseProps.documentElement,
					documentElementDataType: baseProps.documentElementDataType,
					models,
					modelElement: { secret },
					formModelPath: [],
					value: {
						data: "",
						ui: "",
						path: stringPath
					}
				});

				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, {
					componentMap: getComponentMocks()
				});
				const input = query(wrapper.componentMap.BufferedTextLine).props();
				if (secret) {
					equal(input.inputProps?.type, "password");
				} else {
					equal(input.inputProps?.type, undefined);
				}
			}
			describe("true", () => {
				it(`renders a(n) ${baseProps.component} where inputProps.type is set to 'password'`, async () => {
					await executeTest(true);
				});
			});

			describe("false", () => {
				it(`renders a(n) ${baseProps.component}  where inputProps.type is undefined`, async () => {
					await executeTest(false);
				});
			});
		});

		// onChange: Tests in test\api\features\dirty-state.spec.ts
	});
});
