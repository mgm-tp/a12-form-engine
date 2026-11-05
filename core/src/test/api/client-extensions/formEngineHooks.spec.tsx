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
import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";

import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { act } from "react";
import { Provider } from "react-redux";
import type { Action, Store } from "redux";

import { Events } from "../../../back-end/store/index.js";
import { FormEngineActions } from "../../../client-extensions/internal/extensions/form-engine/internal/actions.js";
import { FormEngineHooks } from "../../../client-extensions/internal/extensions/form-engine/internal/hooks.js";
import { createActivity, createStore, TEST_ACTIVITY_ID } from "../../utils/client-helpers.js";

/**
 * These hooks return props rather than markup, so they are rendered with
 * `renderHook` - there is nothing in the DOM to assert on.
 *
 * The hooks exist to provide the memoization that `connect` used to provide,
 * so most assertions are about identity: a hook result that keeps its identity
 * is one that does not re-render its consumer.
 */
describe("api.client-extensions.FormEngineHooks", () => {
	describe("useStateProps", () => {
		it("maps to empty props while the activity holds no engine state", () => {
			const { store } = createStore({ activities: [createActivity()] });

			const { result } = renderHook(
				() => FormEngineHooks.useStateProps({ activityId: TEST_ACTIVITY_ID }),
				{ wrapper: providerFor(store) }
			);

			deepStrictEqual(result.current, {});
		});

		/*
		 * Only covers the case without an engine state, where the mapping returns
		 * an empty object every time. As soon as the activity holds an engine
		 * state the mapping re-creates it, and the equality function cannot help
		 * - `areStatePropsEqual` on the EngineComposition memo is what absorbs
		 * that, see areStatePropsEqual.spec.ts.
		 */
		it("keeps the empty state props when the consumer re-renders", () => {
			const { store } = createStore({ activities: [createActivity()] });

			const { result, rerender } = renderHook(
				() => FormEngineHooks.useStateProps({ activityId: TEST_ACTIVITY_ID }),
				{ wrapper: providerFor(store) }
			);

			const stateProps = result.current;

			rerender();

			strictEqual(result.current, stateProps);
		});
	});

	describe("useDispatchProps", () => {
		it("keeps the event handlers when the consumer re-renders", () => {
			const { result, rerender } = renderHook(
				() => FormEngineHooks.useDispatchProps({ activityId: TEST_ACTIVITY_ID }),
				{ wrapper: providerFor(createDispatchRecordingStore().store) }
			);

			const dispatchProps = result.current;

			rerender();

			strictEqual(result.current, dispatchProps);
		});

		it("creates new event handlers when the activity id changes", () => {
			const { store } = createDispatchRecordingStore();

			const { result, rerender } = renderHook(
				({ activityId }: { activityId: string }) =>
					FormEngineHooks.useDispatchProps({ activityId }),
				{ wrapper: providerFor(store), initialProps: { activityId: TEST_ACTIVITY_ID } }
			);

			const dispatchProps = result.current;

			rerender({ activityId: "another-activity" });

			notStrictEqual(result.current, dispatchProps);
		});

		it("wraps the engine event of the invoked handler with the activity id", () => {
			const { store, dispatched } = createDispatchRecordingStore();

			const { result } = renderHook(
				() => FormEngineHooks.useDispatchProps({ activityId: TEST_ACTIVITY_ID }),
				{ wrapper: providerFor(store) }
			);

			act(() => {
				result.current.eventHandlers.onNavigationButton("aTarget", "full");
			});

			deepStrictEqual(dispatched, [
				FormEngineActions.event({
					engineEvent: Events.navigationButton({ target: "aTarget", validation: "full" }),
					activityId: TEST_ACTIVITY_ID
				})
			]);
		});
	});

	/**
	 * The dispatch props are only built from the dispatch function, so a store
	 * that records what it is given is enough - and it keeps the assertion free
	 * of the actions a real Client store dispatches on its own.
	 */
	function createDispatchRecordingStore(): {
		readonly store: Store;
		readonly dispatched: Action[];
	} {
		const dispatched: Action[] = [];
		const store = {
			getState: () => ({}),
			subscribe: () => () => undefined,
			dispatch: (action: Action) => {
				dispatched.push(action);
				return action;
			}
		} as unknown as Store;

		return { store, dispatched };
	}

	function providerFor(store: Store) {
		return function StoreProvider({ children }: PropsWithChildren) {
			return <Provider store={store}>{children}</Provider>;
		};
	}
});
