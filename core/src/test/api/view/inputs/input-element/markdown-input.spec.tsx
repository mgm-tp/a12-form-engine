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

import { createEngineStore } from "../../../../../back-end/store/index.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { MarkdownInput } from "../../../../../view/internal/components/form-engine/cells/controls/string/markdown-input.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("MarkdownInput", () => {
		const models = setupModelsFixture("controls.dmtypes");

		const documentElementDataType: DocumentModel.StringType = {
			type: "StringType",
			lineBreaksPermitted: true
		};
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "MarkdownEditor",
			renderFunction: MarkdownInput,
			path: createDocumentPath(["A12T_DmTypes"], ["String"], ["String04"]),
			formModelPath: createModelPath("foo", "bar")
		} as const;

		/**
		 * `MarkdownEditor` does not yet accept `ariaDescribedby` or raw HTML input
		 * attributes (`aria-required`, `autoComplete`), so those generic checks are
		 * skipped until the widget's API grows that support.
		 *
		 * Its `tooltips` prop is also its only one for tooltip content - unlike other
		 * widgets, it has no separate `addonAfter` slot for the non-`tooltipsOnTop` case
		 * (matching `MarkdownEditorProps` itself omitting `breakTooltipsToNewLine`, the
		 * same "on-top vs. regular position" distinction other inputs make). The hint/
		 * validation tooltip generic checks assume that split exists, so they're skipped
		 * here too.
		 */
		describe("General", () => {
			inputTest(() => models, baseProps, {
				autoCompleteTest: false,
				ariaRequiredTest: false,
				ariaDescribedbyTest: false,
				hintTooltipTest: false,
				validationTooltipsTest: false
			});
		});

		describe("onChange", () => {
			const stringPath = baseProps.path;

			interface MockDispatchConfig extends DispatchConfiguration {
				onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
			}

			async function setup(): Promise<{
				wrapper: RtlRenderWrapper;
				dispatchConfig: MockDispatchConfig;
			}> {
				const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
				const dispatchConfig = {
					...stubbedDispatch.eventHandlers,
					onValueChange: mock.fn()
				};

				const props = createProps({
					...baseProps,
					models,
					path: stringPath,
					modelElement: {},
					dispatchConfig
				});
				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, {});

				return { wrapper, dispatchConfig };
			}

			it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.widgetMap.MarkdownEditor).props();
				input.onChange("abc");

				strictEqual(dispatchConfig.onValueChange.mock.callCount(), 1);
				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					"abc",
					baseProps.formModelPath
				]);
			});

			it("strips leading and trailing whitespace", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.widgetMap.MarkdownEditor).props();
				input.onChange("  # Heading  \n");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					"# Heading",
					baseProps.formModelPath
				]);
			});

			it("converts empty markdown to null", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.widgetMap.MarkdownEditor).props();
				input.onChange("   ");

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					stringPath,
					null,
					baseProps.formModelPath
				]);
			});
		});

		describe("markdownAttachmentRepeatPath", () => {
			it("wires the ImageUploadPlugin into the widget when the control has one configured", async () => {
				const markdownAttachmentRepeatPath = createModelPath("Screen1", "markdownImages");
				const props = createProps({
					...baseProps,
					models,
					modelElement: { markdownAttachmentRepeatPath }
				});
				const Component = baseProps.renderFunction;
				// A set markdownAttachmentRepeatPath makes MarkdownInput build its own onImageUpload
				// handler, which requires an EngineStoreContext to be provided.
				const engineState = createEngineStore({ data: {}, models, locale: US_LOCALE });
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, { engineState });

				strictEqual(query(wrapper.widgetMap.MarkdownEditor).props().plugins !== undefined, true);
			});

			it("leaves the widget plain when the control has none configured", async () => {
				const props = createProps({ ...baseProps, models, modelElement: {} });
				const Component = baseProps.renderFunction;
				const engineState = createEngineStore({ data: {}, models, locale: US_LOCALE });
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, { engineState });

				strictEqual(query(wrapper.widgetMap.MarkdownEditor).props().plugins, undefined);
			});
		});
	});
});
