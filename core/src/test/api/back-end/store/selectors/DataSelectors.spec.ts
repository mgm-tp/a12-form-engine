// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { createEngineStore, DataSelectors } from "../../../../../back-end/store/index.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

describe("api.back-end.store.selectors", () => {
	const models = setupModelsFixture("buttons");

	describe("DataSelectors", () => {
		describe("dirty", () => {
			it("returns the data dirty state", () => {
				const store = createEngineStore({
					models,
					locale: US_LOCALE,
					data: {}
				});

				strictEqual(
					DataSelectors.dirty()({ ...store, data: { ...store.data, dirty: false } }),
					false
				);
				strictEqual(
					DataSelectors.dirty()({ ...store, data: { ...store.data, dirty: true } }),
					true
				);
			});
		});
	});
});
