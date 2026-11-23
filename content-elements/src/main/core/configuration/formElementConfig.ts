// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { MarkingOfRequiredFields } from "../types/controlProps.js";

export type ClockMode = "12h" | "24h";

export interface StaticAmountSuffix {
	readonly type: "static";
	readonly value: string;
}

export interface DynamicAmountSuffix {
	readonly type: "dynamic";
	readonly fieldRef: string;
}

export type AmountSuffix = StaticAmountSuffix | DynamicAmountSuffix;

/**
 * TODO: What else do we need here? (externalEnumProvider? ...)
 *
 * Should the widgetMap be added here instead of having its own context?
 *
 *      BJ: As long as the values don't change (often) at runtime, you can
 *          group them into one context.
 *
 * Where should these settings come from? Code API? Some container element in
 * the content model? ...
 * => as a first step they will only be available in the code
 */
export interface FormElementConfig {
	// part of the FE config in the past
	readonly uiIdPrefix?: string;
	readonly disableDatePicker?: true;
	readonly timeMode: ClockMode;
	/**
	 * TODO: Do we need earlyDetectDirty? The SFE would not use this state
	 * internally, it might only be relevant for other components (e.g.
	 * UIF to enable/disable buttons).
	 * Maybe it should be handled by other components and the SFE just needs
	 * an extension point.
	 * (Currently not needed, so we can delay our decision here)
	 */
	// readonly earlyDetectDirty?: true;

	// global FM settings in the past
	readonly markingOfRequiredFields?: MarkingOfRequiredFields;
	readonly amountSuffix?: AmountSuffix;
}
