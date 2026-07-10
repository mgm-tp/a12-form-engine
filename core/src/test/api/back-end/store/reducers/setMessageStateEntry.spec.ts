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

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createTestStore } from "../../../../utils/setup.js";
import { createValidationMessage } from "../../../../utils/validation.js";

describe("api.back-end.store.reducers", () => {
	describe("setMessageStateEntry", () => {
		it("sets the a message entry with the given path and entry value from the payload", () => {
			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				key1: {
					validationMessages: [
						createValidationMessage({
							path: createDocumentPath(["Path"])
						})
					]
				}
			};

			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { messages, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });

			const newMessageEntry = {
				validationMessages: [
					createValidationMessage({
						path: createDocumentPath(["Path 2"])
					})
				]
			};
			store.dispatch(
				Commands.setMessageStateEntry({
					messageStateEntry: newMessageEntry,
					path: "key2"
				})
			);

			const actualMessages = UiStateSelectors.messages()(store.getState());
			const expectedMessages = {
				...messages,
				key2: newMessageEntry
			};

			deepStrictEqual(actualMessages, expectedMessages);
		});
	});
});
