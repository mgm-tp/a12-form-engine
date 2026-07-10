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

import { deepEqual, equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import type { FormModelMap } from "../../../../../view/index.js";
import { DefaultFormModelMap } from "../../../../../view/index.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { REPEAT } from "../../../../utils/test-model-helpers/repeat.js";
import { createValidationEntry } from "../../../../utils/validation.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";

import { messageKeysForTooltip } from "../tooltip-message-keys.js";

export function executeErrorHintTest(): void {
	const models = setupModelsFixture("repeat", "embedded");
	const multiFileUploadModels = setupModelsFixture("repeat.multi-file-upload");

	describe("given an embedded repeat with multiFileUpload === false", () => {
		describe("if a row in an embedded repeat contains at least one field with an error", () => {
			it("renders a validation column with an error hint inside it when the row is collapsed", async () => {
				const validationMessages = createValidationEntry({
					path: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL9], [REPEAT.L9_Number]),
					errorCode: "Input required"
				});

				const errorTooltips = await setupAndReturnValidationColumn(false, validationMessages);

				equal(errorTooltips.length, 1);
			});
		});

		describe("if a row in an embedded repeat contains no field with an error", () => {
			it("does not render a validation column when the row is collapsed", async () => {
				const errorTooltips = await setupAndReturnValidationColumn(false);
				equal(errorTooltips.length, 0, "Expected to find no validation column");
			});
		});

		describe("if a row in an embedded repeat contains an error for a non visible field", () => {
			it("does not render a validation column when the row is collapsed", async () => {
				const validationMessages = createValidationEntry({
					path: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL9], [REPEAT.L9_Invisible]),
					errorCode: "Input required"
				});

				const errorTooltips = await setupAndReturnValidationColumn(false, validationMessages);
				equal(errorTooltips.length, 0, "Expected to find no validation column");
			});
		});
	});

	describe("given an embedded repeat with multiFileUpload === true", () => {
		describe("if a row in an embedded repeat contains at least one field with an error", () => {
			it("renders a validation column with an error hint containing all error messages when the row is collapsed", async () => {
				const errorMessageLocalizable: Localizable = {
					key: "Test"
				};
				const validationMessages = createValidationEntry({
					path: createDocumentPath(["Root"], ["AttachmentCollection"], ["StringField"]),
					errorCode: "Error",
					errorText: [errorMessageLocalizable]
				});
				const errorTooltips = await setupAndReturnValidationColumn(true, validationMessages);
				deepEqual(errorTooltips, [["Test"]]);
			});
		});

		describe("if a row in an embedded repeat contains no field with an error", () => {
			it("does not render a validation column when the row is collapsed", async () => {
				const validationColumn = await setupAndReturnValidationColumn(true);
				deepEqual(validationColumn.length, 0, "Expected to find no validation column");
			});
		});

		describe("if a row in an embedded repeat contains an error for a non visible field", () => {
			it("renders a validation column with an error hint containing all error messages when the row is collapsed", async () => {
				const errorMessageLocalizable: Localizable = {
					key: "Test"
				};
				const validationMessages = createValidationEntry({
					path: createDocumentPath(["Root"], ["AttachmentCollection"], ["NumberField"]),
					errorCode: "Error",
					errorText: [errorMessageLocalizable]
				});
				const errorTooltips = await setupAndReturnValidationColumn(true, validationMessages);
				deepEqual(errorTooltips, [["Test"]]);
			});
		});
	});

	async function setupAndReturnValidationColumn(
		multiFileUpload: boolean,
		validationMessages?: ReadonlyObjectMap<EngineStore.Validation.Entry>
	): Promise<string[][]> {
		// skip rendering of other repeat types so that we only get tooltips
		// from embedded repeats
		const formModelMap: FormModelMap = {
			...DefaultFormModelMap,
			InlineRepeat: { component: () => null },
			DetachedRepeat: { component: () => null }
		};

		const wrapper = await setupFormEngineRendererWithRtlAsync({
			config: {
				formModelMap
			},
			models: multiFileUpload ? multiFileUploadModels : models,
			data: multiFileUpload
				? {
						document: {
							Root: {
								AttachmentCollection: [{}]
							}
						}
					}
				: { document: { Root: { Nested_L9: [{}] } } },
			ui: {
				screenLocation: [
					{
						locationPath: multiFileUpload
							? createModelPath("Screen1")
							: createModelPath("ErrorHint"),
						path: []
					}
				],
				messages: validationMessages
			}
		});

		return query(wrapper.widgetMap.ErrorTooltip).maybePropsHistory().map(messageKeysForTooltip);
	}
}
