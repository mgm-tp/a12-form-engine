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
 * 1. Open-Source License – EUPL v1.2
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

import type { Models } from "../../../../../back-end/store/internal/store.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";

import { describeTestsForFilterRows } from "./describeTestsForFilterRows.js";
import { describeTestsForNewRowState } from "./describeTestsForNewRowState.js";
import { describeTestForBooleanFilter } from "./types/boolean-filter.js";
import { describeTestForConfirmFilter } from "./types/confirm-filter.js";
import { describeTestForDateFilter } from "./types/date-filter.js";
import { describeTestForDateFragmentFilter } from "./types/dateFragment-filter.js";
import { executeTestForDateRangeFilter } from "./types/dateRange-filter.js";
import { describeTestForDateTimeFilter } from "./types/dateTime-filter.js";
import { describeTestForEnumerationFilter } from "./types/enumeration-filter.js";
import { describeTestForExpressionFilter } from "./types/expression-filter.js";
import { describeTestForMultiSelectFilter } from "./types/multiSelect-filter.js";
import { describeTestForNumberFilter } from "./types/number-filter.js";
import { describeTestForStringFilter } from "./types/string-filter.js";
import { describeTestForTimeFilter } from "./types/time-filter.js";

describe("api.view.repeat", () => {
	describe("Repeat Filter", () => {
		const models = setupModelsFixture("repeat", "inline");
		const detachedModels: Models = setupModelsFixture("repeat", "detached");
		const timeZoneModels = setupModelsFixture("controls.date-timezone");

		describe("filterRows()", () => {
			describeTestsForFilterRows(models);
		});

		describe("String", () => {
			describeTestForStringFilter(models, IR.SortingAndFiltering.ID_L1_STRING_COLUMN);
		});

		describe("Custom", () => {
			describeTestForStringFilter(models, IR.SortingAndFiltering.ID_L1_CUSTOM_COLUMN);
		});

		describe("Number", () => {
			describeTestForNumberFilter(models);
		});

		describe("Boolean", () => {
			describeTestForBooleanFilter(models);
		});

		describe("Confirm", () => {
			describeTestForConfirmFilter(models);
		});

		describe("Enumeration", () => {
			describeTestForEnumerationFilter(models, IR.SortingAndFiltering.ID_L1_ENUM_COLUMN);

			describe("With filterExposition STRING", () => {
				describeTestForStringFilter(
					models,
					IR.SortingAndFiltering.ID_L1_ENUM_EXPOSITION_STRING_COLUMN,
					true
				);
			});
		});

		describe("External Enumeration", () => {
			describeTestForStringFilter(models, IR.SortingAndFiltering.ID_L1_EXT_ENUM_COLUMN, true);

			describe("With filterExposition FULL", () => {
				describeTestForEnumerationFilter(
					models,
					IR.SortingAndFiltering.ID_L1_EXT_ENUM_EXPOSITION_FULL_COLUMN
				);
			});
		});

		describe("Date", () => {
			describeTestForDateFilter(models, timeZoneModels, "Date");
		});

		describe("DateTime", () => {
			describeTestForDateTimeFilter(models, timeZoneModels);
		});

		describe("Time", () => {
			describeTestForTimeFilter(models, timeZoneModels);
		});

		describe("DateFragment", () => {
			describeTestForDateFragmentFilter(models, timeZoneModels);
		});

		describe("DateRange", () => {
			describe("with no interpretationOfYear", () => {
				describeTestForDateFilter(models, timeZoneModels, "DateRange");
			});

			describe("with interpretationOfYear", () => {
				executeTestForDateRangeFilter(models, timeZoneModels);
			});
		});

		describe("Expressions", () => {
			describeTestForExpressionFilter(models);
		});

		describe("TypeDef", () => {
			describeTestForStringFilter(models, IR.SortingAndFiltering.ID_L1_TYPEDEF_COLUMN);
		});

		describe("MultiSelect", () => {
			describeTestForMultiSelectFilter(models);
		});

		describe("New row", () => {
			describeTestsForNewRowState(detachedModels, models);
		});
	});
});
