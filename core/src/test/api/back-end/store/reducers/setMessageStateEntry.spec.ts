// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { createValidationMessage } from "../../../../utils/validation.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setMessageStateEntry", () => {
		it("sets the a message entry with the given path and entry value from the payload", () => {
			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				key1: {
					validationMessages: [
						createValidationMessage({
							path: DocumentHelpers.createDocumentPath(["Path"])
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
						path: DocumentHelpers.createDocumentPath(["Path 2"])
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
