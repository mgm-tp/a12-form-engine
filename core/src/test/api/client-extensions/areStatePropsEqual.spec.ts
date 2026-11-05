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
import { notStrictEqual, strictEqual } from "node:assert/strict";

import type { EngineState, EngineStore } from "../../../back-end/store/index.js";
import { createEngineStore, createUIState } from "../../../back-end/store/index.js";
import { areStatePropsEqual } from "../../../client-extensions/internal/extensions/form-engine/internal/view.js";
import type { Config } from "../../../view/index.js";
import { createConfig } from "../../../view/internal/configuration/Defaults.js";
import { US_LOCALE } from "../../utils/localization.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

/**
 * `areStatePropsEqual` is the memo comparison of the `EngineComposition`, and
 * therefore the single guard that keeps the Form Engine from re-rendering on
 * every dispatched action.
 *
 * It has to be: `FormEngineStateAdapter.mapStateToProps` builds its result with
 * `createEngineStore`, which allocates a new `EngineState` - and a new `data`
 * and `ui` inside it - on every call. The state props handed to the Form Engine
 * are therefore never referentially equal, and this function is what looks past
 * the re-created wrappers at the slices that are stable.
 */
describe("api.client-extensions.areStatePropsEqual", () => {
	const models = setupModelsFixture("styles");

	describe("given state props built from the same store slices", () => {
		it("is equal although the engine state was re-created", () => {
			const document = {};
			const uiSlice = createUiSlice();

			const previous = createStateProps({ document, uiSlice });
			const current = createStateProps({ document, uiSlice });

			// premise: this is what the mapping does on every call
			notStrictEqual(previous.state, current.state);
			notStrictEqual(previous.state.data, current.state.data);
			notStrictEqual(previous.state.ui, current.state.ui);
			notStrictEqual(previous.config, current.config);

			strictEqual(areStatePropsEqual(previous, current), true);
		});
	});

	describe("given changed state props", () => {
		it("is not equal when the document changed", () => {
			const uiSlice = createUiSlice();

			strictEqual(
				areStatePropsEqual(
					createStateProps({ document: {}, uiSlice }),
					createStateProps({ document: {}, uiSlice })
				),
				false
			);
		});

		/*
		 * `resolveUiState` hands out the stored ui slice by reference, so a
		 * different slice means the ui really changed.
		 */
		it("is not equal when the ui slice changed", () => {
			const document = {};

			strictEqual(
				areStatePropsEqual(
					createStateProps({ document, uiSlice: createUiSlice() }),
					createStateProps({ document, uiSlice: createUiSlice() })
				),
				false
			);
		});

		it("is not equal when a config entry changed", () => {
			const document = {};
			const uiSlice = createUiSlice();

			strictEqual(
				areStatePropsEqual(
					createStateProps({ document, uiSlice, config: createConfig({ cardView: true }) }),
					createStateProps({ document, uiSlice, config: createConfig({ cardView: false }) })
				),
				false
			);
		});

		it("is not equal when only one side has a state", () => {
			const stateProps = createStateProps({ document: {}, uiSlice: createUiSlice() });

			strictEqual(areStatePropsEqual(stateProps, { config: stateProps.config }), false);
		});

		it("is equal when neither side has a state", () => {
			strictEqual(areStatePropsEqual({}, {}), true);
		});
	});

	function createStateProps(options: {
		readonly document: object;
		readonly uiSlice: EngineStore.UIState;
		readonly config?: Config;
	}): { readonly state: EngineState; readonly config: Config } {
		return {
			state: createEngineStore({
				ui: options.uiSlice,
				models,
				data: { dirty: false, document: options.document },
				locale: US_LOCALE
			}),
			config: options.config ?? createConfig({})
		};
	}

	/** A complete ui slice, as it is stored in the data holder once the Form Engine ran. */
	function createUiSlice(): EngineStore.UIState {
		return createUIState({
			screenLocation: [
				{ locationPath: [{ elementName: models.formModel.content.screens[0].name }], path: [] }
			]
		});
	}
});
