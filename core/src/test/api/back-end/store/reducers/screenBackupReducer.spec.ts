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

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { createValidationEntry } from "../../../../utils/validation.js";

const { createTestStore } = SetupHelpers;
const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;

describe("api.back-end.store.reducers", () => {
	const screenLocation: EngineStore.ScreenState[] = [
		{
			path: [],
			locationPath: createModelPath("NestedRepeat")
		}
	];

	const baseBackup: EngineStore.BackupEntry = {
		document: {},
		messages: {}
	};

	const newBackup: EngineStore.BackupEntry = {
		document: {
			Root: {
				Nested_L1: [
					{
						L1_Boolean: false
					}
				]
			}
		},
		messages: createValidationEntry({
			path: createDocumentPath(["Root"], ["Nested_L1"], ["L1_Date"])
		})
	};

	describe("pushBackupReducer", () => {
		it("will add the backup described in the payload to the backup stack", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					backup: [baseBackup],
					screenLocation
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.pushBackup({ ...newBackup }));

			const actualBackupStack = UiStateSelectors.backupStack()(store.getState());
			deepStrictEqual(actualBackupStack, [baseBackup, newBackup]);
		});
	});

	describe("dropBackupReducer", () => {
		it("will remove the last backup", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					backup: [baseBackup, newBackup],
					screenLocation
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.dropBackup({ trigger: "cancel" }));

			const actualBackupStack = UiStateSelectors.backupStack()(store.getState());
			deepStrictEqual(actualBackupStack, [baseBackup]);
		});
	});
});
