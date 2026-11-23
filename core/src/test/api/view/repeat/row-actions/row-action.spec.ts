// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { executeTestForCustomRowActions } from "./test-cases/custom-row-actions.js";
import { executeTestForDefaultRowActionVisibility } from "./test-cases/default-row-action-visibility.js";
import { executeTestForDisabled } from "./test-cases/disabled.js";
import { executeTestForEditable } from "./test-cases/editable.js";
import { executeTestForStandardRowActions } from "./test-cases/standard-row-actions.js";
import { executeTestForVisibility } from "./test-cases/visibility.js";

describe("api.view.repeat", () => {
	describe("Row Action", () => {
		describe("Standard Row Actions", () => {
			executeTestForStandardRowActions();
		});

		describe("Custom Row Actions", () => {
			executeTestForCustomRowActions();
		});

		describe("Editable", () => {
			executeTestForEditable();
		});

		describe("Visibility", () => {
			executeTestForVisibility();

			executeTestForDefaultRowActionVisibility();
		});

		describe("Disabled", () => {
			executeTestForDisabled();
		});
	});
});
