// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual, deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;
const { createModelPath } = ModelHelpers;

describe("api.back-end.store.reducers", () => {
	const screenLocation: EngineStore.ScreenState[] = [
		{
			path: [],
			locationPath: createModelPath("NestedRepeat")
		}
	];

	const backup: EngineStore.CorrectionModeBackup = {
		location: [
			{
				path: [],
				locationPath: createModelPath("SortingAndFiltering")
			}
		],
		sections: {
			"/Screen1/r1/Details/collapsible-opened": true,
			"/Screen1/r1/Details/collapsible-closed": false
		}
	};

	describe("setCorrectionModeBackupReducer", () => {
		it("will set the correction mode backup described in the payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.CorrectionMode.setCorrectionModeBackup({ backup }));

			const actualBackup = UiStateSelectors.correctionModeBackup()(store.getState());
			deepStrictEqual(actualBackup, backup);
		});
	});

	describe("restoreCorrectionModeBackupReducer", () => {
		it("will restore the sections and locations described in the payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					correctionModeBackup: backup,
					screenLocation,
					validationBar: { visible: true, expanded: true, currentMessageKey: undefined }
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.CorrectionMode.restoreCorrectionModeBackup({ backup: backup }));

			const actualBackup = UiStateSelectors.correctionModeBackup()(store.getState());
			strictEqual(actualBackup, undefined);

			const actualSectionState = UiStateSelectors.sectionState()(store.getState());
			deepStrictEqual(actualSectionState, backup.sections);

			const actualLocationStack = UiStateSelectors.screenLocationStack()(store.getState());
			deepStrictEqual(actualLocationStack, backup.location);

			const expectedValidationBarState: EngineStore.ValidationBarState = {
				visible: false,
				expanded: false,
				currentMessageKey: undefined
			};
			const actualValidationBarState = UiStateSelectors.validationBarState()(store.getState());
			deepStrictEqual(actualValidationBarState, expectedValidationBarState);
		});
	});
});
