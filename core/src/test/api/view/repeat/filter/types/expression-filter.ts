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

import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createEngineStore } from "../../../../../../back-end/store/index.js";
import type { Models } from "../../../../../../back-end/store/internal/store.js";
import { RepeatData } from "../../../../../../data/internal/repeat.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { filterRows } from "../../../../../../view/internal/utilities/filtering.js";
import { US_LOCALE } from "../../../../../utils/localization.js";
import { ModelHelpers } from "../../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupArrayFixture, setupFixture } from "../../../../../utils/setupFixture.js";
import { createDocumentPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";

import { emptySwitchFunctions } from "../filter-functions/empty-switch.js";
import { textLineFunctions } from "../filter-functions/textline-filter.js";
import {
	changeFilterValueTest,
	clearFilterValueTest,
	disabledFilterTest,
	readonlyFilterTest,
	REPEAT_MODEL_PATH
} from "../filter.utils.js";

const { createModelPath } = ModelHelpers;
const { loadData } = SetupHelpers;

export function describeTestForExpressionFilter(models: Models): void {
	const EXPRESSION_COLUMN_NAME = "L1_Expression";
	const EXPRESSION_COLUMN_ID = "expressionrepeatoverviewcolumn-4ed39";
	const fixture = setupFixture(() => ({
		document: loadData("repeat", "data", models.documentModel)
	}));

	const COLUMN_NAME = "L1_Expression";
	const rows: RepeatRow[] = setupArrayFixture(() => {
		const initialState = createEngineStore({
			models,
			locale: US_LOCALE,
			data: { document: fixture.document }
		});

		return RepeatData.getRowsByPath({
			repeatDocumentPath: createDocumentPath(["Root"], ["Nested_L1", 0]),
			repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH),
			state: initialState,
			converter: defaultValueConversion(defaultDataFormats(initialState.locale)),
			localizer: defaultLocalizerFactory({ locale: initialState.locale }),
			optimize: { filterColumnIds: [EXPRESSION_COLUMN_NAME] }
		}).rows;
	});

	const textline = textLineFunctions(EXPRESSION_COLUMN_ID);

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, wrapper => [textline.query(wrapper)], 1);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, wrapper => [textline.query(wrapper)], 1);
	});

	it("changes the filter value when the input is not empty", async () => {
		await changeFilterValueTest(models, EXPRESSION_COLUMN_NAME, textline.triggerChange("Test"), {
			filterValue: "Test"
		});
	});

	it("clears the filter value if the input is empty", async () => {
		await clearFilterValueTest(
			models,
			EXPRESSION_COLUMN_NAME,
			{ filterValue: "Test" },
			textline.triggerChange("")
		);
	});

	describe("when changing the empty switch", () => {
		const emptySwitch = emptySwitchFunctions(EXPRESSION_COLUMN_ID);

		it("sets the `filterNull` value to true if its false", async () => {
			await changeFilterValueTest(
				models,
				EXPRESSION_COLUMN_NAME,
				emptySwitch.triggerChange(true),
				{
					filterValue: "",
					filterNull: true
				},
				undefined,
				undefined,
				{ filterValue: "", filterNull: false }
			);
		});

		it("sets the `filterNull` value to true if it doesn't exist", async () => {
			await changeFilterValueTest(models, EXPRESSION_COLUMN_NAME, emptySwitch.triggerChange(true), {
				filterValue: "",
				filterNull: true
			});
		});

		it("clears the `filterNull` value when it is true", async () => {
			clearFilterValueTest(
				models,
				EXPRESSION_COLUMN_NAME,
				{ filterValue: "", filterNull: true },
				emptySwitch.triggerChange(false)
			);
		});
	});

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);

		it("filters the rows by matching the filter word", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[EXPRESSION_COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { filterValue: "Row 1 ➡ 10" }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[4]
			);
		});

		it("filters the rows by empty value when `filterNull` is set", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[EXPRESSION_COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { filterValue: "", filterNull: true }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[5]
			);
		});
	});
}
