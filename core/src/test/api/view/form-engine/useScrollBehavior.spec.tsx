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

import { strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { waitFor } from "@testing-library/react";
import { act, useState } from "react";
import { Provider } from "react-redux";

import type { Model as ModelAPI } from "@com.mgmtp.a12.base/base-model-api";
import type { ModelMap } from "@com.mgmtp.a12.client/client-core";
import {
	ActivityActions,
	ModelActions,
	ModuleRegistryProvider,
	ModuleTestExtensions,
	NEW_INSTANCE_IDENTIFIER
} from "@com.mgmtp.a12.client/client-core";
import type { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access";
import { render } from "@com.mgmtp.a12.devtools/react";
import { Settings } from "@com.mgmtp.a12.utils/utils-logging";

import { useScrollBehavior } from "../../../../client-extensions/internal/extensions/form-engine/internal/useScrollBehavior.js";
import { createActivity, createStore } from "../../../utils/client-helpers.js";
import { createFormModelContent } from "../../../utils/FormModelHelpers.js";

interface Options {
	readonly existing: Omit<NonNullable<Parameters<typeof createActivity>[0]>, "id">;
	readonly replacement?: Omit<NonNullable<Parameters<typeof createActivity>[0]>, "id">;
	/** id of the form's initially focused element, `false` for a form that has none, defaults to "control1" */
	readonly focusElementId?: string | false;
	/** when true, the form model is not put into the store until `ModelActions.setModels` is dispatched */
	readonly deferModelData?: boolean;
}

const FORM_MODEL_GRAPH: Partial<ModelGraph> = {
	genericModels: [
		{ modelId: "FM", type: "form", modelReferences: [{ reference: "DM", modelType: "document" }] }
	]
};

function formModelMap(initiallyFocusedElementId: string | undefined): ModelMap {
	const content = createFormModelContent();

	return {
		FM: {
			header: {
				id: "FM",
				modelType: "form",
				modelVersion: "1",
				modelReferences: [{ reference: "DM", modelType: "document" }]
			},
			content: {
				...content,
				screens: [{ ...content.screens[0], initiallyFocusedElementId }]
			}
		},
		DM: {
			header: { id: "DM", modelType: "document", modelVersion: "1" },
			content: { modelConfig: { timeZone: "UTC" }, modelRoot: { elements: [] } },
			generatedCodeAccessor: {}
		} as ModelAPI
	};
}

function registerFormModuleForDescriptors(targetDescriptors: ReadonlyArray<unknown>) {
	ModuleRegistryProvider.getInstance().addModule({
		id: "test-module",
		flows: () => [
			{
				name: "test-flow",
				scenes: [
					{
						name: "test-scene",
						matches: d => targetDescriptors.includes(d),
						sceneChange: {
							onEnter: [
								{
									type: "DYNAMIC_ADD_VIEW",
									region: "/CONTENT",
									component: () => <div />,
									models: [
										{ modelType: "form", name: "FM" },
										{ modelType: "document", name: "DM" }
									]
								}
							]
						}
					}
				]
			}
		]
	});
}

describe("api.client-extensions.useScrollBehavior", () => {
	const strategy = Settings.LogStrategy;

	before(() => {
		Settings.resetLogStrategy();
	});

	after(() => {
		ModuleTestExtensions.reset();
		Settings.LogStrategy = strategy;
	});

	async function setup({
		existing,
		replacement,
		focusElementId = "control1",
		deferModelData
	}: Options) {
		const EXISTING_ID = "1";
		const REPLACEMENT_ID = "2";

		const { store } = createStore({
			activities: [
				createActivity({ id: EXISTING_ID, ...existing }),
				createActivity({ id: REPLACEMENT_ID, ...replacement })
			],
			modelMap: deferModelData
				? {}
				: formModelMap(focusElementId === false ? undefined : focusElementId),
			modelGraph: FORM_MODEL_GRAPH,
			dataHandlers: [{ name: "FallbackProvider", canHandle: () => true, *provideData() {} }]
		});

		registerFormModuleForDescriptors([descriptor, existingInstanceDescriptor]);

		const scrollToTop = mock.fn();
		const focusElement = mock.fn();

		function Wrapper() {
			const [activityId, setId] = useState(EXISTING_ID);

			useScrollBehavior({
				activityId,
				scrollRef: { current: { focusElement, scrollToTop } },
				disable: false
			});

			return <button id="replaceActivity" onClick={() => setId(REPLACEMENT_ID)} />;
		}

		const result = await act(() =>
			render(
				<Provider store={store}>
					<Wrapper />
				</Provider>
			)
		);

		function assertCalled(countFocus: number, countTop: number) {
			strictEqual(
				focusElement.mock.callCount(),
				countFocus,
				`focusElement call count ${focusElement.mock.callCount()} != ${countFocus}`
			);
			strictEqual(
				scrollToTop.mock.callCount(),
				countTop,
				`scrollToTop call count ${scrollToTop.mock.callCount()} != ${countTop}`
			);
		}

		return { button: result.queryById("replaceActivity"), assertCalled, store };
	}

	const descriptor = { instance: NEW_INSTANCE_IDENTIFIER };
	const existingInstanceDescriptor = { instance: "doc/1" };

	describe("given an id for an activity which is", () => {
		it("not loaded and contains a new instance -> ScrollApi is not called", async () => {
			const { assertCalled } = await setup({
				existing: { loadingState: "loading", descriptor }
			});

			await waitFor(() => assertCalled(0, 0));
		});

		it("loaded and contains an existing instance -> scrollToTop is called", async () => {
			const { assertCalled } = await setup({
				existing: { loadingState: "loaded", descriptor: existingInstanceDescriptor }
			});

			await waitFor(() => assertCalled(0, 1));
		});

		it("loaded and contains an existing instance whose model is only registered after loading has finished -> scrollToTop is called exactly once", async () => {
			const { assertCalled, store } = await setup({
				existing: { loadingState: "loaded", descriptor: existingInstanceDescriptor },
				deferModelData: true
			});

			await waitFor(() => assertCalled(0, 1));

			await act(() => store.dispatch(ModelActions.setModels(formModelMap("control1"))));

			await waitFor(() => assertCalled(0, 1));
		});

		describe("loaded and contains a new instance", () => {
			it("focusElement is called once", async () => {
				const { assertCalled } = await setup({
					existing: { loadingState: "loaded", descriptor }
				});

				await waitFor(() => assertCalled(1, 0));
			});

			it("but the form has no initially focused element -> scrollToTop is called instead of focusElement", async () => {
				const { assertCalled } = await setup({
					existing: { loadingState: "loaded", descriptor },
					focusElementId: false
				});

				await waitFor(() => assertCalled(0, 1));
			});

			it("but the form model is only registered after loading has finished -> focusElement is called once it becomes available", async () => {
				const { assertCalled, store } = await setup({
					existing: { loadingState: "loaded", descriptor },
					deferModelData: true
				});

				await waitFor(() => assertCalled(0, 0));

				await act(() => store.dispatch(ModelActions.setModels(formModelMap("control1"))));

				await waitFor(() => assertCalled(1, 0));
			});

			it("and then the loading state changes to something else -> focusElement is not called again", async () => {
				const { assertCalled, store } = await setup({
					existing: { loadingState: "loaded", descriptor }
				});

				await act(() => store.dispatch(ActivityActions.loadData({ activityId: "1" })));

				await waitFor(() => assertCalled(1, 0));
			});

			it("and then the loading state changes twice (back to loaded) -> focusElement is not called again", async () => {
				const { assertCalled, store } = await setup({
					existing: { loadingState: "loaded", descriptor }
				});

				await act(() => store.dispatch(ActivityActions.loadData({ activityId: "1" })));
				await act(() => store.dispatch(ActivityActions.setData({ activityId: "1", data: {} })));

				await waitFor(() => assertCalled(1, 0));
			});

			describe("and then the activity is replaced by another one which", () => {
				it("is still loaded and contains a new instance -> focusElement is called again", async () => {
					const { assertCalled, button } = await setup({
						existing: { loadingState: "loaded", descriptor },
						replacement: { loadingState: "loaded", descriptor }
					});

					await act(() => button?.click());

					await waitFor(() => assertCalled(2, 0));
				});

				it("is not loaded -> focusElement is not called again", async () => {
					const { assertCalled, button } = await setup({
						existing: { loadingState: "loaded", descriptor },
						replacement: { loadingState: "error", descriptor }
					});

					await act(() => button?.click());

					await waitFor(() => assertCalled(1, 0));
				});

				it("does not contain a new instance -> scrollToTop is called", async () => {
					const { assertCalled, button } = await setup({
						existing: { loadingState: "loaded", descriptor },
						replacement: { loadingState: "loaded", descriptor: existingInstanceDescriptor }
					});

					await act(() => button?.click());

					await waitFor(() => assertCalled(1, 1));
				});
			});
		});
	});
});
