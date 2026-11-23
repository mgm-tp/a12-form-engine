// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("dropBackup", () => {
		it("removes the last backup from the backup slice", () => {
			const backups: ReadonlyArray<EngineStore.BackupEntry> = [
				{ document: { id: "1" }, messages: {} },
				{ document: { id: "2" }, messages: {} },
				{ document: { id: "3" }, messages: {} }
			];
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					backup: backups,
					screenLocation: []
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.dropBackup({ trigger: "cancel" }));

			const currentBackups = UiStateSelectors.backupStack()(store.getState());
			deepStrictEqual(currentBackups.length, 2);
			deepStrictEqual(currentBackups[0].document, { id: "1" });
			deepStrictEqual(currentBackups[1].document, { id: "2" });
		});
	});
});
