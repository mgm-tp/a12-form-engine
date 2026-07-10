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

import { ok } from "node:assert/strict";

import { cleanup as RTL_Cleanup } from "@testing-library/react";

import type { RtlRenderWrapper } from "../rtl-utils/render-wrapper.js";

export interface Context<T extends RtlRenderWrapper = RtlRenderWrapper> {
	render: RenderHolder<T>;
	it: SimplifiedTestFunction;
}

export interface RenderHolder<T extends RtlRenderWrapper = RtlRenderWrapper> {
	wrapper: T;
}

export type SimplifiedTestFunction = ((desc: string, cb: () => void) => Mocha.Test) &
	Pick<Mocha.TestFunction, "skip" | "only">;

/**
 * Fixture for reusing a single render in multiple tests.
 *
 * Usage:
 *
 * Call in the describe()_ that wraps all _it()_ that should reuse the render.
 * Use the returned _it_ for all tests inside, so that the regular RTL cleanup
 * is disabled. Use the returned _render.wrapper_ to access the render result.
 *
 * Important: Only one call of RenderGroupFixture per describe is allowed.
 *
 * Setup:
 *
 * Disable the default RTL cleanup and call the provided _cleanup_ function in a
 * global _afterEach()_.
 */
export function RenderGroupFixture<T extends RtlRenderWrapper>(
	render: (() => T) | (() => Promise<T>)
): Context<T> {
	const ctx: Context<T> = {
		render: {} as Context<T>["render"],
		it: itWithCleanupInfo
	};

	before(async function () {
		ok(!inside, "nested RenderGroupFixture detected, this not supported");
		inside = true;
		ctx.render.wrapper = await render();
	});

	after(function () {
		RTL_Cleanup();
		delete (ctx as Partial<Context<T>>).render;
		inside = false;
	});

	return ctx;
}
let inside = false;

function itWithCleanupInfo(title: string, func: () => void): Mocha.Test {
	const result = it(title, func);
	(result as DisableCleanup).disableCleanup = true;
	return result;
}

// Defer access to Mocha globals - they're not available at module load time when loaded via require array
itWithCleanupInfo.skip = ((title: string, func?: () => void) =>
	it.skip(title, func)) as Mocha.PendingTestFunction;
itWithCleanupInfo.only = ((title: string, func?: () => void) =>
	it.only(title, func)) as Mocha.ExclusiveTestFunction;

export function cleanup(test: Mocha.Test) {
	if (!isCleanupDisabled(test)) {
		RTL_Cleanup();
	}
}

interface DisableCleanup extends Mocha.Test {
	disableCleanup: true;
}

function isCleanupDisabled(test: Mocha.Test): boolean {
	return (test as DisableCleanup).disableCleanup;
}
