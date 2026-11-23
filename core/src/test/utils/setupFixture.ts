// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
		// oxlint-disable-next-line typescript/no-non-null-assertion
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
		// oxlint-disable-next-line typescript/no-non-null-assertion
		context = undefined!;
	});

	return context;
}

function clearObject(obj: any) {
	// oxlint-disable-next-line typescript/no-dynamic-delete
	Object.keys(obj).forEach(key => delete obj[key]);
}

function mergeIntoObject(source: any, target: any) {
	Object.keys(source).forEach(key => {
		(target as any)[key] = (source as any)[key];
	});
}
