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

import type { FormModel } from "../../../models/index.js";

/** @internal Form Engine never produces `true`, only widgets-core's own prop type allows it. */
export type TooltipLineBreak = false | "above" | "below";

/**
 * @internal
 * Translates the form model's tooltip position into the widgets' `breakTooltipsToNewLine` vocabulary.
 */
export function toTooltipLineBreak(
	tooltipPosition: FormModel.TooltipPosition | undefined
): TooltipLineBreak | undefined {
	switch (tooltipPosition) {
		case "ABOVE":
			return "above";
		case "BELOW":
			return "below";
		case "BESIDE":
			return false;
		default:
			return undefined;
	}
}

/** @internal */
export type WidgetsTooltipPosition = "beside" | "above" | "below";

/**
 * @internal
 * Translates the form model's tooltip position into widgets' own `tooltipPosition` vocabulary
 * (used by widgets that expose that prop directly, e.g. Text Output, instead of `breakTooltipsToNewLine`).
 */
export function toWidgetsTooltipPosition(
	tooltipPosition: FormModel.TooltipPosition | undefined
): WidgetsTooltipPosition | undefined {
	switch (tooltipPosition) {
		case "ABOVE":
			return "above";
		case "BELOW":
			return "below";
		case "BESIDE":
			return "beside";
		default:
			return undefined;
	}
}

/** @internal */
export type WidgetsMessagePosition = "above" | "below";

/**
 * @internal
 * Translates the form model's validation message position into widgets' own `messagePosition`
 * vocabulary (consumed via `FieldDefaultConfigProvider`).
 */
export function toWidgetsMessagePosition(
	messagePosition: FormModel.MessagePosition | undefined
): WidgetsMessagePosition | undefined {
	switch (messagePosition) {
		case "ABOVE":
			return "above";
		case "BELOW":
			return "below";
		default:
			return undefined;
	}
}
