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

import { deepStrictEqual } from "node:assert/strict";

import { filterCustomMessagesByPath } from "../../back-end/store/internal/selectors/ui-state.js";
import { EngineStore } from "../../back-end/store/internal/store.js";

import { createDocumentPath } from "../utils/createDocumentPath.js";
import { createModelPath } from "../utils/createModelPath.js";
import { createCustomValidationMessage } from "../utils/validation.js";

describe("unit.back-end.store.filterCustomMessagesByPath", () => {
	const customFormElement = createModelPath("Screen", "custom1");
	const dataContext = createDocumentPath(["root"]);

	function makeCustomMessage(): EngineStore.Validation.CustomMessage {
		return createCustomValidationMessage({ customFormElement, dataContext });
	}

	it("returns custom messages matching (formModelPath, dataContext)", () => {
		const message = makeCustomMessage();
		const customMessages: EngineStore.Validation.CustomEntry = {
			formModelPath: customFormElement,
			dataContext,
			validationMessages: [message]
		};

		deepStrictEqual(
			filterCustomMessagesByPath(
				{ [EngineStore.Validation.customKey(customFormElement, dataContext)]: customMessages },
				customFormElement,
				dataContext
			),
			[message]
		);
	});

	it("requires ModelPath equality (different formModelPath returns empty)", () => {
		const customMessages: EngineStore.Validation.CustomEntry = {
			formModelPath: customFormElement,
			dataContext,
			validationMessages: [makeCustomMessage()]
		};

		const otherFormElement = createModelPath("Screen", "custom2");
		deepStrictEqual(
			filterCustomMessagesByPath(
				{ [EngineStore.Validation.customKey(customFormElement, dataContext)]: customMessages },
				otherFormElement,
				dataContext
			),
			[]
		);
	});

	it("uses DocumentPath.matches:error for specific index -> index 0 acts as a wildcard for the row", () => {
		const stored = createDocumentPath(["root"], ["repeat", 2]);
		const wildcard = createDocumentPath(["root"], ["repeat", 0]);
		const message = createCustomValidationMessage({
			customFormElement,
			dataContext: stored
		});
		const customMessages: EngineStore.Validation.CustomEntry = {
			formModelPath: customFormElement,
			dataContext: stored,
			validationMessages: [message]
		};

		deepStrictEqual(
			filterCustomMessagesByPath(
				{ [EngineStore.Validation.customKey(customFormElement, stored)]: customMessages },
				customFormElement,
				wildcard
			),
			[message]
		);
	});

	it("uses DocumentPath.matches: error for index 0 -> any specific index will match", () => {
		const storedWildcard = createDocumentPath(["root"], ["repeat", 0]);
		const specific = createDocumentPath(["root"], ["repeat", 2]);
		const message = createCustomValidationMessage({
			customFormElement,
			dataContext: storedWildcard
		});
		const customMessages: EngineStore.Validation.CustomEntry = {
			formModelPath: customFormElement,
			dataContext: storedWildcard,
			validationMessages: [message]
		};

		deepStrictEqual(
			filterCustomMessagesByPath(
				{ [EngineStore.Validation.customKey(customFormElement, storedWildcard)]: customMessages },
				customFormElement,
				specific
			),
			[message]
		);
	});

	it("returns empty when dataContext is different", () => {
		const customMessages: EngineStore.Validation.CustomEntry = {
			formModelPath: customFormElement,
			dataContext,
			validationMessages: [makeCustomMessage()]
		};

		const otherDataContext = createDocumentPath(["root"], ["repeat", 1]);
		deepStrictEqual(
			filterCustomMessagesByPath(
				{ [EngineStore.Validation.customKey(customFormElement, dataContext)]: customMessages },
				customFormElement,
				otherDataContext
			),
			[]
		);
	});
});
