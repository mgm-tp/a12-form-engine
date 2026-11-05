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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { Commands, Events } from "../../../back-end/store/index.js";
import { removeRowEntriesInCustomMessages } from "../../../back-end/store/internal/change-validation.js";
import { EngineStore } from "../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";
import { createDocumentPath } from "../../utils/createDocumentPath.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { MiddlewareHelpers } from "../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../utils/setupFixture.js";
import {
	DR,
	createDocumentForDetachedRepeat
} from "../../utils/test-model-helpers/detached.repeat.js";
import { FieldInValidatonMessage } from "../../utils/test-model-helpers/referencedFieldsInValidationMessage.js";
import {
	createNestedL6Entry,
	createDocumentForRepeat,
	REPEAT
} from "../../utils/test-model-helpers/repeat.js";
import { createCustomValidationMessage } from "../../utils/validation.js";

describe("unit.back-end.store.customMessagesLifecycle", () => {
	const customFormElement = createModelPath("Screen", "custom1");

	function makeEntry(
		dataContext: EntityInstancePath,
		errorCode = "code"
	): EngineStore.Validation.CustomEntry {
		return {
			formModelPath: customFormElement,
			dataContext,
			validationMessages: [
				createCustomValidationMessage({ customFormElement, dataContext, errorCode })
			]
		};
	}

	describe("full validation", () => {
		const models = setupModelsFixture("computation-validation.correctionmode");
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		const baseDocument = {
			CustomTypes: {
				MultiSelect2: [{ value: "key1" }]
			}
		};

		function setupStore(customMessages?: ReadonlyObjectMap<EngineStore.Validation.CustomEntry>) {
			middlewareSpy.spy.mock.resetCalls();
			return createTestStore({
				storeConfig: {
					models,
					data: { dirty: false, document: baseDocument },
					ui: { customMessages }
				},
				middlewares: [middlewareSpy.middleware]
			});
		}

		it("wipes non-empty custom messages when Commands.validateFull is dispatched", () => {
			const dataContext = createDocumentPath(["root"]);
			setupStore({
				[EngineStore.Validation.customKey(customFormElement, dataContext)]: makeEntry(dataContext)
			}).dispatch(Commands.validateFull());

			MiddlewareHelpers.assertAction(
				middlewareSpy.spy,
				Commands.setCustomMessageState({ customMessages: {} })
			);
		});

		it("does not dispatch setCustomMessageState when custom messages are already empty", () => {
			setupStore({}).dispatch(Commands.validateFull());

			MiddlewareHelpers.assertNoAction(
				middlewareSpy.spy,
				Commands.setCustomMessageState({ customMessages: {} })
			);
		});
	});

	describe("EngineStore.Validation.Message.updateCustomMessagesPaths", () => {
		const models = setupModelsFixture(
			"computation-validation.referenced_fields_in_validation_message"
		);

		function rowPath(index: number): EntityInstancePath {
			return createDocumentPath(
				[FieldInValidatonMessage.rootGroup],
				[FieldInValidatonMessage.REPEAT_1.repeatName, index]
			);
		}

		function dataContextInRow(index: number): EntityInstancePath {
			return createDocumentPath(
				[FieldInValidatonMessage.rootGroup],
				[FieldInValidatonMessage.REPEAT_1.repeatName, index],
				[FieldInValidatonMessage.REPEAT_1.nestedGroup],
				[FieldInValidatonMessage.REPEAT_1.F6]
			);
		}

		const unrelatedDataContext = createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_2.repeatName, 3],
			[FieldInValidatonMessage.REPEAT_2.N1]
		);

		describe("and no delta (row remove)", () => {
			const fixture = setupFixture(() => {
				const entryInRow3 = makeEntry(dataContextInRow(3));
				const unrelatedEntry = makeEntry(unrelatedDataContext);
				const customMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
					[EngineStore.Validation.customKey(customFormElement, dataContextInRow(3))]: entryInRow3,
					[EngineStore.Validation.customKey(customFormElement, unrelatedDataContext)]:
						unrelatedEntry
				};

				const result = EngineStore.Validation.Message.updateCustomMessagesPaths(
					customMessages,
					rowPath(1),
					models.documentModel
				);

				return { result, unrelatedEntry };
			});

			it("re-keys and re-indexes the entry (and its messages) for a row after the removed one", () => {
				const newKey = EngineStore.Validation.customKey(customFormElement, dataContextInRow(2));
				const entry = fixture.result[newKey];

				deepStrictEqual(entry?.dataContext, dataContextInRow(2));
				deepStrictEqual(entry?.validationMessages[0].dataContext, dataContextInRow(2));
			});

			it("does not touch entries outside the affected repeat context", () => {
				const key = EngineStore.Validation.customKey(customFormElement, unrelatedDataContext);
				deepStrictEqual(fixture.result[key], fixture.unrelatedEntry);
			});
		});

		describe("and a delta (row move)", () => {
			const fixture = setupFixture(() => {
				const entryInRow3 = makeEntry(dataContextInRow(3));
				const customMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
					[EngineStore.Validation.customKey(customFormElement, dataContextInRow(3))]: entryInRow3
				};

				return EngineStore.Validation.Message.updateCustomMessagesPaths(
					customMessages,
					rowPath(3),
					models.documentModel,
					1
				);
			});

			it("re-keys and re-indexes the entry by the given delta", () => {
				const newKey = EngineStore.Validation.customKey(customFormElement, dataContextInRow(4));
				const entry = fixture[newKey];

				deepStrictEqual(entry?.dataContext, dataContextInRow(4));
				deepStrictEqual(entry?.validationMessages[0].dataContext, dataContextInRow(4));
			});
		});
	});

	describe("removeRowEntriesInCustomMessages", () => {
		const models = setupModelsFixture(
			"computation-validation.referenced_fields_in_validation_message"
		);

		function rowPath(index: number): EntityInstancePath {
			return createDocumentPath(
				[FieldInValidatonMessage.rootGroup],
				[FieldInValidatonMessage.REPEAT_1.repeatName, index]
			);
		}

		function dataContextInRow(index: number): EntityInstancePath {
			return createDocumentPath(
				[FieldInValidatonMessage.rootGroup],
				[FieldInValidatonMessage.REPEAT_1.repeatName, index],
				[FieldInValidatonMessage.REPEAT_1.nestedGroup],
				[FieldInValidatonMessage.REPEAT_1.F6]
			);
		}

		it("drops entries under the removed row and re-indexes the remaining ones", () => {
			const entryInRow2 = makeEntry(dataContextInRow(2), "removedRow");
			const entryInRow3 = makeEntry(dataContextInRow(3), "survivingRow");
			const customMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
				[EngineStore.Validation.customKey(customFormElement, dataContextInRow(2))]: entryInRow2,
				[EngineStore.Validation.customKey(customFormElement, dataContextInRow(3))]: entryInRow3
			};

			const result = removeRowEntriesInCustomMessages(
				rowPath(2),
				customMessages,
				models.documentModel
			);

			const survivingKey = EngineStore.Validation.customKey(customFormElement, dataContextInRow(2));
			deepStrictEqual(Object.keys(result), [survivingKey]);
			deepStrictEqual(result[survivingKey]?.dataContext, dataContextInRow(2));
			// the entry of row 3 is the one that moved down, the one of row 2 was removed
			deepStrictEqual(result[survivingKey]?.validationMessages[0].errorCode, "survivingRow");
		});

		it("keeps a row whose index merely starts with the removed one, such as 10 against 1", () => {
			const entryInRow10 = makeEntry(dataContextInRow(10), "row10");
			const customMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
				[EngineStore.Validation.customKey(customFormElement, dataContextInRow(1))]: makeEntry(
					dataContextInRow(1),
					"row1"
				),
				[EngineStore.Validation.customKey(customFormElement, dataContextInRow(10))]: entryInRow10
			};

			const result = removeRowEntriesInCustomMessages(
				rowPath(1),
				customMessages,
				models.documentModel
			);

			// row 1 went, row 10 survived and moved down to 9
			const survivingKey = EngineStore.Validation.customKey(customFormElement, dataContextInRow(9));
			deepStrictEqual(Object.keys(result), [survivingKey]);
			deepStrictEqual(result[survivingKey]?.validationMessages[0].errorCode, "row10");
		});

		it("returns an empty map when every entry was under the removed row", () => {
			const customMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
				[EngineStore.Validation.customKey(customFormElement, dataContextInRow(2))]: makeEntry(
					dataContextInRow(2)
				)
			};

			const result = removeRowEntriesInCustomMessages(
				rowPath(2),
				customMessages,
				models.documentModel
			);

			deepStrictEqual(result, {});
		});
	});

	describe("detached-repeat backup snapshot (pushBackup payload)", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
		const models = setupModelsFixture("repeat", "detached");

		const documentBefore = createDocumentForRepeat({
			nestedL6: [createNestedL6Entry({ L6_Number: 12 })]
		});

		const action = Events.Repeat.enterRow({
			repeatFormModelPath: DR.SortingAndFiltering.repeatFormModelPathSec3,
			rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 1])
		});

		it("snapshots the current custom messages into the Commands.pushBackup payload", () => {
			const dataContext = createDocumentPath(["Root"]);
			const customMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
				[EngineStore.Validation.customKey(customFormElement, dataContext)]: makeEntry(dataContext)
			};

			middlewareSpy.spy.mock.resetCalls();
			createTestStore({
				storeConfig: {
					models,
					data: { dirty: false, document: documentBefore },
					ui: {
						messages: {},
						customMessages,
						screenLocation: [
							{ path: [], locationPath: createModelPath(DR.SortingAndFiltering.screenName) }
						]
					}
				},
				middlewares: [middlewareSpy.middleware]
			}).dispatch(action);

			MiddlewareHelpers.assertAction(
				middlewareSpy.spy,
				Commands.pushBackup({ messages: {}, document: documentBefore, customMessages })
			);
		});
	});

	describe("detached-repeat cancel (restores backed-up custom messages)", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
		const models = setupModelsFixture("repeat", "detached");

		const detailScreenState: EngineStore.ScreenState = {
			path: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1, 2]),
			locationPath: DR.SortingAndFiltering.dr_locationPath
		};

		const cancelAction = Events.Repeat.leaveDetachedRepeatRow({ cancel: true });

		function setupStore(options: {
			backupCustomMessages?: ReadonlyObjectMap<EngineStore.Validation.CustomEntry>;
			currentCustomMessages?: ReadonlyObjectMap<EngineStore.Validation.CustomEntry>;
		}) {
			const document = createDocumentForDetachedRepeat([{ L1_Number: 1 }]);
			middlewareSpy.spy.mock.resetCalls();
			return createTestStore({
				storeConfig: {
					models,
					data: { dirty: false, document },
					ui: {
						messages: {},
						customMessages: options.currentCustomMessages,
						backup: [
							{
								document,
								messages: {},
								customMessages: options.backupCustomMessages
							}
						],
						screenLocation: [
							{ path: [], locationPath: createModelPath(DR.SortingAndFiltering.screenName) },
							detailScreenState
						]
					}
				},
				middlewares: [middlewareSpy.middleware]
			});
		}

		it("dispatches setCustomMessageState with the backed-up custom messages when they differ from the current ones", () => {
			const dataContext = createDocumentPath(["Root"]);
			const backupCustomMessages: ReadonlyObjectMap<EngineStore.Validation.CustomEntry> = {
				[EngineStore.Validation.customKey(customFormElement, dataContext)]: makeEntry(dataContext)
			};

			setupStore({ backupCustomMessages, currentCustomMessages: {} }).dispatch(cancelAction);

			MiddlewareHelpers.assertAction(
				middlewareSpy.spy,
				Commands.setCustomMessageState({ customMessages: backupCustomMessages })
			);
		});

		it("does not dispatch setCustomMessageState when the backed-up and current custom messages are equal", () => {
			// built twice on purpose: equal by value, but not the same objects
			const dataContext = createDocumentPath(["Root"]);
			const entryKey = EngineStore.Validation.customKey(customFormElement, dataContext);
			const backupCustomMessages = { [entryKey]: makeEntry(dataContext) };

			setupStore({
				backupCustomMessages,
				currentCustomMessages: { [entryKey]: makeEntry(dataContext) }
			}).dispatch(cancelAction);

			MiddlewareHelpers.assertNoAction(
				middlewareSpy.spy,
				Commands.setCustomMessageState({ customMessages: backupCustomMessages })
			);
		});
	});
});
