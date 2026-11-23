// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { act } from "react";

import { mockFunctions } from "../rtl-utils/mock-map.js";
import type { Mocked } from "../rtl-utils/mock-map.js";

/**
 * Functions to switch between React component implementations by settings an
 * env variable. Useful for tests that assert the DOM output. By running these
 * tests with the productive components, you can make sure that the tests don't
 * rely on specific behavior of the mocks.
 *
 * For now, you need to run the tests manually with
 * DISABLE_MOCK_COMPONENTS="true" (see launch.json).
 */
export namespace DisableMockComponents {
	function areMocksDisabled(): boolean {
		return "true" === process.env.DISABLE_MOCK_COMPONENTS;
	}

	/**
	 * Maps a mock map to one that can be disabled (=replaced with the productive
	 * map) by env variable.
	 *
	 * Also wraps each function with a node mock (This could be separated).
	 */
	export function components<T>(disabled: () => T) {
		return function (mocks: () => T): Mocked<T> {
			const f = areMocksDisabled() ? disabled : mocks;
			return mockFunctions(f());
		};
	}

	export interface WithWidgetsOptions {
		readonly withWidgets?: true;
	}

	export interface RenderFunc<ArgsType, ReturnType> {
		(options: ArgsType): ReturnType;
	}
	export interface AsyncRenderFunc<ArgsType, ReturnType> {
		(options: ArgsType): Promise<ReturnType>;
	}

	/**
	 * Map a render function to one where some wrappers are activated that
	 * required by productive widgets by setting an environment variable.
	 * Unfortunately, the resulting render needs to be async, because widgets
	 * have some effects that require act.
	 */
	export function render<OptsType extends WithWidgetsOptions, RenderResultType>(
		f: RenderFunc<OptsType, RenderResultType>
	): AsyncRenderFunc<OptsType, RenderResultType> {
		return options => {
			const opts = areMocksDisabled() ? optionsWithDisabledMockComponents(options) : options;
			return act(() => f(opts));
		};
	}

	function optionsWithDisabledMockComponents<OptsType extends WithWidgetsOptions>(
		o: OptsType
	): OptsType {
		return {
			...o,
			withWidgets: true
		};
	}
}
