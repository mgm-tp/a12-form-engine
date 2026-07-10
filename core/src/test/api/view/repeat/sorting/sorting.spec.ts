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

import { strictEqual } from "node:assert/strict";

import { act } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import {
	createRepeatInstanceStateEntry,
	createRepeatStaticStateEntry,
	setupConnectedFormEngineWithRtl,
	setupFormEngineRendererWithRtl
} from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createDocumentForDetachedRepeat } from "../../../../utils/test-model-helpers/detached.repeat.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import { REPEAT } from "../../../../utils/test-model-helpers/repeat.js";

import { ColumnByLabelView } from "../column_view.js";
import { REPEAT_MODEL_PATH } from "../filter/filter.utils.js";

import { AssertSorting } from "./assert_sorting.js";
import { executeTestForBooleanSorting } from "./types/boolean-sorting.js";
import { executeTestForConfirmSorting } from "./types/confirm-sorting.js";
import { executeTestForDateSorting } from "./types/date-sorting.js";
import { executeTestForDateRangeSorting } from "./types/dateRange-sorting.js";
import { executeTestForDateTimeSorting } from "./types/dateTime-sorting.js";
import { executeTestForEnumerationSorting } from "./types/enumeration-sorting.js";
import { executeTestForExpressionSorting } from "./types/expression-sorting.js";
import { executeTestForExternalEnumerationSorting } from "./types/external-enumeration-sorting.js";
import { executeTestForNumberSorting } from "./types/number-sorting.js";
import { executeTestForStringSorting } from "./types/string-sorting.js";
import { executeTestForTimeSorting } from "./types/time-sorting.js";
import { executeTestForTypeDefSorting } from "./types/typedef-sorting.js";

describe("api.view.repeat", () => {
	describe("Repeat Sorting", () => {
		const models = setupModelsFixture("repeat", "inline");

		const repeatFormModelPath = createModelPath(...REPEAT_MODEL_PATH);
		const locale = US_LOCALE;

		describe("Table", () => {
			describe("given a table with a default sorting column", () => {
				it("sorts the table by the default column and the default order and sets the default sorting state", () => {
					const wrapper = setupFormEngineRendererWithRtl({
						models,
						data: { document: { Root: { Nested_L7: [{}] } } }
					});

					function assertSortingAsc(tableId: string, colName: string): void {
						const table = query(wrapper.tableMap.Table).withId(tableId).props();
						strictEqual(table.sortOptions?.sortState?.column?.label, colName);
						strictEqual(table.sortOptions?.sortState?.order, "asc");
					}

					assertSortingAsc(IR.SortingAndFiltering.ID_REPEAT_TABLE, "L1_String");
					assertSortingAsc(IR.SortingAndFiltering.ID_REPEAT_TABLE_2, "L1_Expression");
				});
			});

			describe("Column default sorting: Asc", () => {
				it("changes the sorting if the head cell is clicked in the order: asc, desc, none", async () => {
					const wrapper = setupConnectedFormEngineWithRtl({
						models,
						locale: US_LOCALE,
						data: { document: { Root: { Nested_L7: [{}] } } }
					});

					const tableQuery = query(wrapper.tableMap.Table).withId(
						IR.SortingAndFiltering.ID_REPEAT_TABLE
					).props;

					const assertSorting = AssertSorting(tableQuery);

					assertSorting(REPEAT.L1_String, "asc");

					const repeatColumn = ColumnByLabelView(tableQuery)(REPEAT.L1_Number)();

					await act(() => {
						tableQuery().sortOptions?.onSort?.({
							column: repeatColumn,
							order: undefined
						});
					});

					assertSorting(REPEAT.L1_Number, "asc");

					await act(() => {
						tableQuery().sortOptions?.onSort?.({
							column: repeatColumn,
							order: undefined
						});
					});

					assertSorting(REPEAT.L1_Number, "desc");
				});
			});

			function renderForNewRowState(
				rowState: EngineStore.Repeat.NewRow["rowState"]
			): RtlRenderWrapper {
				const doc = createDocumentForDetachedRepeat([
					{ L1_Number: 2 },
					{ L1_Number: 4 },
					{ L1_Number: 3 },
					{ L1_Number: 1 } // new row
				]);
				const orderPath = createModelPath(
					...REPEAT_MODEL_PATH,
					IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN
				);

				return setupFormEngineRendererWithRtl({
					models,
					data: { document: doc },
					ui: {
						screenLocation: [
							createRootScreenState({
								newRow: {
									rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1, 4]),
									rowState
								}
							})
						],
						repeatStaticState: createStaticRepeatState({
							sortingState: {
								sorting: "asc",
								orderPath
							}
						})
					}
				});
			}

			function createRootScreenState(
				o?: Partial<EngineStore.Repeat.InstanceState>
			): EngineStore.ScreenState {
				return {
					path: [],
					locationPath: createModelPath("SortingAndFiltering"),
					repeatInstanceState: {
						[ModelPath.toString(repeatFormModelPath)]: createRepeatEntry(o)
					}
				};
			}

			function createStaticRepeatState(
				o?: Partial<EngineStore.Repeat.StaticState>
			): ReadonlyObjectMap<EngineStore.Repeat.StaticState> | undefined {
				return o
					? {
							[ModelPath.toString(repeatFormModelPath)]: createRepeatStaticStateEntry(o)
						}
					: undefined;
			}

			function createRepeatEntry(
				o?: Partial<EngineStore.Repeat.InstanceState>
			): EngineStore.Repeat.InstanceState {
				return createRepeatInstanceStateEntry({
					...o,
					newRow: o?.newRow?.rowPath
						? {
								rowPath: o.newRow.rowPath,
								rowState: o.newRow.rowState || "workingOn"
							}
						: undefined
				});
			}

			describe("Column default sorting: Desc", () => {
				it("changes the sorting if the head cell is clicked in the order: desc, asc, none", async () => {
					const wrapper = setupConnectedFormEngineWithRtl({
						models,
						locale: US_LOCALE,
						data: { document: { Root: { Nested_L7: [{}] } } }
					});

					const tableQuery = () =>
						query(wrapper.tableMap.Table).withId(IR.SortingAndFiltering.ID_REPEAT_TABLE).props();

					const assertSorting = AssertSorting(tableQuery);

					assertSorting(REPEAT.L1_String, "asc");

					const repeatColumn = ColumnByLabelView(tableQuery)(REPEAT.L1_Time)();

					await act(() => {
						tableQuery().sortOptions?.onSort?.({
							column: repeatColumn,
							order: undefined
						});
					});

					// change to label
					assertSorting(REPEAT.L1_Time, "desc");

					await act(() => {
						tableQuery().sortOptions?.onSort?.({
							column: repeatColumn,
							order: undefined
						});
					});

					assertSorting(REPEAT.L1_Time, "asc");
				});
			});

			describe("New row", () => {
				it("does not sort the new row if it has newRowState='workingOn'", () => {
					const wrapper = renderForNewRowState("workingOn");
					const inputRows = query(wrapper.widgetMap.TextField)
						.withProp("label", "L1_Number")
						.propsHistory();

					strictEqual(inputRows.at(0)?.value, "2");
					strictEqual(inputRows.at(1)?.value, "3");
				});

				it("does sort the new row if it has newRowState='recentlyAdded'", () => {
					const wrapper = renderForNewRowState("recentlyAdded");
					const inputRows = query(wrapper.widgetMap.TextField)
						.withProp("label", "L1_Number")
						.propsHistory();

					strictEqual(inputRows.at(0)?.value, "1");
					strictEqual(inputRows.at(1)?.value, "2");
				});
			});
		});

		describe("String", () => {
			executeTestForStringSorting(models, locale);
		});

		describe("Number", () => {
			executeTestForNumberSorting(models, locale);
		});

		describe("Boolean", () => {
			executeTestForBooleanSorting(models, locale);
		});

		describe("Confirm", () => {
			executeTestForConfirmSorting(models, locale);
		});

		describe("Enumeration", () => {
			executeTestForEnumerationSorting(models, locale);
		});

		describe("Date", () => {
			executeTestForDateSorting(models, locale);
		});

		describe("DateTime", () => {
			executeTestForDateTimeSorting(models, locale);
		});

		describe("Time", () => {
			executeTestForTimeSorting(models, locale);
		});

		describe("DateRange", () => {
			executeTestForDateRangeSorting(models, locale);
		});

		describe("TypeDef", () => {
			executeTestForTypeDefSorting(models, locale);
		});

		describe("External Enumeration", () => {
			executeTestForExternalEnumerationSorting(models);
		});

		describe("Expression", () => {
			executeTestForExpressionSorting(models, locale);
		});
	});
});
