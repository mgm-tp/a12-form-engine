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
