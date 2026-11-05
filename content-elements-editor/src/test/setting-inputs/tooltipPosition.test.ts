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

import { strictEqual } from "node:assert/strict";

import {
	displayedTooltipPosition,
	tooltipsOnTopFor
} from "../../setting-inputs/tooltipPosition.js";

describe("displayedTooltipPosition", () => {
	it("shows the default BESIDE if neither tooltipPosition nor tooltipsOnTop is set", () => {
		strictEqual(displayedTooltipPosition("BESIDE", false), "BESIDE");
	});

	it("falls back to ABOVE if only the deprecated tooltipsOnTop is set", () => {
		strictEqual(displayedTooltipPosition("BESIDE", true), "ABOVE");
	});

	it("shows an explicit tooltipPosition regardless of tooltipsOnTop", () => {
		strictEqual(displayedTooltipPosition("BELOW", true), "BELOW");
		strictEqual(displayedTooltipPosition("BELOW", false), "BELOW");
	});
});

describe("tooltipsOnTopFor", () => {
	it("sets the deprecated tooltipsOnTop for ABOVE", () => {
		strictEqual(tooltipsOnTopFor("ABOVE"), true);
	});

	it("clears the deprecated tooltipsOnTop for BESIDE and BELOW", () => {
		strictEqual(tooltipsOnTopFor("BESIDE"), false);
		strictEqual(tooltipsOnTopFor("BELOW"), false);
	});
});
