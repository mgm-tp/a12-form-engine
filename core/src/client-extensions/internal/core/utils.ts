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
