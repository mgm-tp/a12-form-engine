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

import type { Models } from "../../back-end/store/internal/store.js";

import { SetupHelpers } from "./setup.js";

/**
 * Fixture for a record of plain objects. Must NOT contain any render wrappers!
 *
 * TODO: shouldn't be needed any more (setupFixtureObject should be enough)
 */
export function setupFixture<T>(func: () => T): T {
	const context: T = {} as T;

	before(() => {
		const ctx = func();
		mergeIntoObject(ctx, context);
	});

	after(() => {
		clearObject(context);
	});

	return context;
}

/**
 * Fixture for a single, plain object. Must NOT contain any render wrappers!
 */
export function setupFixtureObject<T extends object>(func: () => T): T {
	let context: T = {} as T;

	before(() => {
		const ctx = func();
		mergeIntoObject(ctx, context);
	});

	after(() => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		context = undefined!;
	});

	return context;
}

/**
 * Fixture for plain arrays. Must NOT contain any render wrappers!
 *
 * TODO: shouldn't be needed any more (setupFixtureObject should be enough)
 */
export function setupArrayFixture<T>(func: () => T[]): T[] {
	let context: T[] = [] as T[];

	before(() => {
		const ctx = func();
		context.push(...ctx);
	});

	after(() => {
		context = [];
	});

	return context;
}

export function setupModelsFixture(
	group: string,
	form?: string,
	jsonAdapter?: SetupHelpers.JsonAdapter
): Models {
	let context: Models = {} as Models;

	before(() => {
		const ctx = SetupHelpers.loadModels(group, form, jsonAdapter);
		mergeIntoObject(ctx, context);
	});

	after(() => {
		clearObject(context);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		context = undefined!;
	});

	return context;
}

function clearObject(obj: any) {
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	Object.keys(obj).forEach(key => delete obj[key]);
}

function mergeIntoObject(source: any, target: any) {
	Object.keys(source).forEach(key => {
		(target as any)[key] = (source as any)[key];
	});
}
