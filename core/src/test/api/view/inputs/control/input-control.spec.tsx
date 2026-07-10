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

import { executeTestForAutoExpand } from "./test-cases/auto-expand.js";
import { executeTestForDisabled } from "./test-cases/disabled.js";
import { executeTestFormModelPath } from "./test-cases/formModelPath.js";
import { executeTestsForHelperText } from "./test-cases/helper-text.js";
import { executeTestForHidden } from "./test-cases/hidden.js";
import { executeTestLabel } from "./test-cases/labels/label.js";
import { executeTestForMessageExposition } from "./test-cases/message-exposition.js";
import { executeTestForMessages } from "./test-cases/messages.js";
import { executeTestsForPlaceholder } from "./test-cases/placeholder.js";
import { executeTestForReadonly } from "./test-cases/read-only.js";
import { executeTestsForRendering } from "./test-cases/rendering.js";
import { executeTestRequired } from "./test-cases/required.js";
import { executeTestForSecret } from "./test-cases/secret.js";
import { executeTestForSuffix } from "./test-cases/suffix.js";
import { executeTestForTooltipsOnTop } from "./test-cases/tooltipsOnTop.js";
import { executeTestForTruncateSuffix } from "./test-cases/truncateSuffix.js";
import { executeTestForValue } from "./test-cases/value.js";

describe("api.view.inputs", () => {
	describe("Control", () => {
		describe("read-only", () => {
			executeTestForReadonly();
		});

		describe("messages", () => {
			executeTestForMessages();
		});

		describe("message exposition", () => {
			executeTestForMessageExposition();
		});

		describe("tooltipsOnTop", () => {
			executeTestForTooltipsOnTop();
		});

		describe("auto expand", () => {
			executeTestForAutoExpand();
		});

		describe("value", () => {
			executeTestForValue();
		});

		describe("disabled", () => {
			executeTestForDisabled();
		});

		describe("hidden", () => {
			executeTestForHidden();
		});

		describe("Rendering", () => {
			executeTestsForRendering();
		});

		describe("suffix", () => {
			executeTestForSuffix();
		});

		describe("truncateSuffix", () => {
			executeTestForTruncateSuffix();
		});

		describe("placeholder", () => {
			executeTestsForPlaceholder();
		});

		describe("secret", () => {
			executeTestForSecret();
		});

		describe("label", () => {
			executeTestLabel();
		});

		describe("formModelPath", () => {
			executeTestFormModelPath();
		});

		describe("required", () => {
			executeTestRequired();
		});

		describe("helper text", () => {
			executeTestsForHelperText();
		});
	});
});
