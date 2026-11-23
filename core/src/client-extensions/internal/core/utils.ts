// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/** @internal */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date)
	);
}

/**
 * Utility type for the opposite of `Readonly<T>`
 * @internal
 */
export type Writeable<T> = {
	-readonly [P in keyof T]: T[P];
};

/**
 * Utility type for the opposite of `DeepReadonly<T>`
 * @internal
 */
export type DeepWriteable<T> = {
	[P in keyof T]: DeepWriteable<T[P]>;
};

/** @internal */
export function isNullable<T>(value: T | null | undefined): value is null | undefined {
	return value === null || value === undefined;
}

/** @internal */
export function notUndefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}

type PartitionedItems<T> = [left: T[], right: T[]];

/** @internal */
export function partitionList<T>(list: T[], predicate: (item: T) => boolean): PartitionedItems<T> {
	return list.reduce(
		(result, item) =>
			predicate(item) ? [result[0].concat(item), result[1]] : [result[0], result[1].concat(item)],
		[[], []] as PartitionedItems<T>
	);
}

/**
 * Removes `undefined | null` from all properties of object type `T`
 *
 * Useful if an object type contains optional properties that are "explicit", e.g.
 * `readonly prop: number | undefined`
 *
 * To assert existence of `prop`, the built-in `Required` type can not be used, because the prop
 * is already required (as: "you always have to specify it", but not as: "does actually exist")
 *
 * @internal
 */
export type RequiredProps<T> = { [P in keyof T]: NonNullable<T[P]> };
