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

import { act } from "react";

import { mockFunctions, type Mocked } from "../rtl-utils/mock-map.js";

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
