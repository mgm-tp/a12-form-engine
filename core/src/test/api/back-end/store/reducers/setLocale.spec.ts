// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setLocale", () => {
		it("sets the locale using the given payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { disabled: false, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });

			const locale = Locale.fromString("my_LO") as Locale;
			store.dispatch(Commands.setLocale({ locale }));

			const actualLocale = UiStateSelectors.locale()(store.getState());
			deepStrictEqual(locale, actualLocale);
		});
	});
});
