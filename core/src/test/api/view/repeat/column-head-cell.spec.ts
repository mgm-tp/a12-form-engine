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

import { doesNotThrow, ok, strictEqual } from "node:assert/strict";

import { query, screen, within } from "@com.mgmtp.a12.devtools/react";

import { CONTENT_WITH_NEW_LINES, HINT_TOOLTIP } from "../../../rtl-utils/data-roles.js";
import { getComponentMocks } from "../../../rtl-utils/getComponentMocks.js";
import { ModelHelpers } from "../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS as A11Y_IDS } from "../../../utils/test-model-helpers/a11y.js";
import { IDS } from "../../../utils/test-model-helpers/repeat.column-icons.js";

import { ModelElementIdEquals } from "./query-predicates.js";

describe("api.view.repeat", () => {
	describe("Table Head Icons", () => {
		const models = setupModelsFixture("repeat", "column-icons");

		describe("Inline Repeat", () => {
			executeTestForHeadCell({ columns: IDS.IR_COLUMNS });
			executeTestForAccessibility({
				columns: A11Y_IDS.ColumnHeaderCells.IR_COLUMNS
			});
		});

		describe("Detached Repeat", () => {
			executeTestForHeadCell({ columns: IDS.DR_COLUMNS });
			executeTestForAccessibility({
				columns: A11Y_IDS.ColumnHeaderCells.DR_COLUMNS
			});
		});

		describe("Embedded Repeat", () => {
			executeTestForHeadCell({ columns: IDS.ER_COLUMNS });
			executeTestForAccessibility({
				columns: A11Y_IDS.ColumnHeaderCells.ER_COLUMNS
			});
		});

		function executeTestForHeadCell(ids: { columns: IDS.TestTableColumns }): void {
			function setup() {
				return SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					componentMap: getComponentMocks(),
					withWidgets: true
				});
			}

			describe("given a field overview column", () => {
				describe("with an icon", () => {
					describe("with a hint", () => {
						describe("and label hidden set to true", () => {
							it("renders a head cell with an icon and a hint", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN_ICON_LABEL_HIDDEN_HINT,
									labelText: "L1_Enumeration",
									hasLabel: false,
									hasIcon: true,
									hasHint: true
								});
							});
						});

						describe("and label hidden not set", () => {
							it("renders a head cell with an icon, a label and a hint", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN_ICON_HINT,
									labelText: "L1_DateTime",
									hasLabel: true,
									hasIcon: true,
									hasHint: true,
									wrapperDiv: true
								});
							});
						});
					});

					describe("without a hint", () => {
						describe("and label hidden set to true", () => {
							it("renders a head cell with an icon", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN_ICON_LABEL_HIDDEN,
									labelText: "L1_Date",
									hasLabel: false,
									hasIcon: true,
									hasHint: false
								});
							});
						});

						describe("and label hidden not set", () => {
							it("renders a head cell with an icon and a label", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN_ICON,
									labelText: "L1_Number",
									hasLabel: true,
									hasIcon: true,
									hasHint: false
								});
							});
						});
					});
				});

				describe("without an icon", () => {
					describe("with a hint", () => {
						describe("and label hidden set to true", () => {
							it("renders a head cell with a hint and an invisible label for a11y", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN_LABEL_HIDDEN_HINT,
									labelText: "L1_Boolean2",
									hasLabel: false,
									hasIcon: false,
									hasHint: true
								});
							});
						});

						describe("and label hidden not set", () => {
							it("renders a head cell with a label and a hint", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN_HINT,
									labelText: "L1_Time",
									hasLabel: true,
									hasIcon: false,
									hasHint: true
								});
							});
						});
					});

					describe("without a hint", () => {
						describe("and label hidden set to true", () => {
							it("renders a head cell with an invisible label for a11y", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN_LABEL_HIDDEN,
									labelText: "L1_Boolean",
									hasLabel: false,
									hasIcon: false,
									hasHint: false
								});
							});
						});

						describe("and label hidden not set", () => {
							it("renders a head cell with just a label", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.FIELD_COLUMN,
									labelText: "L1_String",
									hasLabel: true,
									hasIcon: false,
									hasHint: false
								});
							});
						});
					});
				});
			});

			describe("given an expression column", () => {
				describe("with an icon", () => {
					describe("and label hidden set to true", () => {
						it("renders a head cell with an icon", async () => {
							await findHeadCellAndAssert({
								modelColumnId: ids.columns.EXPR_COLUMN_ICON_LABEL_HIDDEN,
								labelText: "expr-3",
								hasLabel: false,
								hasIcon: true,
								hasHint: false
							});
						});
					});

					describe("and label hidden not set", () => {
						it("renders a head cell with an icon and a label", async () => {
							await findHeadCellAndAssert({
								modelColumnId: ids.columns.EXPR_COLUMN_ICON,
								labelText: "expr-2",
								hasLabel: true,
								hasIcon: true,
								hasHint: false
							});
						});
					});
				});

				describe("without an icon", () => {
					describe("and label hidden set to true", () => {
						it("renders a head cell with an invisible label for a11y", async () => {
							await findHeadCellAndAssert({
								modelColumnId: ids.columns.EXPR_COLUMN_LABEL_HIDDEN,
								labelText: "expr-4",
								hasLabel: false,
								hasIcon: false,
								hasHint: false
							});
						});
					});

					describe("and label hidden not set", () => {
						it("renders a head cell with just a label", async () => {
							await findHeadCellAndAssert({
								modelColumnId: ids.columns.EXPR_COLUMN,
								labelText: "expr-1",
								hasLabel: true,
								hasIcon: false,
								hasHint: false
							});
						});
					});
				});
			});

			async function findHeadCellAndAssert(params: {
				modelColumnId: string;
				labelText: string;
				hasLabel?: boolean;
				hasIcon?: boolean;
				hasHint?: boolean;
				wrapperDiv?: boolean;
			}): Promise<void> {
				const { modelColumnId, labelText, hasLabel, hasIcon, hasHint } = params;
				const wrapper = await setup();
				const headCell = screen.getByTestId(modelColumnId);

				const iconTestId = modelColumnId + "-icon";
				const icon = within(headCell).queryByTestId(iconTestId);
				const labelContent = within(headCell).queryByDataRole(CONTENT_WITH_NEW_LINES);
				const hint = within(headCell).queryByDataRole(HINT_TOOLTIP);

				if (hasIcon) {
					const iconProps = query(wrapper.widgetMap.Icon).withTestId(iconTestId).props();

					if (!hasLabel) {
						strictEqual(iconProps.title, labelText);
					}
				}

				if (hasLabel) {
					const labelContentProps = query(wrapper.componentMap.ContentWithNewLines)
						.withTestId(modelColumnId)
						.props();
					strictEqual(labelContentProps.content, labelText);
				} else {
					if (!hasIcon && labelText.length > 0) {
						// there must be an invisible label for a11y
						const hiddenTextProps = query(wrapper.widgetMap.HiddenText)
							.withTestId(modelColumnId)
							.props();
						strictEqual(hiddenTextProps.children, labelText);
					}
				}

				if (hasHint) {
					ok(hint);
				}

				// label should be rendered after the icon
				if (hasIcon && hasLabel && labelContent) {
					strictEqual(
						icon?.compareDocumentPosition(labelContent),
						Node.DOCUMENT_POSITION_FOLLOWING
					);
				}

				// hint should be rendered after icon and label
				if (hasHint && hint && (hasIcon || hasLabel)) {
					const iconOrLabel = icon || labelContent;
					strictEqual(iconOrLabel?.compareDocumentPosition(hint), Node.DOCUMENT_POSITION_FOLLOWING);
				}
			}
		}

		function executeTestForAccessibility(ids: {
			columns: A11Y_IDS.ColumnHeaderCells.TestTableColumns;
		}): void {
			describe("accessibility", () => {
				const models = setupModelsFixture("a11y", "repeat");
				function setup() {
					return SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models,
						ui: {
							screenLocation: [
								{
									locationPath: ModelHelpers.createModelPath("columnHeader"),
									path: []
								}
							]
						},
						componentMap: getComponentMocks(),
						withWidgets: true
					});
				}

				describe("given a field overview column", () => {
					describe("which has no hint", () => {
						describe("and which is not sortable", () => {
							it("does set 'contentWrapperRole' to true and does not render a wrapper div", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.NO_HINT_NOT_SORTABLE,
									contentWrapperRole: true,
									wrapperDiv: false
								});
							});
						});
						describe("and which is sortable", () => {
							it("does set 'contentWrapperRole' to true and does not render a wrapper div", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.NO_HINT_SORTABLE,
									contentWrapperRole: true,
									wrapperDiv: false
								});
							});
						});
					});
					describe("which has a hint", () => {
						describe("and which is not sortable", () => {
							it("does set 'contentWrapperRole' to false and does not render a wrapper div", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.HINT_NOT_SORTABLE,
									contentWrapperRole: false,
									wrapperDiv: false
								});
							});
						});
						describe("and which is sortable", () => {
							it("does set 'contentWrapperRole' to false and does render a wrapper div", async () => {
								await findHeadCellAndAssert({
									modelColumnId: ids.columns.HINT_AND_SORTABLE,
									contentWrapperRole: false,
									wrapperDiv: true
								});
							});
						});
					});
				});
				describe("given an expression column", () => {
					describe("which is not sortable", () => {
						it("does set 'contentWrapperRole' to true and does not render a wrapper div", async () => {
							await findHeadCellAndAssert({
								modelColumnId: ids.columns.EXPRESSION_CELL_NOT_SORTABLE,
								contentWrapperRole: true,
								wrapperDiv: false
							});
						});
					});
					describe("which is sortable", () => {
						it("does set 'contentWrapperRole' to true and does not render a wrapper div", async () => {
							await findHeadCellAndAssert({
								modelColumnId: ids.columns.EXPRESSION_CELL_SORTABLE,
								contentWrapperRole: true,
								wrapperDiv: false
							});
						});
					});
				});
				async function findHeadCellAndAssert(params: {
					modelColumnId: string;
					contentWrapperRole?: boolean;
					wrapperDiv?: boolean;
				}): Promise<void> {
					const { modelColumnId, contentWrapperRole, wrapperDiv } = params;
					const wrapper = await setup();

					const headCell = screen.getByTestId(modelColumnId);
					// the following div is selected since it currently seems impossible
					// to get a hold of the react fragment that surrounds the icon,
					// label and hint that we need to verify here
					const contentDiv = within(headCell).getByDataRole("table-header-cell-content");

					const wrapperDivElement = contentDiv.querySelectorAll<HTMLElement>('div[role="button"]');

					if (wrapperDiv) {
						strictEqual(wrapperDivElement.length, 1);
						doesNotThrow(() => within(wrapperDivElement[0]).getByDataRole(CONTENT_WITH_NEW_LINES));
					} else {
						strictEqual(wrapperDivElement.length, 0);
					}

					const headCellRendererProps = query(wrapper.tableMap.headCellRenderer)
						.withPropMatching("column", ModelElementIdEquals(modelColumnId))
						.props();

					strictEqual(headCellRendererProps.contentWrapperRole, contentWrapperRole);
				}
			});
		}
	});
});
