// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
