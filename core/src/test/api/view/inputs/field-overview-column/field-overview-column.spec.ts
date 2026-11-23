// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { executeTestForFieldOverviewColumnAutoExpand } from "./test-cases/auto-expand.js";
import { executeTestForFieldOverviewColumnDisabled } from "./test-cases/disabled.js";
import { executeTestForFieldOverviewColumnHidden } from "./test-cases/hidden.js";
import { executeTestForFieldOverviewColumnLabel } from "./test-cases/label.js";
import { executeTestForFieldOverviewColumnMessages } from "./test-cases/messages.js";
import { executeTestsForFieldOverviewColumnPlaceholder } from "./test-cases/placeholder.js";
import { executeTestForFieldOverviewColumnReadOnly } from "./test-cases/read-only.js";
import { executeTestsForFieldOverviewColumnRendering } from "./test-cases/rendering.js";
import { executeTestForFieldOverviewColumnSuffix } from "./test-cases/suffix.js";
import { executeTestForFieldOverviewColumnValue } from "./test-cases/value.js";

describe("api.view.inputs", () => {
	describe("FieldOverviewColumn", () => {
		describe("value", () => {
			executeTestForFieldOverviewColumnValue();
		});

		describe("read-only", () => {
			executeTestForFieldOverviewColumnReadOnly();
		});

		describe("label", () => {
			executeTestForFieldOverviewColumnLabel();
		});

		describe("auto expand", () => {
			executeTestForFieldOverviewColumnAutoExpand();
		});

		describe("disabled", () => {
			executeTestForFieldOverviewColumnDisabled();
		});

		describe("validation messages", () => {
			executeTestForFieldOverviewColumnMessages();
		});

		describe("hidden", () => {
			executeTestForFieldOverviewColumnHidden();
		});

		describe("suffix", () => {
			executeTestForFieldOverviewColumnSuffix();
		});

		describe("Rendering", () => {
			executeTestsForFieldOverviewColumnRendering();
		});

		describe("placeholder", () => {
			executeTestsForFieldOverviewColumnPlaceholder();
		});
	});
});
