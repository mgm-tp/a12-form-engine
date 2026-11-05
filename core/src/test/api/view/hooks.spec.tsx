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
import type { Middleware, Store } from "redux";

import type { EngineState } from "../../../back-end/store/index.js";
import { Commands, Events } from "../../../back-end/store/index.js";
import {
	useDefaultDispatchProps,
	useDefaultStateProps,
	useScrollHandlerProps
} from "../../../view/index.js";
import { createConfig } from "../../../view/internal/configuration/Defaults.js";
import { defaultStatePropsAreEqual } from "../../../view/internal/configuration/hooks.js";
import { DE_LOCALE } from "../../utils/localization.js";
import { MiddlewareHelpers } from "../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

/**
 * These hooks return props rather than markup, so they are rendered with
 * `renderHook` - there is nothing in the DOM to assert on.
 *
 * The hooks exist to provide the memoization that `connect` used to provide,
 * so most assertions are about identity: a hook result that keeps its identity
 * is one that does not re-render its consumer.
 */
describe("api.view.hooks", () => {
	// any model will do, the hooks do not look into the models
	const models = setupModelsFixture("styles");

	describe("defaultStatePropsAreEqual", () => {
		it("is equal when only the config was re-created", () => {
			const state = createStore().getState();

			strictEqual(
				defaultStatePropsAreEqual(
					{ state, config: createConfig({ cardView: true }) },
					{ state, config: createConfig({ cardView: true }) }
				),
				true
			);
		});

		it("is not equal when the state reference changed", () => {
			const config = createConfig({});

			strictEqual(
				defaultStatePropsAreEqual(
					{ state: createStore().getState(), config },
					{ state: createStore().getState(), config }
				),
				false
			);
		});

		it("is not equal when a config entry changed", () => {
			const state = createStore().getState();

			strictEqual(
				defaultStatePropsAreEqual(
					{ state, config: createConfig({ cardView: true }) },
					{ state, config: createConfig({ cardView: false }) }
				),
				false
			);
		});
	});

	describe("useDefaultStateProps", () => {
		it("maps the store state and the own config to the state props", () => {
			const store = createStore();

			const { result } = renderHook(() => useDefaultStateProps({ config: { cardView: true } }), {
				wrapper: providerFor(store)
			});

			strictEqual(result.current.state, store.getState());
			strictEqual(result.current.config.cardView, true);
		});

		it("keeps the state props when the consumer re-renders", () => {
			const { result, rerender } = renderHook(() => useDefaultStateProps({}), {
				wrapper: providerFor(createStore())
			});

			const stateProps = result.current;

			rerender();

			// the mapping re-creates its result - and the config - on every call,
			// the equality function is what keeps the props identical here
			strictEqual(result.current, stateProps);
		});

		it("provides new state props when the store state changed", () => {
			const store = createStore();
			const { result } = renderHook(() => useDefaultStateProps({}), {
				wrapper: providerFor(store)
			});

			const stateProps = result.current;

			act(() => {
				store.dispatch(Commands.setLocale({ locale: DE_LOCALE }));
			});

			notStrictEqual(result.current, stateProps);
			strictEqual(result.current.state, store.getState());
		});
	});

	describe("useDefaultDispatchProps", () => {
		it("keeps the event handlers when the consumer re-renders", () => {
			const { result, rerender } = renderHook(() => useDefaultDispatchProps(), {
				wrapper: providerFor(createStore())
			});

			const dispatchProps = result.current;

			rerender();

			strictEqual(result.current, dispatchProps);
		});

		it("dispatches the event action of the invoked handler", () => {
			const middlewareSpy = MiddlewareHelpers.createMiddlewareSpy();
			const store = createStore([middlewareSpy.middleware]);

			const { result } = renderHook(() => useDefaultDispatchProps(), {
				wrapper: providerFor(store)
			});

			act(() => {
				result.current.eventHandlers.onNavigationButton("aTarget", "full");
			});

			const dispatched = middlewareSpy.spy.mock.calls
				.map(call => call.arguments[0])
				.find(action => Events.navigationButton.match(action));

			deepStrictEqual(
				dispatched,
				Events.navigationButton({ target: "aTarget", validation: "full" })
			);
		});
	});

	describe("useScrollHandlerProps", () => {
		/*
		 * `createCombinedReducer` builds a new root state object for every action,
		 * but keeps the slice references when a slice did not change - so selecting
		 * the slices is what saves the re-render here.
		 */
		it("reads the ui state and the models from the store", () => {
			const store = createStore();

			const { result } = renderHook(() => useScrollHandlerProps(), {
				wrapper: providerFor(store)
			});

			strictEqual(result.current.uiState, store.getState().ui);
			strictEqual(result.current.models, store.getState().models);
		});

		it("keeps the props when an action leaves the engine state untouched", () => {
			const store = createStore();
			const { result } = renderHook(() => useScrollHandlerProps(), {
				wrapper: providerFor(store)
			});

			const scrollHandlerProps = result.current;

			act(() => {
				store.dispatch({ type: "test/unhandled" });
			});

			strictEqual(result.current, scrollHandlerProps);
		});
	});

	function createStore(middlewares: Middleware[] = []): Store<EngineState> {
		return createTestStore({ storeConfig: { models }, middlewares });
	}

	function providerFor(store: Store) {
		return function StoreProvider({ children }: PropsWithChildren) {
			return <Provider store={store}>{children}</Provider>;
		};
	}
});
