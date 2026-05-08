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

import { strictEqual } from "node:assert/strict";

import { last, type NonEmptyArray } from "fp-ts/lib/NonEmptyArray.js";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { FormModel } from "../../../models/index.js";
import { FormModelPath } from "../../../models/internal/utils/form-model-path.js";
import type { ModelVisitor } from "../../../models/internal/utils/form-model-walker.js";
import { ModelWalker, VisitProcess } from "../../../models/internal/utils/form-model-walker.js";
import {
	createButton,
	createButtonPanel,
	createControl,
	createControlGrid,
	createDetachedRepeat,
	createEmbeddedRepeat,
	createExpressionColumn,
	createFieldColumn,
	createFormModel,
	createHeaderFooter,
	createInlineRepeat,
	createMultiColumnSection,
	createRow,
	createScreen,
	createSection
} from "../../utils/form-model-factory.js";

describe("unit.models.form-model-walker.accept", () => {
	/**
	 * The following test cases check the accept methods of the model walker by creating suitable form models that
	 * also give hints to the visitor on how to control the traversal..
	 * The visitor returns VisitProcess.STOP or VisitProcess.ContinueButDoNotGoDeeper if it encounters a model
	 * element id containing the respective "stop" or "doNotGoDeeper" string. Every other id will just result in
	 * continued traversal.
	 * The assertions only test the number of visited elements since the traversal order test already covers the
	 * actual order of visited elements.
	 */

	describe("acceptModel", () => {
		/* full order of traversal:
		 * screen, screen, screen, header, major button, minor button, footer, major button, minor button
		 */
		it("traverses all screens, the subheader box and footer box", () => {
			const visitor = new TrackingVisitor();
			const testModel = createFormModel({
				screens: [createScreen({ id: "1" }), createScreen({ id: "2" }), createScreen({ id: "3" })],
				subHeaderBox: createHeaderFooter({ type: "header", withButton: true }),
				footerBox: createHeaderFooter({ type: "footer", withButton: true })
			});
			new ModelWalker(visitor).acceptModel(testModel);
			strictEqual(visitor.visitedElements.length, 9);
		});

		it("stops if visitScreen returns STOP for one of the screens", () => {
			const visitor = new TrackingVisitor();
			const testModel = createFormModel({
				// stop after 2nd screen
				screens: [
					createScreen({ id: "1" }),
					createScreen({ id: "stop" }),
					createScreen({ id: "3" })
				],
				subHeaderBox: createHeaderFooter({ type: "header", withButton: true }),
				footerBox: createHeaderFooter({ type: "footer", withButton: true })
			});
			new ModelWalker(visitor).acceptModel(testModel);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("stops if visitButton returns STOP for one of the subheader buttons", () => {
			const visitor = new TrackingVisitor();
			const testModel = createFormModel({
				screens: [createScreen({ id: "1" }), createScreen({ id: "2" }), createScreen({ id: "3" })],
				// stop after 1st major button
				subHeaderBox: createHeaderFooter({ type: "header", withButton: true, stopButton: true }),
				footerBox: createHeaderFooter({ type: "footer", withButton: true })
			});
			new ModelWalker(visitor).acceptModel(testModel);
			strictEqual(visitor.visitedElements.length, 5);
		});

		it("stops if visitButton returns STOP for one of the footer buttons", () => {
			const visitor = new TrackingVisitor();
			const testModel = createFormModel({
				screens: [createScreen({ id: "1" }), createScreen({ id: "2" }), createScreen({ id: "3" })],
				subHeaderBox: createHeaderFooter({ type: "header", withButton: true }),
				// stop after 1st major button
				footerBox: createHeaderFooter({ type: "footer", withButton: true, stopButton: true })
			});
			new ModelWalker(visitor).acceptModel(testModel);
			strictEqual(visitor.visitedElements.length, 8);
		});
	});

	describe("acceptHeaderFooter", () => {
		/* full order of traversal:
		 * header|footer, major button, minor button
		 */
		it("traverses all major and minor buttons of the header/footer", () => {
			const visitor = new TrackingVisitor();
			const header = createHeaderFooter({ type: "header", withButton: true });
			strictEqual(new ModelWalker(visitor).acceptHeaderFooter(header), true);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitButton returns STOP for one of the buttons", () => {
			const visitor = new TrackingVisitor();
			const header = createHeaderFooter({ type: "header", withButton: true, stopButton: true });
			strictEqual(new ModelWalker(visitor).acceptHeaderFooter(header), false);
			strictEqual(visitor.visitedElements.length, 2);
		});
	});

	describe("acceptScreen", () => {
		/* full order of traversal:
		 * screen, header, screen element, footer
		 */
		it("traverses the screen header, all screen elements of the screen and the screen footer", () => {
			const visitor = new TrackingVisitor();
			const screen = createScreen({
				id: "1",
				subHeaderBox: createHeaderFooter({ type: "header" }),
				footerBox: createHeaderFooter({ type: "footer" }),
				screenElements: [createControlGrid({ id: "cg-1" })]
			});
			strictEqual(new ModelWalker(visitor).acceptScreen(screen), true);
			strictEqual(visitor.visitedElements.length, 4);
		});

		it("stops if visitScreen returns STOP", () => {
			const visitor = new TrackingVisitor();
			const screen = createScreen({
				id: "stop",
				subHeaderBox: createHeaderFooter({ type: "header" }),
				footerBox: createHeaderFooter({ type: "footer" }),
				screenElements: [createControlGrid({ id: "cg-1" })]
			});
			strictEqual(new ModelWalker(visitor).acceptScreen(screen), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visitButton returns STOP for one of the subheader buttons", () => {
			const visitor = new TrackingVisitor();
			const screen = createScreen({
				id: "1",
				subHeaderBox: createHeaderFooter({ type: "header", withButton: true, stopButton: true }),
				footerBox: createHeaderFooter({ type: "footer" }),
				screenElements: [createControlGrid({ id: "cg-1" })]
			});
			strictEqual(new ModelWalker(visitor).acceptScreen(screen), false);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visit* returns STOP for one of the screen elements", () => {
			const visitor = new TrackingVisitor();
			const screen = createScreen({
				id: "1",
				subHeaderBox: createHeaderFooter({ type: "header" }),
				footerBox: createHeaderFooter({ type: "footer" }),
				screenElements: [createControlGrid({ id: "stop" })]
			});
			strictEqual(new ModelWalker(visitor).acceptScreen(screen), false);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitButton returns STOP for one of the footer buttons", () => {
			const visitor = new TrackingVisitor();
			const screen = createScreen({
				id: "1",
				subHeaderBox: createHeaderFooter({ type: "header" }),
				footerBox: createHeaderFooter({ type: "footer", withButton: true, stopButton: true }),
				screenElements: [createControlGrid({ id: "cg-1" })]
			});
			strictEqual(new ModelWalker(visitor).acceptScreen(screen), false);
			strictEqual(visitor.visitedElements.length, 5);
		});

		it(
			"does not traverse the screen header, any screen elements of the screen and the screen footer if" +
				" visitScreen returns ContinueButDoNotGoDeeper",
			() => {
				const visitor = new TrackingVisitor();
				const screen = createScreen({
					id: "doNotGoDeeper",
					subHeaderBox: createHeaderFooter({ type: "header" }),
					footerBox: createHeaderFooter({ type: "footer", withButton: true, stopButton: true }),
					screenElements: [createControlGrid({ id: "cg-1" })]
				});
				strictEqual(new ModelWalker(visitor).acceptScreen(screen), true);
				strictEqual(visitor.visitedElements.length, 1);
			}
		);
	});

	describe("acceptButtonPanel", () => {
		/* full order of traversal:
		 * button panel, button 1, button 2
		 */
		it("traverses all buttons of the button panel", () => {
			const visitor = new TrackingVisitor();
			const buttonPanel = createButtonPanel({
				id: "bp",
				buttons: [createButton("1"), createButton("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptButtonPanel(buttonPanel), true);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitButtonPanel returns STOP", () => {
			const visitor = new TrackingVisitor();
			const buttonPanel = createButtonPanel({
				id: "stop",
				buttons: [createButton("1"), createButton("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptButtonPanel(buttonPanel), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visitButton returns STOP for one of the buttons", () => {
			const visitor = new TrackingVisitor();
			const buttonPanel = createButtonPanel({
				id: "bp",
				buttons: [createButton("stop"), createButton("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptButtonPanel(buttonPanel), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("does not traverse any buttons of the button panel if visitButtonPanel returns ContinueButDoNotGoDeeper", () => {
			const visitor = new TrackingVisitor();
			const buttonPanel = createButtonPanel({
				id: "doNotGoDeeper",
				buttons: [createButton("1"), createButton("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptButtonPanel(buttonPanel), true);
			strictEqual(visitor.visitedElements.length, 1);
		});
	});

	describe("acceptButton", () => {
		it("stops if visitButton returns STOP", () => {
			const visitor: ModelVisitor = {
				visitButton(column: FormModel.ButtonType): VisitProcess {
					return VisitProcess.Stop;
				}
			};
			const returnValue = new ModelWalker(visitor).acceptButton({} as FormModel.ButtonType);
			strictEqual(returnValue, false, "acceptButton should return false");
		});
	});

	describe("acceptControlGrid", () => {
		/* full order of traversal:
		 * control grid, row 1, row 2
		 */
		it("traverses all rows of the control grid", () => {
			const visitor = new TrackingVisitor();
			const controlGrid = createControlGrid({
				id: "cg",
				rows: [createRow({ id: "1" }), createRow({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptControlGrid(controlGrid), true);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitControlGrid returns STOP", () => {
			const visitor = new TrackingVisitor();
			const controlGrid = createControlGrid({
				id: "stop",
				rows: [createRow({ id: "1" }), createRow({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptControlGrid(controlGrid), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visitRow returns STOP for one of the rows", () => {
			const visitor = new TrackingVisitor();
			const controlGrid = createControlGrid({
				id: "cg",
				rows: [createRow({ id: "stop" }), createRow({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptControlGrid(controlGrid), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("does not traverse any rows of the control grid if visitControlGrid returns ContinueButDoNotGoDeeper", () => {
			const visitor = new TrackingVisitor();
			const controlGrid = createControlGrid({
				id: "doNotGoDeeper",
				rows: [createRow({ id: "1" }), createRow({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptControlGrid(controlGrid), true);
			strictEqual(visitor.visitedElements.length, 1);
		});
	});

	describe("acceptRow", () => {
		/* full order of traversal:
		 * row, control 1, control 2
		 */
		it("traverses all cells of the row", () => {
			const visitor = new TrackingVisitor();
			const row = createRow({
				id: "cg",
				cells: [createControl("1"), createControl("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptRow(row), true);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitRow returns STOP", () => {
			const visitor = new TrackingVisitor();
			const row = createRow({
				id: "stop",
				cells: [createControl("1"), createControl("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptRow(row), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visit* returns STOP for one of the cells", () => {
			const visitor = new TrackingVisitor();
			const row = createRow({
				id: "cg",
				cells: [createControl("stop"), createControl("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptRow(row), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("does not traverse any cells of the row if visitRow returns ContinueButDoNotGoDeeper", () => {
			const visitor = new TrackingVisitor();
			const row = createRow({
				id: "doNotGoDeeper",
				cells: [createControl("1"), createControl("2")]
			});
			strictEqual(new ModelWalker(visitor).acceptRow(row), true);
			strictEqual(visitor.visitedElements.length, 1);
		});
	});

	describe("acceptCell", () => {
		it("stops if visitControl returns STOP", () => {
			const visitor: ModelVisitor = {
				visitControl(column: FormModel.Control): VisitProcess {
					return VisitProcess.Stop;
				}
			};
			const mockCell = { type: "Control" } as FormModel.Control;

			const returnValue = new ModelWalker(visitor).acceptCell(mockCell);
			strictEqual(returnValue, false, "acceptCell should return false");
		});

		it("stops if visitExpressionCell returns STOP", () => {
			const visitor: ModelVisitor = {
				visitExpressionCell(column: FormModel.ExpressionCell): VisitProcess {
					return VisitProcess.Stop;
				}
			};
			const mockCell = { type: "ExpressionCell" } as FormModel.ExpressionCell;

			const returnValue = new ModelWalker(visitor).acceptCell(mockCell);
			strictEqual(returnValue, false, "acceptCell should return false");
		});

		it("stops if visitTextCell returns STOP", () => {
			const visitor: ModelVisitor = {
				visitTextCell(column: FormModel.TextCell): VisitProcess {
					return VisitProcess.Stop;
				}
			};
			const mockCell = { type: "TextCell" } as FormModel.TextCell;

			const returnValue = new ModelWalker(visitor).acceptCell(mockCell);
			strictEqual(returnValue, false, "acceptCell should return false");
		});
	});

	describe("acceptDetachedRepeat", () => {
		/* full order of traversal:
		 * detached repeat, column 1, column 2, detail screen
		 */
		it("traverses all overview columns and the detail screen of the detached repeat", () => {
			const visitor = new TrackingVisitor();
			const detachedRepeat = createDetachedRepeat({
				id: "dr",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				detailScreen: createScreen({ id: "ds-1" })
			});
			strictEqual(new ModelWalker(visitor).acceptDetachedRepeat(detachedRepeat), true);
			strictEqual(visitor.visitedElements.length, 4);
		});

		it("stops if visitDetachedRepeat returns STOP", () => {
			const visitor = new TrackingVisitor();
			const detachedRepeat = createDetachedRepeat({
				id: "stop",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				detailScreen: createScreen({ id: "ds-1" })
			});
			strictEqual(new ModelWalker(visitor).acceptDetachedRepeat(detachedRepeat), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visitRepeatOverviewColumn returns STOP for one of the columns", () => {
			const visitor = new TrackingVisitor();
			const detachedRepeat = createDetachedRepeat({
				id: "dr",
				columns: [createFieldColumn({ id: "stop" }), createExpressionColumn({ id: "2" })],
				detailScreen: createScreen({ id: "ds-1" })
			});
			strictEqual(new ModelWalker(visitor).acceptDetachedRepeat(detachedRepeat), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("stops if visitScreen returns STOP for the detail screen", () => {
			const visitor = new TrackingVisitor();
			const detachedRepeat = createDetachedRepeat({
				id: "dr",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				detailScreen: createScreen({ id: "stop" })
			});
			strictEqual(new ModelWalker(visitor).acceptDetachedRepeat(detachedRepeat), false);
			strictEqual(visitor.visitedElements.length, 4);
		});

		it("does not traverse any overview columns or the detail screen if visitDetachedRepeat returns ContinueButDoNotGoDeeper", () => {
			const visitor = new TrackingVisitor();
			const detachedRepeat = createDetachedRepeat({
				id: "doNotGoDeeper",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				detailScreen: createScreen({ id: "ds-1" })
			});
			strictEqual(new ModelWalker(visitor).acceptDetachedRepeat(detachedRepeat), true);
			strictEqual(visitor.visitedElements.length, 1);
		});
	});

	describe("acceptEmbeddedRepeat", () => {
		/* full order of traversal:
		 * embedded repeat, column 1, column 2, detail control grid
		 */
		it("traverses all overview columns and the control grid of the embedded repeat", () => {
			const visitor = new TrackingVisitor();
			const embeddedRepeat = createEmbeddedRepeat({
				id: "er",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				controlGrid: createControlGrid({ id: "cg" })
			});
			strictEqual(new ModelWalker(visitor).acceptEmbeddedRepeat(embeddedRepeat), true);
			strictEqual(visitor.visitedElements.length, 4);
		});

		it("stops if visitEmbeddedRepeat returns STOP", () => {
			const visitor = new TrackingVisitor();
			const embeddedRepeat = createEmbeddedRepeat({
				id: "stop",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				controlGrid: createControlGrid({ id: "cg" })
			});
			strictEqual(new ModelWalker(visitor).acceptEmbeddedRepeat(embeddedRepeat), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visitRepeatOverviewColumn returns STOP for one of the columns", () => {
			const visitor = new TrackingVisitor();
			const embeddedRepeat = createEmbeddedRepeat({
				id: "er",
				columns: [createFieldColumn({ id: "stop" }), createExpressionColumn({ id: "2" })],
				controlGrid: createControlGrid({ id: "cg" })
			});
			strictEqual(new ModelWalker(visitor).acceptEmbeddedRepeat(embeddedRepeat), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("stops if visitControlGrid returns STOP for the control grid", () => {
			const visitor = new TrackingVisitor();
			const embeddedRepeat = createEmbeddedRepeat({
				id: "er",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				controlGrid: createControlGrid({ id: "stop" })
			});
			strictEqual(new ModelWalker(visitor).acceptEmbeddedRepeat(embeddedRepeat), false);
			strictEqual(visitor.visitedElements.length, 4);
		});

		it("does not traverse any overview columns or the detail screen if visitEmbeddedRepeat returns ContinueButDoNotGoDeeper", () => {
			const visitor = new TrackingVisitor();
			const embeddedRepeat = createEmbeddedRepeat({
				id: "doNotGoDeeper",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })],
				controlGrid: createControlGrid({ id: "cg" })
			});
			strictEqual(new ModelWalker(visitor).acceptEmbeddedRepeat(embeddedRepeat), true);
			strictEqual(visitor.visitedElements.length, 1);
		});
	});

	describe("acceptInlineRepeat", () => {
		/* full order of traversal:
		 * inline repeat, column 1, column 2
		 */
		it("traverses all overview columns of the inline repeat", () => {
			const visitor = new TrackingVisitor();
			const inlineRepeat = createInlineRepeat({
				id: "ir",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptInlineRepeat(inlineRepeat), true);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitInlineRepeat returns STOP", () => {
			const visitor = new TrackingVisitor();
			const inlineRepeat = createInlineRepeat({
				id: "stop",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptInlineRepeat(inlineRepeat), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visitRepeatOverviewColumn returns STOP for one of the columns", () => {
			const visitor = new TrackingVisitor();
			const inlineRepeat = createInlineRepeat({
				id: "ir",
				columns: [createFieldColumn({ id: "stop" }), createExpressionColumn({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptInlineRepeat(inlineRepeat), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("does not traverse any overview columns if visitInlineRepeat returns ContinueButDoNotGoDeeper", () => {
			const visitor = new TrackingVisitor();
			const inlineRepeat = createInlineRepeat({
				id: "doNotGoDeeper",
				columns: [createFieldColumn({ id: "1" }), createExpressionColumn({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptInlineRepeat(inlineRepeat), true);
			strictEqual(visitor.visitedElements.length, 1);
		});
	});

	describe("acceptRepeatOverviewColumn", () => {
		it("stops if visitRepeatOverviewColumn returns STOP", () => {
			const visitor: ModelVisitor = {
				visitRepeatOverviewColumn(column: FormModel.RepeatOverviewColumn): VisitProcess {
					return VisitProcess.Stop;
				}
			};

			const returnValue = new ModelWalker(visitor).acceptRepeatOverviewColumn(
				{} as FormModel.RepeatOverviewColumn
			);

			strictEqual(returnValue, false, "acceptRepeatOverviewColumn should return false");
		});
	});

	describe("acceptMultiColumnSection", () => {
		/* full order of traversal:
		 * multi-column section, control grid 1, control grid 2
		 */
		it("traverses all screen elements of the multi-column section", () => {
			const visitor = new TrackingVisitor();
			const section = createMultiColumnSection({
				id: "sec",
				screenElements: [createControlGrid({ id: "1" }), createControlGrid({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptMultiColumnSection(section), true);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitMultiColumnSection returns STOP", () => {
			const visitor = new TrackingVisitor();
			const section = createMultiColumnSection({
				id: "stop",
				screenElements: [createControlGrid({ id: "1" }), createControlGrid({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptMultiColumnSection(section), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visit* returns STOP for one of the screen elements", () => {
			const visitor = new TrackingVisitor();
			const section = createMultiColumnSection({
				id: "sec",
				screenElements: [createControlGrid({ id: "stop" }), createControlGrid({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptMultiColumnSection(section), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it(
			"does not traverse any screen elements of the multi-column section if visitMultiColumnSection returns" +
				" ContinueButDoNotGoDeeper",
			() => {
				const visitor = new TrackingVisitor();
				const section = createMultiColumnSection({
					id: "doNotGoDeeper",
					screenElements: [createControlGrid({ id: "1" }), createControlGrid({ id: "2" })]
				});
				strictEqual(new ModelWalker(visitor).acceptMultiColumnSection(section), true);
				strictEqual(visitor.visitedElements.length, 1);
			}
		);
	});

	describe("acceptSection", () => {
		/* full order of traversal:
		 * section, control grid 1, control grid 2
		 */
		it("traverses all screen elements of the section", () => {
			const visitor = new TrackingVisitor();
			const section = createSection({
				id: "sec",
				screenElements: [createControlGrid({ id: "1" }), createControlGrid({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptSection(section), true);
			strictEqual(visitor.visitedElements.length, 3);
		});

		it("stops if visitSection returns STOP", () => {
			const visitor = new TrackingVisitor();
			const section = createSection({
				id: "stop",
				screenElements: [createControlGrid({ id: "1" }), createControlGrid({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptSection(section), false);
			strictEqual(visitor.visitedElements.length, 1);
		});

		it("stops if visit* returns STOP for one of the screen elements", () => {
			const visitor = new TrackingVisitor();
			const section = createSection({
				id: "sec",
				screenElements: [createControlGrid({ id: "stop" }), createControlGrid({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptSection(section), false);
			strictEqual(visitor.visitedElements.length, 2);
		});

		it("does not traverse any screen elements of the section if visitSection returns ContinueButDoNotGoDeeper", () => {
			const visitor = new TrackingVisitor();
			const section = createSection({
				id: "doNotGoDeeper",
				screenElements: [createControlGrid({ id: "1" }), createControlGrid({ id: "2" })]
			});
			strictEqual(new ModelWalker(visitor).acceptSection(section), true);
			strictEqual(visitor.visitedElements.length, 1);
		});
	});
});

class TrackingVisitor implements ModelVisitor {
	public visitedElements: ModelPath[] = [];
	private formModelPathStack: ModelPath[] = [];

	enter(elementStack: NonEmptyArray<object>): void {
		const currentElementPath = FormModelPath.extend(
			this.formModelPathStack.at(-1) ?? [],
			last(elementStack)
		);
		this.formModelPathStack.push(currentElementPath);
		this.visitedElements.push(currentElementPath);
	}

	leave(): void {
		this.formModelPathStack.pop();
	}

	signalProcess(identifier: string): VisitProcess {
		if (identifier === "stop") {
			return VisitProcess.Stop;
		} else if (identifier === "doNotGoDeeper") {
			return VisitProcess.ContinueButDoNotGoDeeper;
		} else {
			return VisitProcess.ContinueTraversal;
		}
	}

	visitScreen(screen: FormModel.Screen): VisitProcess {
		return this.signalProcess(screen.id);
	}
	visitSection(section: FormModel.Section): VisitProcess {
		return this.signalProcess(section.id);
	}
	visitMultiColumnSection(section: FormModel.MultiColumnSection): VisitProcess {
		return this.signalProcess(section.id);
	}
	visitDetachedRepeat(repeat: FormModel.DetachedRepeat): VisitProcess {
		return this.signalProcess(repeat.id);
	}
	visitControlGrid(grid: FormModel.ControlGrid): VisitProcess {
		return this.signalProcess(grid.id);
	}
	visitRow(row: FormModel.Row): VisitProcess {
		return this.signalProcess(row.id);
	}
	visitControl(control: FormModel.Control): VisitProcess {
		return this.signalProcess(control.id);
	}
	visitTextCell(textCell: FormModel.TextCell): VisitProcess {
		return this.signalProcess(textCell.id);
	}
	visitExpressionCell(exprCell: FormModel.ExpressionCell): VisitProcess {
		return this.signalProcess(exprCell.id);
	}
	visitInlineRepeat(repeat: FormModel.InlineRepeat): VisitProcess {
		return this.signalProcess(repeat.id);
	}
	visitEmbeddedRepeat(repeat: FormModel.EmbeddedRepeat): VisitProcess {
		return this.signalProcess(repeat.id);
	}
	visitRepeatOverviewColumn(repeatColumn: FormModel.RepeatOverviewColumn): VisitProcess {
		return this.signalProcess(repeatColumn.id);
	}
	visitButtonPanel(panel: FormModel.ButtonPanel): VisitProcess {
		return this.signalProcess(panel.id);
	}
	visitButton(button: FormModel.ButtonType): VisitProcess {
		return this.signalProcess(button.id);
	}
	visitSubHeadingBox(header: FormModel.HeaderFooterType): VisitProcess {
		return this.signalProcess(header.id);
	}
	visitFooterBox(footer: FormModel.HeaderFooterType): VisitProcess {
		return this.signalProcess(footer.id);
	}
}
