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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { Commands, EngineStore } from "../../../back-end/store/index.js";
import { InternalUiStateSelectors } from "../../../back-end/store/internal/selectors/ui-state.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";
import { createDocumentPath } from "../../utils/createDocumentPath.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { createTestStore } from "../../utils/setup.js";
import { createValidationEntry } from "../../utils/validation.js";

describe("unit.back-end.store.customMessageState", () => {
	const formModelPath = createModelPath("CustomElement");
	const dataContext = createDocumentPath(["Group", 1]);
	const key = EngineStore.Validation.customKey(formModelPath, dataContext);

	const customMessage: EngineStore.Validation.CustomMessage = {
		customFormElement: formModelPath,
		dataContext,
		errorCode: "MessageCode",
		errorKey: "MessageKey",
		errorText: [],
		severity: "ERROR"
	};

	function createStore(
		customMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry>,
		messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {}
	) {
		return createTestStore({
			storeConfig: {
				data: { dirty: false, document: {} },
				ui: { customMessages, messages, screenLocation: [] }
			}
		});
	}

	it("setCustomMessageEntry stores the entry under customKey", () => {
		const store = createStore({});
		const entry: EngineStore.Validation.CustomEntry = {
			formModelPath,
			dataContext,
			validationMessages: [customMessage]
		};

		store.dispatch(Commands.setCustomMessageEntry({ entry }));

		deepStrictEqual(store.getState().ui.customMessages, { [key]: entry });
	});

	it("setCustomMessageEntry replaces an entry that is already stored", () => {
		const existingEntry: EngineStore.Validation.CustomEntry = {
			formModelPath,
			dataContext,
			validationMessages: [customMessage]
		};
		const store = createStore({ [key]: existingEntry });

		const replacingEntry: EngineStore.Validation.CustomEntry = {
			formModelPath,
			dataContext,
			validationMessages: [{ ...customMessage, errorCode: "OtherCode" }]
		};
		store.dispatch(Commands.setCustomMessageEntry({ entry: replacingEntry }));

		deepStrictEqual(store.getState().ui.customMessages, { [key]: replacingEntry });
	});

	it("setCustomMessageEntry with an empty entry removes the slot", () => {
		const existingEntry: EngineStore.Validation.CustomEntry = {
			formModelPath,
			dataContext,
			validationMessages: [customMessage]
		};
		const otherKey = EngineStore.Validation.customKey(createModelPath("OtherElement"), dataContext);
		const otherEntry: EngineStore.Validation.CustomEntry = {
			formModelPath: createModelPath("OtherElement"),
			dataContext,
			validationMessages: [customMessage]
		};
		const store = createStore({ [key]: existingEntry, [otherKey]: otherEntry });

		store.dispatch(
			Commands.setCustomMessageEntry({
				entry: { formModelPath, dataContext, validationMessages: [] }
			})
		);

		deepStrictEqual(store.getState().ui.customMessages, { [otherKey]: otherEntry });
	});

	it("setCustomMessageState replaces the whole map", () => {
		const existingEntry: EngineStore.Validation.CustomEntry = {
			formModelPath,
			dataContext,
			validationMessages: [customMessage]
		};
		const store = createStore({ [key]: existingEntry });

		const otherKey = EngineStore.Validation.customKey(createModelPath("OtherElement"), dataContext);
		const newCustomMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
			[otherKey]: {
				formModelPath: createModelPath("OtherElement"),
				dataContext,
				validationMessages: [customMessage]
			}
		};

		store.dispatch(Commands.setCustomMessageState({ customMessages: newCustomMessages }));

		deepStrictEqual(store.getState().ui.customMessages, newCustomMessages);
	});

	it("setCustomMessageState re-keys entries stored under a foreign key", () => {
		const store = createStore({});
		const entry: EngineStore.Validation.CustomEntry = {
			formModelPath,
			dataContext,
			validationMessages: [customMessage]
		};

		store.dispatch(Commands.setCustomMessageState({ customMessages: { whatever: entry } }));

		// stored under the derived key, so a later setCustomMessageEntry replaces it
		deepStrictEqual(store.getState().ui.customMessages, { [key]: entry });

		store.dispatch(Commands.setCustomMessageEntry({ entry }));

		strictEqual(Object.keys(store.getState().ui.customMessages ?? {}).length, 1);
	});

	it("setCustomMessageState drops entries that carry no messages", () => {
		const store = createStore({});

		store.dispatch(
			Commands.setCustomMessageState({
				customMessages: { [key]: { formModelPath, dataContext, validationMessages: [] } }
			})
		);

		deepStrictEqual(store.getState().ui.customMessages, {});
		strictEqual(InternalUiStateSelectors.hasAnyMessages()(store.getState()), false);
	});

	it("uiReducer leaves customMessages untouched for unrelated actions", () => {
		const existingEntry: EngineStore.Validation.CustomEntry = {
			formModelPath,
			dataContext,
			validationMessages: [customMessage]
		};
		const store = createStore({ [key]: existingEntry });

		store.dispatch(Commands.setDisabled(true));

		deepStrictEqual(store.getState().ui.customMessages, { [key]: existingEntry });
	});

	describe("hasAnyMessages", () => {
		it("is true when only the custom slice holds messages", () => {
			const store = createStore({
				[key]: { formModelPath, dataContext, validationMessages: [customMessage] }
			});

			strictEqual(InternalUiStateSelectors.hasAnyMessages()(store.getState()), true);
		});

		it("is true when only the messages slice holds messages", () => {
			const store = createStore({}, createValidationEntry({ path: dataContext }));

			strictEqual(InternalUiStateSelectors.hasAnyMessages()(store.getState()), true);
		});

		it("is false when both slices are empty", () => {
			strictEqual(InternalUiStateSelectors.hasAnyMessages()(createStore({}).getState()), false);
		});
	});
});
