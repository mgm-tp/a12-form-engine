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

import { equal, notEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { assertCondition } from "../../../../../back-end/utils/internal/assertions.js";
import { findElementByFormModelPath } from "../../../../../models/index.js";
import { isFormModelEmbeddedRepeat } from "../../../../../models/internal/FormModelGuards.js";
import { DocumentUtils } from "../../../../../models/internal/utils/document-utils.js";
import { DefaultFormModelMap } from "../../../../../view/index.js";
import {
	EMBEDDED_REPEAT,
	REPEAT_CONTENT
} from "../../../../../view/internal/components/form-engine/data-roles.js";
import { EmbeddedRepeat } from "../../../../../view/internal/components/form-engine/repeat/repeats.js";
import { DefaultComponentMap } from "../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { TABLE } from "../../../../rtl-utils/data-roles.js";
import { mockFunctions } from "../../../../rtl-utils/mock-map.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../../utils/assertions.js";
import {
	setupFormEngineRendererWithRtlAsync,
	setupRenderConfiguration
} from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DEP_ELEMENT } from "../../../../utils/test-model-helpers/dependent-element.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";

import type { EmbeddedRepeatTestEnv } from "./utils.js";

export function executeRenderingTests(testEnv: EmbeddedRepeatTestEnv) {
	it("renders the configured EmbeddedRepeat", async () => {
		const formModelMap = mockFunctions(DefaultFormModelMap);
		await setupFormEngineRendererWithRtlAsync({
			models: testEnv.models(),
			config: {
				formModelMap
			}
		});
		query(formModelMap.EmbeddedRepeat.component).assertRenderedTimes(3);
	});

	describe("hidden", () => {
		/**
		 * Repeats have a wrapper at the root that is always rendered:
		 * src/view/internal/components/form-engine/repeat/repeats.tsx
		 *
		 * Therefore, the result of that wrapper is checked.
		 */
		describe("by dependencies", () => {
			async function renderDependency(masterValue: string) {
				const document = DocumentUtils.setValue(
					{} as GroupInstance,
					DEP_ELEMENT.pathToMasterEnumerationGroup,
					masterValue,
					testEnv.dependentElementModels().documentModel
				);

				const EmbeddedRepeat = {
					component: mock.fn(DefaultFormModelMap.EmbeddedRepeat.component)
				};
				const formModelMap = {
					...DefaultFormModelMap,
					EmbeddedRepeat
				};

				await setupFormEngineRendererWithRtlAsync({
					models: testEnv.dependentElementModels(),
					data: { document },
					config: {
						formModelMap
					}
				});

				const call = EmbeddedRepeat.component.mock.calls.find(
					c => c.arguments[0].modelElement.id === DEP_ELEMENT.ENUMERATION.ID_ER
				);
				return call?.result;
			}

			it("renders the component if no group dependencies with case notRelevant applies", async () => {
				const result = await renderDependency("DependentRepeatableReadOnly");
				notEqual(result, null);
			});

			it("does not render the component if a group dependencies with case notRelevant applies", async () => {
				const result = await renderDependency("DependentRepeatableNotRelevant");
				equal(result, null);
			});
		});
	});

	describe("multi file upload", () => {
		it("renders an embedded repeat without an upload area if multi file upload is not set", async () => {
			const { componentMap } = await setupFormEngineRendererWithRtlAsync({
				componentMap: mockFunctions(DefaultComponentMap),
				models: testEnv.models()
			});

			query(componentMap.MultiAttachmentUpload).assertNotRendered();
		});

		it("renders an embedded repeat with an upload area if multi file upload is set to true", async () => {
			const { componentMap } = await setupFormEngineRendererWithRtlAsync({
				componentMap: mockFunctions(DefaultComponentMap),
				models: testEnv.multiFileUploadModels()
			});

			query(componentMap.MultiAttachmentUpload).assertRenderedTimes(2);
		});
	});

	describe("data-role", () => {
		const models = setupModelsFixture("repeat", "embedded");

		it("should render an EmbeddedRepeat with the data-role 'repeat-embedded' on the outermost div and 'repeat-content' on the repeat content container div", async () => {
			const { formModel } = models;
			const embeddedRepeat = findElementByFormModelPath(
				formModel,
				ER.SortingAndFiltering.repeatFormModelPath
			);
			assertExists(embeddedRepeat);
			assertCondition(isFormModelEmbeddedRepeat(embeddedRepeat));

			const renderConfiguration = setupRenderConfiguration({
				models,
				parentPath: ER.SortingAndFiltering.repeatFormModelPath.slice(0, -1)
			});

			const { baseElement } = await rtlRenderWrapperAsync(
				<EmbeddedRepeat modelElement={embeddedRepeat} config={renderConfiguration} />
			);

			const repeat = within(baseElement).getByDataRole(EMBEDDED_REPEAT);
			strictEqual(repeat.id, ER.SortingAndFiltering.ID_ER);

			const repeatContent = within(repeat).getByDataRole(REPEAT_CONTENT);
			strictEqual(repeatContent.parentElement, repeat);

			const repeatTable = within(repeatContent).getByRole(TABLE);
			strictEqual(repeatTable.parentElement, repeatContent);
		});
	});
}
