// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
