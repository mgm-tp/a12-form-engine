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

import { deepStrictEqual } from "node:assert/strict";

import type { Models } from "../../../../../../back-end/store/internal/store.js";
import { sort } from "../../../../../../view/internal/utilities/sorting.js";
import { externalEnumerationProvider } from "../../../../../unit/view/configurable_externalenumeration.js";
import { US_LOCALE } from "../../../../../utils/localization.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupArrayFixture, setupFixture } from "../../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";

import { getData, getRows } from "./utils.js";

const { loadData } = SetupHelpers;

export function executeTestForExternalEnumerationSorting(models: Models): void {
	const COLUMN_NAME = IR.SortingAndFiltering.ID_L1_EXT_ENUM_COLUMN;
	const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);

	const fixture = setupFixture(() => ({
		document: loadData("repeat", "data", models.documentModel)
	}));

	describe("locale = en", () => {
		const locale = US_LOCALE;
		const rows = setupArrayFixture(() =>
			getRows(models, fixture.document, locale, externalEnumerationProvider, COLUMN_NAME)
		);
		const external_enum_asc_sorting_order = [
			null,
			"Berlin_key",
			"Cologne_key",
			"Dresden_key",
			"Leipzig_key",
			"Munich_key"
		];

		it("sorts the table in ascending order using the current locale", () => {
			const sortedRows = sort(
				rows,
				COLUMN_PATH,
				locale,
				models.formModel,
				models.documentModel,
				"asc"
			);
			deepStrictEqual(
				sortedRows.map(r => getData(r, COLUMN_NAME)),
				external_enum_asc_sorting_order
			);
		});

		it("sorts the table in descending order", () => {
			const sortedRows = sort(
				rows,
				COLUMN_PATH,
				locale,
				models.formModel,
				models.documentModel,
				"desc"
			);
			deepStrictEqual(
				sortedRows.map(r => getData(r, COLUMN_NAME)),
				external_enum_asc_sorting_order.reverse()
			);
		});

		it("returns original order of rows if no sorting order is given", () => {
			deepStrictEqual(
				sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel),
				rows
			);
		});
	});

	describe("locale = de", () => {
		const locale = { language: "de", country: "DE" };

		const rows = setupArrayFixture(() =>
			getRows(models, fixture.document, locale, externalEnumerationProvider, COLUMN_NAME)
		);
		const external_enum_asc_sorting_order = [
			null,
			"Berlin_key",
			"Dresden_key",
			"Cologne_key", // Köln
			"Leipzig_key",
			"Munich_key"
		];
		it("sorts the table in ascending order", () => {
			const sortedRows = sort(
				rows,
				COLUMN_PATH,
				locale,
				models.formModel,
				models.documentModel,
				"asc"
			);
			deepStrictEqual(
				sortedRows.map(r => getData(r, COLUMN_NAME)),
				external_enum_asc_sorting_order
			);
		});

		it("sorts the table in descending order", () => {
			const sortedRows = sort(
				rows,
				COLUMN_PATH,
				locale,
				models.formModel,
				models.documentModel,
				"desc"
			);
			deepStrictEqual(
				sortedRows.map(r => getData(r, COLUMN_NAME)),
				external_enum_asc_sorting_order.reverse()
			);
		});

		it("returns original order of rows if no sorting order is given", () => {
			deepStrictEqual(
				sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel),
				rows
			);
		});
	});
}
