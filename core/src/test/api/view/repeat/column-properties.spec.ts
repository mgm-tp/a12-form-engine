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

import { deepEqual, equal, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { Column, TableProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Models } from "../../../../back-end/store/internal/store.js";
import { mapRecord } from "../../../../back-end/utils/internal/record.js";
import { defaultMapDispatchToProps } from "../../../../view/internal/configuration/Defaults.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import { RenderGroupFixture } from "../../../utils/rtl-render-group.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IR } from "../../../utils/test-model-helpers/inline.repeat.js";
import {
	createDocumentForRepeat,
	createNestedL1Entry
} from "../../../utils/test-model-helpers/repeat.js";

import { ColumnByLabelView } from "./column_view.js";

describe("api.view.repeat", () => {
	describe("Column properties", () => {
		const onColumnWidthChangeStub = mock.fn();
		const document = createDocumentForRepeat({
			nestedL1: [createNestedL1Entry({ L1_Number: 42 })]
		});
		async function setup(models: Models, screenName: string): Promise<RtlRenderWrapper> {
			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
			return setupFormEngineRendererWithRtlAsync({
				models,
				data: { document },
				ui: {
					screenLocation: [{ locationPath: createModelPath(screenName), path: [] }]
				},
				dispatchConfig: {
					...stubbedDispatch.eventHandlers,
					repeat: {
						...stubbedDispatch.eventHandlers.repeat,
						onColumnWidthChange: onColumnWidthChangeStub
					}
				}
			});
		}

		const models = setupModelsFixture("repeat", "inline");

		// columns are computed in the same way for all repeat types, see
		// table-columns-functions.ts
		describe("Without UI state", () => {
			const { it, render } = RenderGroupFixture(() => setup(models, IR.ColumnProperties.screen));

			// this function is only here to reduce code changes during the RTL
			// migration. it can eventually be removed
			function tables() {
				const ids = {
					repeatColumnWidth: IR.ColumnProperties.ID_COLUMN_WIDTH,
					repeatPinning: IR.ColumnProperties.ID_REPEAT_PINNING,
					repeatEnableColumnsResize: IR.ColumnProperties.ID_REPEAT_RESIZABLE_COLUMNS,
					repeatFixedWidth: IR.ColumnProperties.ID_REPEAT_FIXED_WIDTH
				};

				const FindTable = (id: string) => findTable(render.wrapper, id);

				const mapId2Table = mapRecord(FindTable);

				return mapId2Table(ids);
			}

			function findTable(wrapper: RtlRenderWrapper, repeatId: string): TableProps {
				return query(wrapper.tableMap.Table).withId(repeatId).props();
			}

			const ColsByPinningView = (pinning?: Column.Pinning) => (table: TableProps) => () =>
				table.columns.filter(col => col.pinning === pinning);

			describe("Pinning", () => {
				it("renders columns with pinning=left to the left", () => {
					const leftPinnedCols = ColsByPinningView("left")(tables().repeatPinning)();
					equal(leftPinnedCols?.at(0)?.label, "Left1");
					equal(leftPinnedCols?.at(1)?.label, "Left2");
				});

				it("render columns with pinning=none to the scroll area", () => {
					const scrollCols = ColsByPinningView(undefined)(tables().repeatPinning)();
					equal(scrollCols?.at(0)?.label, "None1");
					equal(scrollCols?.at(1)?.label, "None2");
				});

				it("renders columns with pinning=right in the right area", () => {
					const rightPinnedCols = ColsByPinningView("right")(tables().repeatPinning)();
					equal(rightPinnedCols?.at(0)?.label, "Right1");
					equal(rightPinnedCols?.at(1)?.label, "Right2");
				});
			});

			describe("Column Width", () => {
				it("sets the column width correctly", () => {
					const scrollCols = ColsByPinningView(undefined)(tables().repeatColumnWidth)();
					const widths = scrollCols.map(col => col.width);

					deepEqual(widths, [4, 2.6, 0.5]);
				});

				describe("Resizable Columns", () => {
					describe("if 'enableColumnsResize' is not set in the model for a repeat", () => {
						it("it sets 'columnResizingOptions' of the table to undefined", () => {
							strictEqual(tables().repeatFixedWidth.columnResizingOptions, undefined);
						});
					});

					describe("if 'enableColumnsResize' is set to true in the model for a repeat", () => {
						it(
							"it sets the 'onEndResize' callback of 'columnResizingOptions'" +
								"of the table which calls 'onColumnWidthChange' with the new width",
							() => {
								const columns = tables().repeatEnableColumnsResize.columns;
								const columnResizingOptions =
									tables().repeatEnableColumnsResize.columnResizingOptions;

								columnResizingOptions?.onEndResize?.({
									resizedColumn: columns[0],
									data: {} as any,
									event: {} as any,
									resizedWidthsGetter: () => 3.2
								});

								equal(onColumnWidthChangeStub.mock.callCount(), 1);
							}
						);
					});

					it("uses the column width from the model if none is defined in the state", () => {
						const column = ColumnByLabelView(() => tables().repeatEnableColumnsResize)(
							IR.ColumnProperties.LABEL_COLUMN_WITH_INITIAL_WIDTH
						)();
						equal(column.width, 3);
					});
				});
			});

			describe("Fixed Width", () => {
				describe("if 'fixedWidth' is not set in the model for a column", () => {
					it("sets the prop fixedWidth for the TableColumn to undefined", () => {
						const column = ColumnByLabelView(() => tables().repeatFixedWidth)(
							IR.ColumnProperties.LABEL_COLUMN_NO_FIXED_WIDTH
						)();
						equal(column.fixedWidth, undefined);
					});
				});

				describe("if 'fixedWidth' is set to true in the model for a column", () => {
					it("sets the prop fixedWidth for the TableColumn to true", () => {
						const column = ColumnByLabelView(() => tables().repeatFixedWidth)(
							IR.ColumnProperties.LABEL_COLUMN_FIXED_WIDTH
						)();
						equal(column.fixedWidth, true);
					});
				});
			});
		});

		describe("With UI state", () => {
			it("uses the column width from the state if one is defined for a column", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					ui: {
						screenLocation: [
							{ locationPath: createModelPath(IR.ColumnProperties.screen), path: [] }
						],
						columnWidths: {
							["/ColumnProperties/sec5/inline-repeat-Nested_L1/fieldbasedrepeatoverviewcolumn-2a1a7"]: 2,
							["/ColumnProperties/sec5/inline-repeat-Nested_L1/fieldbasedrepeatoverviewcolumn-bba63"]: 4
						}
					}
				});

				const table = query(wrapper.tableMap.Table).withId(
					IR.ColumnProperties.ID_REPEAT_RESIZABLE_COLUMNS
				).props;

				const cell1 = ColumnByLabelView(table)(
					IR.ColumnProperties.LABEL_COLUMN_WITH_INITIAL_WIDTH
				)();
				equal(cell1.width, 2);

				const cell2 = ColumnByLabelView(table)(
					IR.ColumnProperties.LABEL_COLUMN_WITH_DEFAULT_INITIAL_WIDTH
				)();
				equal(cell2.width, 4);
			});
		});
	});
});
