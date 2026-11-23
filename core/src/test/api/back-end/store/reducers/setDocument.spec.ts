// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, DataSelectors } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setDocument", () => {
		it("sets the document using the given payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { disabled: false, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });

			const document = { id: "4" };
			store.dispatch(Commands.setDocument({ document, changes: [] }));

			const actualDocument = DataSelectors.document()(store.getState());
			deepStrictEqual(document, actualDocument);
		});
	});
});
