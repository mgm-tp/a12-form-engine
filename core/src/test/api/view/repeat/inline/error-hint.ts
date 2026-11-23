// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepEqual, equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
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
	const models = setupModelsFixture("repeat.multi-file-upload");
	const inlineModels = setupModelsFixture("repeat", "inline");

	describe("given an inline repeat with multiFileUpload === false", () => {
		describe("if a row in an inline repeat contains an error for a visible field", () => {
			it("does not render a validation column", async () => {
				const validationMessages = createValidationEntry({
					path: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1], [REPEAT.L1_String]),
					errorCode: "Error"
				});
				const validationColumn = await setupAndReturnValidationColumn(false, validationMessages);
				equal(validationColumn.length, 0, "Expected to find no validation column");
			});
		});

		describe("if a row in an inline repeat contains no field with an error", () => {
			it("does not render a validation column", async () => {
				const validationColumn = await setupAndReturnValidationColumn(false);
				equal(validationColumn.length, 0, "Expected to find no validation column");
			});
		});

		describe("if a row in an inline repeat contains an error for a non visible field", () => {
			it("does not render a validation column", async () => {
				const validationMessagesNonVisible = createValidationEntry({
					path: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL9], [REPEAT.L1_Number]),
					errorCode: "Error"
				});

				const validationMessagesVisible = createValidationEntry({
					path: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1], [REPEAT.L1_String]),
					errorCode: "Error"
				});

				const validationColumn = await setupAndReturnValidationColumn(false, {
					...validationMessagesNonVisible,
					...validationMessagesVisible
				});
				equal(validationColumn.length, 0, "Expected to find no validation column");
			});
		});
	});

	describe("given an inline repeat with multiFileUpload === true", () => {
		describe("if a row in an inline repeat contains an error for a visible field", () => {
			it("does not render a validation column", async () => {
				const validationMessages = createValidationEntry({
					path: createDocumentPath(["Root"], ["AttachmentCollection"], ["StringField"]),
					errorCode: "Error",
					errorText: [
						{
							key: "Test",
							args: {},
							defaults: {
								de: "ErrorMessage.de",
								en: "ErrorMessage.en"
							}
						}
					]
				});
				const validationColumn = await setupAndReturnValidationColumn(true, validationMessages);
				equal(validationColumn.length, 0, "Expected to find no validation column");
			});
		});

		describe("if a row in an inline repeat contains no field with an error", () => {
			it("does not render a validation column", async () => {
				const validationColumn = await setupAndReturnValidationColumn(true);
				equal(validationColumn.length, 0, "Expected to find no validation column");
			});
		});

		describe("if a row in an inline repeat contains an error for a non visible field", () => {
			it("renders a validation column with an error hint containing all error messages for non visible fields", async () => {
				const nonVisibleErrorLocalizable: Localizable = {
					key: "ErrorMessageNonVisible"
				};

				const visibleErrorLocalizable: Localizable = {
					key: "ErrorMessageVisible"
				};

				const validationMessagesNonVisible = createValidationEntry({
					path: createDocumentPath(["Root"], ["AttachmentCollection"], ["NumberField"]),
					errorCode: "Error",
					errorText: [nonVisibleErrorLocalizable]
				});

				const validationMessagesVisible = createValidationEntry({
					path: createDocumentPath(["Root"], ["AttachmentCollection"], ["StringField"]),
					errorCode: "Error",
					errorText: [visibleErrorLocalizable]
				});

				const validationColumn = await setupAndReturnValidationColumn(true, {
					...validationMessagesNonVisible,
					...validationMessagesVisible
				});
				equal(validationColumn.length, 1, "Expected to find a validation column");

				deepEqual(validationColumn, [[nonVisibleErrorLocalizable.key]]);
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
			EmbeddedRepeat: { component: () => null },
			DetachedRepeat: { component: () => null }
		};
		const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
			config: {
				formModelMap
			},
			models: multiFileUpload ? models : inlineModels,
			data: multiFileUpload
				? {
						document: {
							Root: {
								AttachmentCollection: [{}]
							}
						}
					}
				: { document: { Root: { Nested_L1: [{}] } } },
			ui: {
				screenLocation: [
					{
						locationPath: multiFileUpload ? createModelPath("Screen1") : createModelPath("Paging"),
						path: []
					}
				],
				messages: validationMessages
			}
		});
		return query(wrapper.widgetMap.ErrorTooltip).maybePropsHistory().map(messageKeysForTooltip);
	}
}
