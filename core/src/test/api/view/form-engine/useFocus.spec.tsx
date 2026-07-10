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

import { ActivityActions, NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core";
import { render } from "@com.mgmtp.a12.devtools/react";
import { Settings } from "@com.mgmtp.a12.utils/utils-logging";

import { useFocus } from "../../../../client-extensions/internal/extensions/form-engine/internal/useFocus.js";
import { createActivity, createStore } from "../../../utils/client-helpers.js";

interface Options {
	readonly existing: Omit<NonNullable<Parameters<typeof createActivity>[0]>, "id">;
	readonly replacement?: Omit<NonNullable<Parameters<typeof createActivity>[0]>, "id">;
}

describe("api.client-extensions.useFocus", () => {
	const strategy = Settings.LogStrategy;

	before(() => {
		Settings.resetLogStrategy();
	});

	after(() => {
		Settings.LogStrategy = strategy;
	});

	async function setup({ existing, replacement }: Options) {
		const EXISTING_ID = "1";
		const REPLACEMENT_ID = "2";

		const { store } = createStore({
			activities: [
				createActivity({ id: EXISTING_ID, ...existing }),
				createActivity({ id: REPLACEMENT_ID, ...replacement })
			],
			dataHandlers: [{ name: "FallbackProvider", canHandle: () => true, *provideData() {} }]
		});

		const scrollToTop = mock.fn();
		const focusElement = mock.fn();

		function Wrapper() {
			const [activityId, setId] = useState(EXISTING_ID);

			useFocus({
				activityId,
				scrollRef: { current: { focusElement, scrollToTop } }
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

		function assertCalled(count: number) {
			strictEqual(focusElement.mock.callCount(), count);
			strictEqual(scrollToTop.mock.callCount(), count);
		}

		return { button: result.queryById("replaceActivity"), assertCalled, store };
	}

	const descriptor = { instance: NEW_INSTANCE_IDENTIFIER };

	describe("given an id for an activity which is", () => {
		it("not loaded and contains a new instance -> ScrollApi is not called", async () => {
			const { assertCalled } = await setup({
				existing: { loadingState: "loading", descriptor }
			});

			await waitFor(() => assertCalled(0));
		});

		it("loaded and contains an existing instance -> ScrollApi is not called", async () => {
			const { assertCalled } = await setup({
				existing: { loadingState: "loaded", descriptor: { instance: "doc/1" } }
			});

			await waitFor(() => assertCalled(0));
		});

		describe("loaded and contains a new instance", () => {
			it("ScrollApi is called once", async () => {
				const { assertCalled } = await setup({
					existing: { loadingState: "loaded", descriptor }
				});

				await waitFor(() => assertCalled(1));
			});

			it("and then the loading state changes to something else -> ScrollApi is not called again", async () => {
				const { assertCalled, store } = await setup({
					existing: { loadingState: "loaded", descriptor }
				});

				await act(() => store.dispatch(ActivityActions.loadData({ activityId: "1" })));

				await waitFor(() => assertCalled(1));
			});

			it("and then the loading state changes twice (back to loaded) -> ScrollApi is not called again", async () => {
				const { assertCalled, store } = await setup({
					existing: { loadingState: "loaded", descriptor }
				});

				await act(() => store.dispatch(ActivityActions.loadData({ activityId: "1" })));
				await act(() => store.dispatch(ActivityActions.setData({ activityId: "1", data: {} })));

				await waitFor(() => assertCalled(1));
			});

			describe("and then the activity is replaced by another one which", () => {
				it("is still loaded and contains a new instance -> ScrollApi is called again", async () => {
					const { assertCalled, button } = await setup({
						existing: { loadingState: "loaded", descriptor },
						replacement: { loadingState: "loaded", descriptor }
					});

					await act(() => button?.click());

					await waitFor(() => assertCalled(2));
				});

				it("is not loaded -> ScrollApi is not called again", async () => {
					const { assertCalled, button } = await setup({
						existing: { loadingState: "loaded", descriptor },
						replacement: { loadingState: "error", descriptor }
					});

					await act(() => button?.click());

					await waitFor(() => assertCalled(1));
				});

				it("does not contain a new instance -> ScrollApi is not called again", async () => {
					const { assertCalled, button } = await setup({
						existing: { loadingState: "loaded", descriptor },
						replacement: { loadingState: "loaded", descriptor: { instance: "doc/1" } }
					});

					await act(() => button?.click());

					await waitFor(() => assertCalled(1));
				});
			});
		});
	});
});
