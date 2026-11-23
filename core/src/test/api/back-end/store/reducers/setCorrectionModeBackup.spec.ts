// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setCorrectionModeBackup", () => {
		it("sets the correction mode backup using the given payload", () => {
			const correctionModeBackup: EngineStore.CorrectionModeBackup = {
				location: [
					{
						locationPath: ModelHelpers.createModelPath("My", "Path"),
						path: []
					}
				],
				sections: {}
			};
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(
				Commands.CorrectionMode.setCorrectionModeBackup({ backup: correctionModeBackup })
			);

			const currentBackups = UiStateSelectors.correctionModeBackup()(store.getState());
			deepStrictEqual(currentBackups, correctionModeBackup);
		});
	});
});
