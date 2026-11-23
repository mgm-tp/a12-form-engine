// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Plain variant of `Map`.
 */
export interface ReadonlyObjectMap<T> {
	readonly [id: string]: T | undefined;
}

/**
 * @internal
 * @ignore
 */
export namespace ReadonlyObjectMap {
	/**
	 * @internal
	 */
	export function entries<T>(map: ReadonlyObjectMap<T>): [string, T][] {
		return Object.entries(map).filter(([, v]) => v !== undefined) as [string, T][];
	}

	/**
	 * @internal
	 */
	export function keys<T>(map: ReadonlyObjectMap<T>): string[] {
		return entries(map).map(([k]) => k);
	}

	/**
	 * @internal
	 */
	export function values<T>(map: ReadonlyObjectMap<T>): T[] {
		return entries(map).map(([, v]) => v);
	}

	/**
	 * @internal
	 */
	export function filter<T>(
		map: ReadonlyObjectMap<T>,
		filterCb: (key: string, entry: T) => boolean
	): ReadonlyObjectMap<T> {
		return Object.fromEntries(entries(map).filter(([k, v]) => filterCb(k, v)));
	}

	/**
	 * @internal
	 */
	export function removeByKey<T>(obj: ReadonlyObjectMap<T>, key: string): ReadonlyObjectMap<T> {
		const { [key]: _, ...rest } = obj;

		return rest;
	}
}
