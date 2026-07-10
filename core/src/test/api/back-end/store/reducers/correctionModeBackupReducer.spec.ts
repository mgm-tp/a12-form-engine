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

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { createTestStore } from "../../../../utils/setup.js";

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
