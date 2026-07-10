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
