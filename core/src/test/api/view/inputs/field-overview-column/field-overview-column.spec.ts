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

import { executeTestForFieldOverviewColumnAutoExpand } from "./test-cases/auto-expand.js";
import { executeTestForFieldOverviewColumnDisabled } from "./test-cases/disabled.js";
import { executeTestForFieldOverviewColumnHidden } from "./test-cases/hidden.js";
import { executeTestForFieldOverviewColumnSwitchIcon } from "./test-cases/switchIcon.js";
import { executeTestForFieldOverviewColumnLabel } from "./test-cases/label.js";
import { executeTestForFieldOverviewColumnMessages } from "./test-cases/messages.js";
import { executeTestsForFieldOverviewColumnPlaceholder } from "./test-cases/placeholder.js";
import { executeTestForFieldOverviewColumnReadOnly } from "./test-cases/read-only.js";
import { executeTestsForFieldOverviewColumnRendering } from "./test-cases/rendering.js";
import { executeTestForFieldOverviewColumnSuffix } from "./test-cases/suffix.js";
import { executeTestForFieldOverviewColumnValue } from "./test-cases/value.js";

describe("api.view.inputs", () => {
	describe("FieldOverviewColumn", () => {
		describe("value", () => {
			executeTestForFieldOverviewColumnValue();
		});

		describe("read-only", () => {
			executeTestForFieldOverviewColumnReadOnly();
		});

		describe("label", () => {
			executeTestForFieldOverviewColumnLabel();
		});

		describe("auto expand", () => {
			executeTestForFieldOverviewColumnAutoExpand();
		});

		describe("disabled", () => {
			executeTestForFieldOverviewColumnDisabled();
		});

		describe("validation messages", () => {
			executeTestForFieldOverviewColumnMessages();
		});

		describe("hidden", () => {
			executeTestForFieldOverviewColumnHidden();
		});

		describe("suffix", () => {
			executeTestForFieldOverviewColumnSuffix();
		});

		describe("Rendering", () => {
			executeTestsForFieldOverviewColumnRendering();
		});

		describe("placeholder", () => {
			executeTestsForFieldOverviewColumnPlaceholder();
		});

		describe("icon", () => {
			executeTestForFieldOverviewColumnSwitchIcon();
		});
	});
});
