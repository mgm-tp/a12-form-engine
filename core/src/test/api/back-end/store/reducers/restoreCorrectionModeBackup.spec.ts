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
 * 1. Open-Source License – EUPL v1.2
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

import { strictEqual, deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("restoreCorrectionModeBackup", () => {
		it("sets the section state using the backup.sections of the payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					sectionState: { sec1: true, sec2: false },
					screenLocation: []
				}
			};

			const store = createTestStore({ storeConfig });

			const newSectionState = { sec3: true, sec4: false };
			store.dispatch(
				Commands.CorrectionMode.restoreCorrectionModeBackup({
					backup: { sections: newSectionState, location: [] }
				})
			);

			const sectionState = UiStateSelectors.sectionState()(store.getState());
			strictEqual(sectionState, newSectionState);
		});

		it("sets the screen state using the backup.location value of the payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [{ locationPath: ModelHelpers.createModelPath("Old", "Path"), path: [] }]
				}
			};

			const store = createTestStore({ storeConfig });

			const newLocationStack: ReadonlyArray<EngineStore.ScreenState> = [
				{
					locationPath: ModelHelpers.createModelPath("New", "Path"),
					path: []
				}
			];
			store.dispatch(
				Commands.CorrectionMode.restoreCorrectionModeBackup({
					backup: { sections: {}, location: newLocationStack }
				})
			);

			const screenLocationStack = UiStateSelectors.screenLocationStack()(store.getState());
			strictEqual(screenLocationStack, newLocationStack);
		});

		describe("given a backup.backups value in the payload", () => {
			it("sets the backup state using the value", () => {
				const storeConfig = {
					data: { dirty: false, document: {} },
					ui: { screenLocation: [] }
				};

				const store = createTestStore({ storeConfig });

				const newBackup: ReadonlyArray<EngineStore.BackupEntry> = [
					{ document: { id: "1" }, messages: {} }
				];
				store.dispatch(
					Commands.CorrectionMode.restoreCorrectionModeBackup({
						backup: {
							sections: {},
							location: [],
							backups: newBackup
						}
					})
				);

				const backupStack = UiStateSelectors.backupStack()(store.getState());
				strictEqual(backupStack, newBackup);
			});
		});

		describe("given no backup.backups value in the payload", () => {
			it("sets the backup state to an empty array", () => {
				const oldBackup: ReadonlyArray<EngineStore.BackupEntry> = [
					{ document: { id: "1" }, messages: {} }
				];

				const storeConfig = {
					data: { dirty: false, document: {} },
					ui: { backup: oldBackup, screenLocation: [] }
				};

				const store = createTestStore({ storeConfig });

				store.dispatch(
					Commands.CorrectionMode.restoreCorrectionModeBackup({
						backup: {
							sections: {},
							location: []
						}
					})
				);

				const backupStack = UiStateSelectors.backupStack()(store.getState());
				deepStrictEqual(backupStack, []);
			});
		});

		it("resets the validation-bar", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					validationBar: {
						visible: true,
						expanded: true,
						currentMessageKey: "MyKey"
					},
					screenLocation: []
				}
			};

			const store = createTestStore({ storeConfig });

			store.dispatch(
				Commands.CorrectionMode.restoreCorrectionModeBackup({
					backup: {
						sections: {},
						location: []
					}
				})
			);

			const validationBarState = UiStateSelectors.validationBarState()(store.getState());
			deepStrictEqual(validationBarState, {
				currentMessageKey: undefined,
				visible: false,
				expanded: false
			});
		});
	});
});
