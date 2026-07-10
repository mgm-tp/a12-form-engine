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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { createTestStore } from "../../../../utils/setup.js";

describe("api.back-end.store.reducers", () => {
	describe("setSectionStateReducer", () => {
		it("will merge the already existing section state with the given one from the payload", () => {
			const baseStack: ReadonlyObjectMap<boolean> = {
				[ModelPath.toString(createModelPath("Screen1", "Section1"))]: true,
				[ModelPath.toString(createModelPath("Screen1", "Section2"))]: false
			};

			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [{ locationPath: [], path: [] }],
					sectionState: baseStack
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(
				Commands.setSectionsCollapsed({
					sections: [
						{
							collapse: true,
							path: createModelPath("Screen1", "Section2")
						},
						{
							collapse: false,
							path: createModelPath("Screen1", "Section3")
						}
					]
				})
			);

			const expectedState = {
				[ModelPath.toString(createModelPath("Screen1", "Section1"))]: true,
				[ModelPath.toString(createModelPath("Screen1", "Section2"))]: true,
				[ModelPath.toString(createModelPath("Screen1", "Section3"))]: false
			};

			const actualSectionState = UiStateSelectors.sectionState()(store.getState());
			deepStrictEqual(actualSectionState, expectedState);
		});
	});
});
