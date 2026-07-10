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

import { executeTestsForAttachmentValueChange } from "./attachmentValueChange.js";
import { executeTestsForChainedDependenciesAndComputations } from "./chainedDependenciesAndComputations.js";
import { executeTestsForComputation } from "./computation.js";
import { executeTestsForDependentElement } from "./dependentElements.js";
import { executeTestsForDependentEnumeration } from "./dependentEnumeration.js";
import { executeTestsForMultiSelectValueChange } from "./multiSelectValueChange.js";
import { executeTestsForValidation } from "./validation.js";
import { executeTestsForDocumentAndMessageChanges } from "./valueAndMessageChanges.js";

describe("api.back-end.store.middleware", () => {
	describe("onValueChangeMiddleware", () => {
		describe("handles Events.valueChange", () => {
			describe("Dependent Elements", () => {
				executeTestsForDependentElement();
			});

			describe("Dependent Enumerations", () => {
				executeTestsForDependentEnumeration();
			});

			describe("Computation", () => {
				executeTestsForComputation();
			});

			describe("Validation", () => {
				executeTestsForValidation();
			});

			describe("Chained Dependencies and Computations", () => {
				executeTestsForChainedDependenciesAndComputations();
			});

			describe("General", () => {
				executeTestsForDocumentAndMessageChanges();
			});
		});

		describe("handles Events.attachmentValueChange", () => {
			executeTestsForAttachmentValueChange();
		});

		describe("handles Events.multiSelectValueChange", () => {
			executeTestsForMultiSelectValueChange();
		});
	});
});
