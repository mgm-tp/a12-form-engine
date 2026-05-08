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
