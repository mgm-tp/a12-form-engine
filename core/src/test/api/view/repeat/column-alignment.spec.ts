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

import { equal } from "node:assert/strict";

import type { Predicate } from "fp-ts/lib/Predicate.js";
import { not } from "fp-ts/lib/Predicate.js";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Models } from "../../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../../models/index.js";
import type { TableWidgetMap } from "../../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { RenderGroupFixture } from "../../../utils/rtl-render-group.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS } from "../../../utils/test-model-helpers/repeat.column-alignment.js";
import {
	createDocumentForRepeat,
	createNestedL1Entry
} from "../../../utils/test-model-helpers/repeat.js";
import { createModelPath } from "../../../utils/createModelPath.js";

import { ModelElementIdEquals } from "./query-predicates.js";

describe("api.view.repeat", () => {
	describe("Column Alignment", () => {
		interface AlignmentTestProps {
			columns: BaseColumnType[];
			colCount: number;
			alignment: "specificHorizontalAlignment" | "specificVerticalAlignment";
			expectedAlignmentHead?:
				| FormModel.HorizontalAlignment
				| FormModel.VerticalAlignment
				| "default";
			expectedAlignmentBody:
				| FormModel.HorizontalAlignment
				| FormModel.VerticalAlignment
				| "default";
		}

		function setup(models: Models, screenName: string): Promise<RtlRenderWrapper> {
			const document = createDocumentForRepeat({
				nestedL1: [createNestedL1Entry({ L1_Number: 42 })]
			});

			return setupFormEngineRendererWithRtlAsync({
				models,
				data: { document },
				ui: {
					screenLocation: [{ locationPath: createModelPath(screenName), path: [] }]
				}
			});
		}

		function defaultHeadAlignment(col: BaseColumnType): FormModel.HorizontalAlignment {
			return col.label === "L1_Number" ? "right" : "left";
		}
		function defaultBodyAlignment(col: BaseColumnType): FormModel.HorizontalAlignment {
			return [
				IDS.IR.HORIZONTAL.ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD,
				IDS.DR.HORIZONTAL.ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD,
				IDS.ER.HORIZONTAL.ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD
			].find(id => ModelElementIdEquals(id)(col))
				? "right"
				: "left";
		}

		const LabelIs: (label: string) => Predicate<BaseColumnType> = label => col =>
			col.label === label;

		const tableId = (repeatId: string) => `a12-${repeatId}-table`;

		const columnsForRepeat = (repeatId: string) => (tableMap: TableWidgetMap) =>
			query(tableMap.Table)
				.withId(tableId(repeatId))
				.props()
				.columns.filter(not(LabelIs("Actions")));

		function testColumnAlignment(props: AlignmentTestProps): void {
			equal(props.columns.length, props.colCount, `Wrong count of head cells`);

			props.columns.forEach(col => {
				equal(
					col[props.alignment]?.head,
					props.expectedAlignmentHead !== "default"
						? props.expectedAlignmentHead
						: defaultHeadAlignment(col),
					`Wrong head alignment for column ${col.label}`
				);
				equal(
					col[props.alignment]?.body,
					props.expectedAlignmentBody !== "default"
						? props.expectedAlignmentBody
						: defaultBodyAlignment(col),
					`Wrong body alignment for column ${col.label}`
				);
			});
		}

		function testHorizontalAlignment(repeatType: "IR" | "DR" | "ER"): void {
			describe("Horizontal Alignment", () => {
				const models = setupModelsFixture("repeat", "column-alignment");
				const { it, render } = RenderGroupFixture(() => setup(models, IDS[repeatType].screen));

				describe("Given columns with no specificHorizontalAlignment set in the form model", () => {
					it("sets the horizontalAlignment prop to 'left' for non-action columns with any data type except number", () => {
						const columns = columnsForRepeat(IDS[repeatType].HORIZONTAL.ID_REPEAT_DEFAULT)(
							render.wrapper.tableMap
						).filter(not(LabelIs("L1_Number")));

						testColumnAlignment({
							columns,
							colCount: repeatType === "IR" ? 11 : 10,
							alignment: "specificHorizontalAlignment",
							expectedAlignmentHead: "left",
							expectedAlignmentBody: "left"
						});
					});

					it("sets the horizontalAlignment prop to 'right' for non-action columns with data type number", () => {
						const columns = columnsForRepeat(IDS[repeatType].HORIZONTAL.ID_REPEAT_DEFAULT)(
							render.wrapper.tableMap
						).filter(LabelIs("L1_Number"));

						testColumnAlignment({
							columns,
							colCount: 1,
							alignment: "specificHorizontalAlignment",
							expectedAlignmentHead: "right",
							expectedAlignmentBody: "right"
						});
					});

					if (repeatType === "IR") {
						describe("and with read-only presentation set to Text-Output", () => {
							it("sets the horizontalAlignment prop to 'left' for non-action columns with any data type except number", () => {
								const columns = columnsForRepeat(IDS[repeatType].HORIZONTAL.ID_REPEAT_READONLY)(
									render.wrapper.tableMap
								).filter(not(LabelIs("L1_Number")));

								testColumnAlignment({
									columns,
									colCount: repeatType === "IR" ? 11 : 10,
									alignment: "specificHorizontalAlignment",
									expectedAlignmentHead: "left",
									expectedAlignmentBody: "left"
								});
							});

							it("sets the horizontalAlignment prop to 'right' for non-action columns with data type number", () => {
								const columns = columnsForRepeat(IDS[repeatType].HORIZONTAL.ID_REPEAT_READONLY)(
									render.wrapper.tableMap
								).filter(LabelIs("L1_Number"));

								testColumnAlignment({
									columns,
									colCount: 1,
									alignment: "specificHorizontalAlignment",
									expectedAlignmentHead: "right",
									expectedAlignmentBody: "right"
								});
							});
						});
					}
				});

				describe("Given columns with a specificHorizontalAlignment set in the form model", () => {
					describe("for the header and body", () => {
						it("sets the horizontalAlignment prop to the given value for these columns", () => {
							const columns = columnsForRepeat(IDS[repeatType].HORIZONTAL.ID_REPEAT_CENTER)(
								render.wrapper.tableMap
							);

							testColumnAlignment({
								columns,
								colCount: repeatType === "IR" ? 12 : 11,
								alignment: "specificHorizontalAlignment",
								expectedAlignmentHead: "center",
								expectedAlignmentBody: "center"
							});
						});
					});
					describe("only for the header", () => {
						it("sets the horizontalAlignment prop only to the given value for the head cells of these columns", () => {
							const columns = columnsForRepeat(
								IDS[repeatType].HORIZONTAL.ID_REPEAT_CENTER_ONLY_HEAD
							)(render.wrapper.tableMap);

							testColumnAlignment({
								columns,
								colCount: repeatType === "IR" ? 12 : 11,
								alignment: "specificHorizontalAlignment",
								expectedAlignmentHead: "center",
								expectedAlignmentBody: "default"
							});
						});
					});
					describe("only for the body", () => {
						it("sets the horizontalAlignment prop to the given value for both the body and head cells of these columns", () => {
							const columns = columnsForRepeat(
								IDS[repeatType].HORIZONTAL.ID_REPEAT_CENTER_ONLY_BODY
							)(render.wrapper.tableMap);

							testColumnAlignment({
								columns,
								colCount: repeatType === "IR" ? 12 : 11,
								alignment: "specificHorizontalAlignment",
								expectedAlignmentHead: "center",
								expectedAlignmentBody: "center"
							});
						});
					});
				});
			});
		}

		function testVerticalAlignmentInline(): void {
			describe("Vertical Alignment", () => {
				const models = setupModelsFixture("repeat", "column-alignment");
				const { it, render } = RenderGroupFixture(() => setup(models, IDS.IR.screen));
				describe("Given columns with no specificVerticalAlignment set in the form model", () => {
					describe("In a repeat with no expression cells", () => {
						it("sets the verticalAlignment prop to 'default' for all non-action columns", () => {
							const columns = columnsForRepeat(
								IDS.IR.VERTICAL.ID_REPEAT_DEFAULT_WITHOUT_EXPRESSION
							)(render.wrapper.tableMap);

							testColumnAlignment({
								columns,
								colCount: 11,
								alignment: "specificVerticalAlignment",
								expectedAlignmentBody: "top"
							});
						});
					});

					describe("In a repeat with at least one expression cell", () => {
						it("sets the verticalAlignment prop to 'middle' for all non-action columns", () => {
							const columns = columnsForRepeat(IDS.IR.VERTICAL.ID_REPEAT_DEFAULT_WITH_EXPRESSION)(
								render.wrapper.tableMap
							);

							testColumnAlignment({
								columns,
								colCount: 12,
								alignment: "specificVerticalAlignment",
								expectedAlignmentBody: "middle"
							});
						});
					});
				});

				describe("Given columns with a specificVerticalAlignment set in the form model", () => {
					describe("for the header and body", () => {
						it("sets the verticalAlignment prop to the given value for these columns", () => {
							const columns = columnsForRepeat(IDS.IR.VERTICAL.ID_REPEAT_BOTTOM)(
								render.wrapper.tableMap
							);

							testColumnAlignment({
								columns,
								colCount: 12,
								alignment: "specificVerticalAlignment",
								expectedAlignmentHead: "bottom",
								expectedAlignmentBody: "bottom"
							});
						});
					});

					describe("only for the header", () => {
						describe("In a repeat with no expression cells", () => {
							it(
								"sets the verticalAlignment prop to the given value for the header " +
									"and to 'top' for the body for all non-action columns",
								() => {
									const columns = columnsForRepeat(
										IDS.IR.VERTICAL.ID_REPEAT_HEADER_WITHOUT_EXPRESSION
									)(render.wrapper.tableMap);

									testColumnAlignment({
										columns,
										colCount: 2,
										alignment: "specificVerticalAlignment",
										expectedAlignmentHead: "bottom",
										expectedAlignmentBody: "top"
									});
								}
							);
						});

						describe("In a repeat with at least one expression cell", () => {
							it(
								"sets the verticalAlignment prop to the given value for the header " +
									" and to 'middle' for the body for all non-action columns",
								() => {
									const columns = columnsForRepeat(
										IDS.IR.VERTICAL.ID_REPEAT_HEADER_WITH_EXPRESSION
									)(render.wrapper.tableMap);

									testColumnAlignment({
										columns,
										colCount: 3,
										alignment: "specificVerticalAlignment",
										expectedAlignmentHead: "bottom",
										expectedAlignmentBody: "middle"
									});
								}
							);
						});
					});

					describe("only for the body", () => {
						it(
							"sets the verticalAlignment prop to the given value for the body " +
								"and to undefined for the header for all non-action columns",
							() => {
								const columns = columnsForRepeat(IDS.IR.VERTICAL.ID_REPEAT_BODY)(
									render.wrapper.tableMap
								);

								testColumnAlignment({
									columns,
									colCount: 3,
									alignment: "specificVerticalAlignment",
									expectedAlignmentHead: undefined,
									expectedAlignmentBody: "bottom"
								});
							}
						);
					});
				});
			});
		}

		function testVerticalAlignmentDetachedEmbedded(repeatType: "DR" | "ER"): void {
			describe("Vertical Alignment", () => {
				const models = setupModelsFixture("repeat", "column-alignment");
				const { it, render } = RenderGroupFixture(() => setup(models, IDS[repeatType].screen));

				describe("Given columns with no specificVerticalAlignment set in the form model", () => {
					it("sets the verticalAlignment prop to 'middle' for all non-action columns", () => {
						const columns = columnsForRepeat(IDS[repeatType].VERTICAL.ID_REPEAT_DEFAULT)(
							render.wrapper.tableMap
						);

						testColumnAlignment({
							columns,
							colCount: 11,
							alignment: "specificVerticalAlignment",
							expectedAlignmentBody: "middle"
						});
					});
				});

				describe("Given columns with a specificVerticalAlignment set in the form model", () => {
					it("sets the verticalAlignment prop to the given value for these columns", () => {
						const columns = columnsForRepeat(IDS[repeatType].VERTICAL.ID_REPEAT_BOTTOM)(
							render.wrapper.tableMap
						);

						testColumnAlignment({
							columns,
							colCount: 11,
							alignment: "specificVerticalAlignment",
							expectedAlignmentHead: "bottom",
							expectedAlignmentBody: "bottom"
						});
					});
				});
			});
		}

		describe("Inline Repeat", () => {
			testHorizontalAlignment("IR");
			testVerticalAlignmentInline();
		});

		describe("Detached Repeat", () => {
			testHorizontalAlignment("DR");
			testVerticalAlignmentDetachedEmbedded("DR");
		});

		describe("Embedded Repeat", () => {
			testHorizontalAlignment("ER");
			testVerticalAlignmentDetachedEmbedded("ER");
		});
	});
});
