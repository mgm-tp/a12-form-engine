// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore, Models } from "../../../../../../back-end/store/index.js";
import { DataSelectors, Events, UiStateSelectors } from "../../../../../../back-end/store/index.js";
import {
	DocumentPath,
	DocumentUtils
} from "../../../../../../models/internal/utils/document-utils.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";

const { createDocumentPath } = DocumentHelpers;

export function executeChainedDependencyTests(models: Models) {
	const MASTER_FIELD_PATH = createDocumentPath(["ChainedDependencies"], ["masterField"]);
	const MASTER_FIELD_2_PATH = createDocumentPath(["ChainedDependencies"], ["masterField2"]);
	const DEPENDENT_FIELD_VALUE = createDocumentPath(
		["ChainedDependencies"],
		["DependentFieldValue"]
	);
	const DEPENDENT_VALUE = createDocumentPath(["ChainedDependencies"], ["DependentValue"]);

	const errorPathDependentValue = DocumentPath.toString(DEPENDENT_VALUE);
	const errorPathDependentFieldValue = DocumentPath.toString(DEPENDENT_FIELD_VALUE);

	const ui: Partial<EngineStore.UIState> = {
		screenLocation: [
			{
				locationPath: [
					{
						elementName: "Dependency Chains"
					}
				],
				path: []
			}
		]
	};

	describe("Given a master field which will set the value of a second master field which", () => {
		describe("sets the DependentValue field", () => {
			it("sets the value and error messages correctly", () => {
				const store = DEP_ELEMENT.setupStore({ models, ui });
				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: "value",
						formModelElementPath: []
					})
				);
				const messages = UiStateSelectors.messages()(store.getState());

				const document = DataSelectors.document()(store.getState());
				const value = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: MASTER_FIELD_2_PATH
				});

				strictEqual(value, "dependent_value");
				strictEqual(Object.keys(messages).length, 1);

				const error = messages[errorPathDependentValue];
				notStrictEqual(error, undefined, "Expected to find an error for the `DependentValue`!");
				deepStrictEqual(error?.validationMessages[0].errorText, [
					{
						key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ChainedDependencies.notHello",
						args: {},
						defaults: {
							en: 'Content should not be "Hello"!'
						}
					}
				]);
			});
		});

		describe("sets the DependentFieldValue field", () => {
			it("sets the value and error messages correctly", () => {
				const store = DEP_ELEMENT.setupStore({ models, ui });
				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: "fieldValue",
						formModelElementPath: []
					})
				);
				const messages = UiStateSelectors.messages()(store.getState());

				const document = DataSelectors.document()(store.getState());
				const value = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: MASTER_FIELD_2_PATH
				});

				strictEqual(value, "dependent_field_value");
				strictEqual(Object.keys(messages).length, 1);

				const error = messages[errorPathDependentFieldValue];
				notStrictEqual(
					error,
					undefined,
					"Expected to find an error for the `DependentFieldValue`!"
				);
				deepStrictEqual(error?.validationMessages[0].errorText, [
					{
						key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ChainedDependencies.notWorld",
						args: {},
						defaults: {
							en: 'Content should not be "World"!'
						}
					}
				]);
			});
		});
	});
}
