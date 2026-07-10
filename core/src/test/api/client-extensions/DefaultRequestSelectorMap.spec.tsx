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

import { partialDeepStrictEqual, throws } from "node:assert/strict";

import type { Model as ModelAPI } from "@com.mgmtp.a12.base/base-model-api";
import type { Activity, Model } from "@com.mgmtp.a12.client/client-core";
import {
	ModuleRegistryProvider,
	ModuleTestExtensions,
	NEW_INSTANCE_IDENTIFIER
} from "@com.mgmtp.a12.client/client-core";
import type { DynamicFlow, ModelMap } from "@com.mgmtp.a12.client/client-core";
import type { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { Settings } from "@com.mgmtp.a12.utils/utils-logging";

import { DefaultRequestSelectorMap } from "../../../client-extensions/internal/extensions/platform-server-connectors/internal/providers/DefaultRequestSelectorMap.js";
import {
	createActivity,
	createDataHolder,
	createStore,
	createTestConfig
} from "../../utils/client-helpers.js";
import { createFormModelContent } from "../../utils/FormModelHelpers.js";

interface Options {
	readonly descriptor?: Activity.Descriptor;
	readonly data?: Record<string, unknown>;
	readonly models?: Model.Descriptor[];
	readonly modelMap?: ModelMap;
	readonly modelGraph?: Partial<ModelGraph>;
}

describe("api.client-extensions.DefaultRequestSelectorMap", () => {
	const strategy = Settings.LogStrategy;

	before(() => {
		Settings.resetLogStrategy();
	});

	after(() => {
		ModuleTestExtensions.reset();
		Settings.LogStrategy = strategy;
	});

	const TEST_LOCALE: Locale = { language: "A", country: "B" };

	function setupState(options: Options = {}) {
		const descriptor = options.descriptor ?? { instance: "DM/1" };

		const { store } = createStore({
			locale: TEST_LOCALE,
			activities: [
				createActivity({
					descriptor,
					dataHolders: [
						createDataHolder({
							descriptor,
							data: options.data ?? {
								document: { id: descriptor.instance, modelId: "DM", prop: true }
							}
						})
					]
				})
			],
			modelMap: options.modelMap ?? {
				FM: {
					header: {
						id: "FM",
						modelType: "form",
						modelVersion: "1",
						modelReferences: [{ reference: "DM", modelType: "document" }]
					},
					content: createFormModelContent()
				},
				DM: {
					header: { id: "DM", modelType: "document", modelVersion: "1" },
					content: { modelConfig: { timeZone: "UTC" }, modelRoot: { elements: [] } },
					generatedCodeAccessor: {}
				} as ModelAPI
			},
			modelGraph: options.modelGraph ?? {
				genericModels: [
					{
						modelId: "FM",
						type: "form",
						modelReferences: [{ reference: "DM", modelType: "document" }]
					}
				]
			}
		});

		const TEST_FLOW: DynamicFlow = {
			name: "test-flow",
			scenes: [
				{
					name: "test-scene",
					matches: d => d === descriptor,
					sceneChange: {
						onEnter: [
							{
								type: "DYNAMIC_ADD_VIEW",
								region: "/CONTENT",
								component: () => <div />,
								models: options.models ?? [
									{ modelType: "form", name: "FM" },
									{ modelType: "document", name: "DM" }
								]
							}
						]
					}
				}
			]
		};
		ModuleRegistryProvider.getInstance().addModule({
			id: "test-module",
			flows: () => [TEST_FLOW]
		});

		return store.getState();
	}

	describe("load", () => {
		it("query properties are set correctly when form model already loaded", () => {
			const state = setupState();
			const config = createTestConfig({ operation: "load" });

			const result = DefaultRequestSelectorMap.load(config)(state);

			partialDeepStrictEqual(result, {
				method: "QUERY",
				params: { query: { targetDocumentModel: "DM", constraint: { value: "DM/1" } } }
			});
		});

		it("throws when form model does not exist in model graph", () => {
			const state = setupState({ modelGraph: { genericModels: [] } });
			const config = createTestConfig({ operation: "load" });

			throws(() => DefaultRequestSelectorMap.load(config)(state), /Referenced document model/i);
		});

		it("throws when form model does not exist in the scene", () => {
			const state = setupState({ models: [] });
			const config = createTestConfig({ operation: "load" });

			throws(() => DefaultRequestSelectorMap.load(config)(state), /Referenced document model/i);
		});

		it("throws when activity instance is not set", () => {
			const state = setupState({ descriptor: { noInstance: "true" } });
			const config = createTestConfig({ operation: "load" });

			throws(() => DefaultRequestSelectorMap.load(config)(state), /Activity instance is not set/i);
		});
	});

	describe("save", () => {
		it("throws when activity data is not form data", () => {
			const state = setupState({ data: { other: true } });
			const config = createTestConfig({ operation: "save" });

			throws(() => DefaultRequestSelectorMap.save(config)(state), /Activity data/i);
		});

		it("throws when form model does not exist", () => {
			const state = setupState({ models: [] });
			const config = createTestConfig({ operation: "save" });

			throws(() => DefaultRequestSelectorMap.save(config)(state), /No form model found/i);
		});

		it("throws when document model does not exist", () => {
			const state = setupState({
				models: [{ modelType: "form", name: "FM" }],
				modelMap: {
					FM: {
						header: { id: "FM", modelType: "form", modelVersion: "1", modelReferences: [] },
						content: createFormModelContent()
					}
				}
			});
			const config = createTestConfig({ operation: "save" });

			throws(() => DefaultRequestSelectorMap.save(config)(state), /document model reference/i);
		});

		it("request properties are set correctly for add", () => {
			const state = setupState({ descriptor: { instance: NEW_INSTANCE_IDENTIFIER } });
			const config = createTestConfig({ operation: "save" });

			const result = DefaultRequestSelectorMap.save(config)(state);

			partialDeepStrictEqual(result, [
				{ method: "CHECK_UNIQUENESS", params: { documentModelName: "DM" } },
				{
					method: "ADD_DOCUMENT",
					params: { documentModelName: "DM", locale: TEST_LOCALE.language }
				}
			]);
		});

		it("request properties are set correctly for modify", () => {
			const state = setupState();
			const config = createTestConfig({ operation: "save" });

			const result = DefaultRequestSelectorMap.save(config)(state);

			partialDeepStrictEqual(result, [
				{ method: "CHECK_UNIQUENESS", params: { docRef: "DM/1" } },
				{
					method: "MODIFY_DOCUMENT",
					params: { docRef: "DM/1", locale: TEST_LOCALE.language }
				}
			]);
		});
	});

	describe("delete", () => {
		it("request properties are set correctly", () => {
			const instance = "doc/1";

			const state = setupState();
			const config = createTestConfig({
				operation: "delete",
				details: { instanceId: instance }
			});

			const result = DefaultRequestSelectorMap.delete(config)(state);

			partialDeepStrictEqual(result, {
				method: "DELETE_DOCUMENT",
				params: { docRef: instance, locale: TEST_LOCALE.language }
			});
		});
	});
});
