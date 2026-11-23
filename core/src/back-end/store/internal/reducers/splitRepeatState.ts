// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReadonlyObjectMap } from "../../../../models/index.js";

import type { EngineStore } from "../store.js";

/**
 * Helper function to split an object of repeat state entries into two objects,
 * one containing only the repeat ui state entries with the data-related properties and one
 * containing the repeat ui state entries with the data-independent properties.
 *
 * @internal
 */
export function splitRepeatState(repeatState: ReadonlyObjectMap<EngineStore.Repeat.Entry>): {
	repeatStaticState: ReadonlyObjectMap<EngineStore.Repeat.StaticState>;
	repeatInstanceState: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>;
} {
	const repeatStaticState = Object.fromEntries(
		Object.entries(repeatState).map(([key, value]) => {
			if (value) {
				const { expandedRowPath, newRow, page, ...staticProperties } = value;
				const staticEntry: EngineStore.Repeat.StaticState = staticProperties;
				return [key, staticEntry];
			} else {
				return [key, {}];
			}
		})
	);

	const repeatInstanceState = Object.fromEntries(
		Object.entries(repeatState).map(([key, value]) => {
			if (value) {
				const { filterRowOpen, filters, sortingState, ...dataRelatedProperties } = value;
				const instanceEntry: EngineStore.Repeat.InstanceState = dataRelatedProperties;
				return [key, instanceEntry];
			} else {
				return [key, {}];
			}
		})
	);

	return { repeatStaticState, repeatInstanceState };
}
