// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepEqual, equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import type { FormModelMap } from "../../../../../view/index.js";
import { DefaultFormModelMap } from "../../../../../view/index.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { REPEAT } from "../../../../utils/test-model-helpers/repeat.js";
import { createValidationEntry } from "../../../../utils/validation.js";

import { messageKeysForTooltip } from "../tooltip-message-keys.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;

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

		const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
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
