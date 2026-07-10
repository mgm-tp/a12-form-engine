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

import { act } from "react";
import { Provider } from "react-redux";

import type { Activity } from "@com.mgmtp.a12.client/client-core";
import { ActivityActions } from "@com.mgmtp.a12.client/client-core";

import { FormEngineViewTpl } from "../../../client-extensions/internal/extensions/form-engine/internal/view.js";
import { defaultMapDispatchToProps } from "../../../view/index.js";
import { getWidgetMocks } from "../../rtl-utils/getWidgetMocks.js";
import type { RtlRenderWrapper } from "../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapper } from "../../rtl-utils/render-wrapper.js";
import { createActivity, createStore, TEST_ACTIVITY_ID } from "../../utils/client-helpers.js";
import { setupRenderConfiguration } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

type LoadingState = Activity.LoadingState;

describe("api.client-extensions.FormEngineView", () => {
	// any model with a screen will do, the form root is what we assert on
	const models = setupModelsFixture("styles");

	beforeEach(() => {
		// jsdom does not implement scrolling; stub it so the scroll-to-top effect is a no-op
		mock.method(Element.prototype, "scrollIntoView");
	});

	describe("given complete props (config and state)", () => {
		describe("renders the form engine when the activity loading state is", () => {
			it("'loaded'", () => {
				assertFormEngineRendered("loaded");
			});
			it("'error'", () => {
				assertFormEngineRendered("error");
			});
			it("'without'", () => {
				assertFormEngineRendered("without");
			});
		});

		describe("only renders the placeholder (form engine stays hidden) when the activity loading state is", () => {
			it("'loading'", () => {
				assertOnlyPlaceholderRendered("loading");
			});
			it("'missing'", () => {
				assertOnlyPlaceholderRendered("missing");
			});
		});
	});

	describe("given incomplete props", () => {
		it("renders the placeholder even when the activity is already loaded", () => {
			const { store } = createStore({
				activities: [createActivity({ loadingState: "loaded" })]
			});

			const wrapper = rtlRenderWrapper(
				<Provider store={store}>
					<FormEngineViewTpl activityId={TEST_ACTIVITY_ID} eventHandlers={eventHandlers()} />
				</Provider>
			);

			strictEqual(isFormEngineRendered(wrapper), false);
		});
	});

	describe("when the loading state changes", () => {
		it("renders the form engine as soon as the loading state becomes 'loaded'", async () => {
			const { wrapper, store } = renderWithLoadingState("loading");
			strictEqual(isFormEngineRendered(wrapper), false);

			act(() => {
				store.dispatch(ActivityActions.setData({ activityId: TEST_ACTIVITY_ID, data: {} }));
			});

			strictEqual(isFormEngineRendered(wrapper), true);
		});

		it("keeps the form engine rendered once it loaded, even if the loading state changes again", async () => {
			const { wrapper, store } = renderWithLoadingState("loaded");
			strictEqual(isFormEngineRendered(wrapper), true);

			act(() => {
				store.dispatch(ActivityActions.loadData({ activityId: TEST_ACTIVITY_ID }));
			});

			strictEqual(isFormEngineRendered(wrapper), true);
		});
	});

	function assertFormEngineRendered(loadingState: LoadingState): void {
		const { wrapper } = renderWithLoadingState(loadingState);
		strictEqual(isFormEngineRendered(wrapper), true);
	}

	function assertOnlyPlaceholderRendered(loadingState: LoadingState): void {
		const { wrapper } = renderWithLoadingState(loadingState);
		strictEqual(isFormEngineRendered(wrapper), false);
	}

	function renderWithLoadingState(loadingState: LoadingState): {
		readonly wrapper: RtlRenderWrapper;
		readonly store: ReturnType<typeof createStore>["store"];
	} {
		const { store } = createStore({ activities: [createActivity({ loadingState })] });
		const { renderOptions } = setupRenderConfiguration({
			models,
			config: { widgetMap: getWidgetMocks() }
		});

		const wrapper = rtlRenderWrapper(
			<Provider store={store}>
				<FormEngineViewTpl
					activityId={TEST_ACTIVITY_ID}
					config={renderOptions.config}
					state={renderOptions.state}
					eventHandlers={renderOptions.eventHandlers}
				/>
			</Provider>
		);

		return { wrapper, store };
	}

	// The form engine renders its form root with this data-role, the placeholder does not.
	function isFormEngineRendered(wrapper: RtlRenderWrapper): boolean {
		return wrapper.baseElement.querySelector("[data-role='form']") !== null;
	}

	function eventHandlers() {
		return defaultMapDispatchToProps(mock.fn()).eventHandlers;
	}
});
