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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization";

import { createEngineStore } from "../../../../../../back-end/store/index.js";
import type { Models } from "../../../../../../back-end/store/internal/store.js";
import { RepeatData } from "../../../../../../data/internal/repeat.js";
import { findElementByFormModelPath } from "../../../../../../models/internal/findElementByFormModelPath.js";
import type { FormModel } from "../../../../../../models/internal/form-model.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { sort } from "../../../../../../view/internal/utilities/sorting.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";
import {
	setupArrayFixture,
	setupFixture,
	setupModelsFixture
} from "../../../../../utils/setupFixture.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { loadData } from "../../../../../utils/setup.js";

import { createRow } from "./utils.js";

export function executeTestForDateSorting(models: Models, locale: Locale): void {
	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-2f3cf";

	const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);
	const date_asc_sorting_order = [
		null,
		null,
		new Date("2018-05-14T00:00:00.000Z"),
		new Date("2019-05-14T00:00:00.000Z"),
		new Date("2020-05-14T00:00:00.000Z")
	];

	const rows: RepeatRow[] = setupArrayFixture(() => {
		const createRowForDate = (rowIndex: number, value: Date | null) => {
			return createRow(COLUMN_PATH, "L1_Date", rowIndex, value);
		};
		return [
			createRowForDate(0, new Date("2019-05-14T00:00:00.000Z")),
			createRowForDate(1, new Date("2018-05-14T00:00:00.000Z")),
			createRowForDate(2, null),
			createRowForDate(3, new Date("2020-05-14T00:00:00.000Z")),
			createRowForDate(4, null)
		];
	});

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
			sortedRows.map(r => r.values[0].data),
			date_asc_sorting_order
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
			sortedRows.map(r => r.values[0].data),
			date_asc_sorting_order.reverse()
		);
	});

	it("returns original order of rows if no sorting order is given", () => {
		deepStrictEqual(sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel), rows);
	});

	describe("if there are partially known dates", () => {
		const dateModels = setupModelsFixture("controls.datecontrol-options");

		const fixture = setupFixture(() => ({
			document: loadData("controls.datecontrol-options", "data", dateModels.documentModel)
		}));

		const REPEAT_MODEL_PATH = createModelPath("Screen1", "sec", "inline-repeat-Repeat_Group");

		function getRows(sortPath: ModelPath): RepeatRow[] {
			const initialState = createEngineStore({
				models: dateModels,
				locale,
				data: { document: fixture.document }
			});

			const modelColumn = findElementByFormModelPath(dateModels.formModel, sortPath);

			return RepeatData.getRowsByPath({
				repeatDocumentPath: createDocumentPath(["partiallyKnownDates"], ["Repeat_Group", 0]),
				repeatFormModelPath: REPEAT_MODEL_PATH,
				state: initialState,
				converter: defaultValueConversion(defaultDataFormats(locale)),
				localizer: defaultLocalizerFactory({ locale }),
				optimize: {
					sortColumnId: (modelColumn as FormModel.RepeatOverviewColumn).id,
					filterColumnIds: []
				}
			}).rows;
		}

		describe("where the day is optional", () => {
			const COLUMN_PATH = [
				...REPEAT_MODEL_PATH,
				...createModelPath("fieldbasedrepeatoverviewcolumn-3d51e")
			];
			const rows = setupFixture(() => {
				return {
					data: getRows(COLUMN_PATH)
				};
			});

			const date_asc_sorting_order = [
				null,
				new Date("2021-07-01T00:00:00.000Z"),
				"2021-08-00",
				new Date("2021-08-18T00:00:00.000Z"),
				new Date("2021-08-30T00:00:00.000Z")
			];

			it("sorts the table correctly in ascending order", () => {
				const sortedRows = sort(
					rows.data,
					COLUMN_PATH,
					locale,
					dateModels.formModel,
					dateModels.documentModel,
					"asc"
				);
				deepStrictEqual(
					sortedRows.map(r => r.values[0].data),
					date_asc_sorting_order
				);
			});

			it("sorts the table correctly in descending order", () => {
				const sortedRows = sort(
					rows.data,
					COLUMN_PATH,
					locale,
					dateModels.formModel,
					dateModels.documentModel,
					"desc"
				);
				deepStrictEqual(
					sortedRows.map(r => r.values[0].data),
					date_asc_sorting_order.reverse()
				);
			});
		});

		describe("where the month is optional", () => {
			const COLUMN_PATH = [
				...REPEAT_MODEL_PATH,
				...createModelPath("fieldbasedrepeatoverviewcolumn-41f14")
			];
			const rows = setupFixture(() => {
				return {
					data: getRows(COLUMN_PATH)
				};
			});

			const date_asc_sorting_order = [
				null,
				"2021-00-00",
				new Date("2021-02-01T00:00:00.000Z"),
				new Date("2021-08-18T00:00:00.000Z"),
				"2022-00-00"
			];

			it("sorts the table correctly in ascending order", () => {
				const sortedRows = sort(
					rows.data,
					COLUMN_PATH,
					locale,
					dateModels.formModel,
					dateModels.documentModel,
					"asc"
				);
				deepStrictEqual(
					sortedRows.map(r => r.values[1].data),
					date_asc_sorting_order
				);
			});

			it("sorts the table correctly in descending order", () => {
				const sortedRows = sort(
					rows.data,
					COLUMN_PATH,
					locale,
					dateModels.formModel,
					dateModels.documentModel,
					"desc"
				);
				deepStrictEqual(
					sortedRows.map(r => r.values[1].data),
					date_asc_sorting_order.reverse()
				);
			});
		});

		describe("where the year is optional", () => {
			const COLUMN_PATH = [
				...REPEAT_MODEL_PATH,
				...createModelPath("fieldbasedrepeatoverviewcolumn-26ba3")
			];
			const rows = setupFixture(() => {
				return {
					data: getRows(COLUMN_PATH)
				};
			});

			const date_asc_sorting_order = [
				null,
				"0000-00-00",
				new Date("2021-08-16T00:00:00.000Z"),
				new Date("2021-08-16T00:00:00.000Z"),
				new Date("2022-08-16T00:00:00.000Z")
			];

			it("sorts the table correctly in ascending order", () => {
				const sortedRows = sort(
					rows.data,
					COLUMN_PATH,
					locale,
					dateModels.formModel,
					dateModels.documentModel,
					"asc"
				);
				deepStrictEqual(
					sortedRows.map(r => r.values[2].data),
					date_asc_sorting_order
				);
			});

			it("sorts the table correctly in descending order", () => {
				const sortedRows = sort(
					rows.data,
					COLUMN_PATH,
					locale,
					dateModels.formModel,
					dateModels.documentModel,
					"desc"
				);
				deepStrictEqual(
					sortedRows.map(r => r.values[2].data),
					date_asc_sorting_order.reverse()
				);
			});
		});
	});
}
