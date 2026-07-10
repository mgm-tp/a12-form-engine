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

import type { NonEmptyArray } from "fp-ts/lib/NonEmptyArray.js";

import {
	isFormModel,
	isFormModelButtonPanel,
	isFormModelButtonType,
	isFormModelContent,
	isFormModelControl,
	isFormModelControlGrid,
	isFormModelDetachedRepeat,
	isFormModelEmbeddedRepeat,
	isFormModelExpressionCell,
	isFormModelHeaderFooterType,
	isFormModelInlineRepeat,
	isFormModelMultiColumnSection,
	isFormModelRepeatOverviewColumn,
	isFormModelRow,
	isFormModelScreen,
	isFormModelSection,
	isFormModelTextCell
} from "../../../models/internal/FormModelGuards.js";

import type { FormModel } from "../form-model.js";

/**
 * @internal
 *
 * Visitor for Form Models for usage with a {@link ModelWalker}.
 * There is one visit function for each Form Model element type.
 *
 * The enter and leave functions provide access to the path of the visited
 * elements. There is no common base type, therefore object is used.
 */
export interface ModelVisitor {
	visitContent?(content: FormModel.Content): VisitProcess;
	visitScreen?(screen: FormModel.Screen): VisitProcess;
	visitSection?(section: FormModel.Section): VisitProcess;
	visitMultiColumnSection?(section: FormModel.MultiColumnSection): VisitProcess;
	visitDetachedRepeat?(repeat: FormModel.DetachedRepeat): VisitProcess;
	visitControlGrid?(grid: FormModel.ControlGrid): VisitProcess;
	visitRow?(row: FormModel.Row): VisitProcess;
	visitControl?(control: FormModel.Control): VisitProcess;
	visitTextCell?(textCell: FormModel.TextCell): VisitProcess;
	visitCustomCell?(customCell: FormModel.CustomCell): VisitProcess;
	visitExpressionCell?(exprCell: FormModel.ExpressionCell): VisitProcess;
	visitInlineRepeat?(repeat: FormModel.InlineRepeat): VisitProcess;
	visitEmbeddedRepeat?(repeat: FormModel.EmbeddedRepeat): VisitProcess;
	visitRepeatOverviewColumn?(repeatColumn: FormModel.RepeatOverviewColumn): VisitProcess;
	visitRowAction?(action: FormModel.RowAction): VisitProcess;
	visitButtonPanel?(panel: FormModel.ButtonPanel): VisitProcess;
	visitButton?(button: FormModel.ButtonType): VisitProcess;
	visitSubHeadingBox?(header: FormModel.HeaderFooterType): VisitProcess;
	visitFooterBox?(footer: FormModel.HeaderFooterType): VisitProcess;
	visitFieldConfigurationEntry?(fce: FormModel.FieldConfigurationEntry): VisitProcess;
	visitCustomScreenElement?(customScreenElement: FormModel.CustomScreenElement): VisitProcess;
	enter?(elementStack: NonEmptyArray<object>): void;
	leave?(): void;
}

/** @internal */
export type VisitProcess = "ContinueTraversal" | "ContinueButDoNotGoDeeper" | "Stop";

/**
 * @internal
 *
 * A walker for the Form Model. You need to pass a `Visitor` and call
 * one of the accept methods to start the iteration.
 *
 * The walker will them iterate the model, starting with the given element,
 * and call the respective visitor functions. Note that the visitor function
 * will not be called for the passed element itself.
 */
export class ModelWalker {
	private path: object[] = [];
	private visitor: ModelVisitor;
	constructor(visitor: ModelVisitor) {
		this.visitor = visitor;
	}

	acceptGeneric(formModelElement: object): void {
		if (isFormModel(formModelElement)) {
			this.acceptModel(formModelElement);
		} else if (isFormModelContent(formModelElement)) {
			this.acceptContent(formModelElement);
		} else if (isFormModelHeaderFooterType(formModelElement)) {
			this.acceptHeaderFooter(formModelElement);
		} else if (isFormModelScreen(formModelElement)) {
			this.acceptScreen(formModelElement);
		} else if (isFormModelButtonType(formModelElement)) {
			this.acceptButton(formModelElement);
		} else if (isFormModelButtonPanel(formModelElement)) {
			this.acceptButtonPanel(formModelElement);
		} else if (isFormModelSection(formModelElement)) {
			this.acceptSection(formModelElement);
		} else if (isFormModelMultiColumnSection(formModelElement)) {
			this.acceptMultiColumnSection(formModelElement);
		} else if (isFormModelControlGrid(formModelElement)) {
			this.acceptControlGrid(formModelElement);
		} else if (isFormModelRow(formModelElement)) {
			this.acceptRow(formModelElement);
		} else if (isFormModelInlineRepeat(formModelElement)) {
			this.acceptInlineRepeat(formModelElement);
		} else if (isFormModelDetachedRepeat(formModelElement)) {
			this.acceptDetachedRepeat(formModelElement);
		} else if (isFormModelEmbeddedRepeat(formModelElement)) {
			this.acceptEmbeddedRepeat(formModelElement);
		} else if (isFormModelRepeatOverviewColumn(formModelElement)) {
			this.acceptRepeatOverviewColumn(formModelElement);
		} else if (
			isFormModelExpressionCell(formModelElement) ||
			isFormModelTextCell(formModelElement) ||
			isFormModelControl(formModelElement)
		) {
			this.acceptCell(formModelElement);
		}
	}

	acceptModel(model: FormModel): void {
		this.acceptContent(model.content);
	}

	acceptContent(content: FormModel.Content): void {
		if (this.visitor.visitContent) {
			try {
				if ("Stop" === this.visitor.visitContent(content)) {
					return;
				}
				// eslint-disable-next-line no-empty
			} finally {
			}
		}

		for (const screen of content.screens) {
			if (!this.acceptScreen(screen)) {
				return;
			}
		}

		if (content.fieldConfiguration.field) {
			for (const fce of content.fieldConfiguration.field) {
				if (!this.acceptFieldConfigurationEntry(fce)) {
					return;
				}
			}
		}

		if (!this.acceptHeaderFooter(content.subHeaderBox)) {
			return;
		}

		this.acceptHeaderFooter(content.footerBox);
	}

	acceptHeaderFooter(headerFooter: FormModel.HeaderFooterType): boolean {
		this.enter(headerFooter);
		try {
			const processButtonsList = (list?: FormModel.ButtonList) => {
				if (list) {
					if (list.button) {
						for (const button of list.button) {
							if (!this.acceptButton(button)) {
								return false;
							}
						}
					}
				}
				return true;
			};
			return (
				processButtonsList(headerFooter.majorButtons) &&
				processButtonsList(headerFooter.minorButtons)
			);
		} finally {
			this.leave();
		}
	}

	acceptFieldConfigurationEntry(fce: FormModel.FieldConfigurationEntry): boolean {
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitFieldConfigurationEntry) {
				process = this.visitor.visitFieldConfigurationEntry(fce);
			}
			return "Stop" !== process;
			// eslint-disable-next-line no-empty
		} finally {
		}
	}

	enter(formModelElement: object): void {
		this.path.push(formModelElement);

		this.visitor.enter?.(this.path as NonEmptyArray<object>);
	}

	leave(): void {
		this.path.pop();
		this.visitor.leave?.();
	}

	acceptScreen(screen: FormModel.Screen): boolean {
		this.enter(screen);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitScreen) {
				process = this.visitor.visitScreen(screen);
			}
			if ("ContinueTraversal" === process) {
				if (screen.subHeaderBox !== undefined) {
					if (!this.acceptHeaderFooter(screen.subHeaderBox)) {
						process = "Stop";
					}
				}
				if ("ContinueTraversal" === process) {
					for (const screenElement of screen.screenElements) {
						if (!this.acceptScreenElement(screenElement)) {
							process = "Stop";
							break;
						}
					}
				}
				if ("ContinueTraversal" === process) {
					if (screen.footerBox !== undefined) {
						if (!this.acceptHeaderFooter(screen.footerBox)) {
							process = "Stop";
						}
					}
				}
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptScreenElement(se: FormModel.ScreenElement): boolean {
		switch (se.type) {
			case "ButtonPanel":
				return this.acceptButtonPanel(se);
				break;
			case "ControlGrid":
				return this.acceptControlGrid(se);
				break;
			case "DetachedRepeat":
				return this.acceptDetachedRepeat(se);
				break;
			case "InlineRepeat":
				return this.acceptInlineRepeat(se);
				break;
			case "EmbeddedRepeat":
				return this.acceptEmbeddedRepeat(se);
				break;
			case "MultiColumnSection":
				return this.acceptMultiColumnSection(se);
				break;
			case "Section":
				return this.acceptSection(se);
				break;
			case "CustomScreenElement":
				return this.acceptCustomScreenElement(se);
				break;
			default:
				throw new Error();
		}
	}

	acceptButtonPanel(panel: FormModel.ButtonPanel): boolean {
		this.enter(panel);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitButtonPanel) {
				process = this.visitor.visitButtonPanel(panel);
			}
			const buttons = panel.button;
			if ("ContinueTraversal" === process && buttons) {
				for (const button of buttons) {
					if (!this.acceptButton(button)) {
						process = "Stop";
						break;
					}
				}
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptButton(button: FormModel.ButtonType): boolean {
		this.enter(button);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitButton) {
				process = this.visitor.visitButton(button);
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptControlGrid(grid: FormModel.ControlGrid): boolean {
		this.enter(grid);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitControlGrid) {
				process = this.visitor.visitControlGrid(grid);
			}
			const rows = grid.row;
			if ("ContinueTraversal" === process && rows) {
				for (const row of rows) {
					if (!this.acceptRow(row)) {
						process = "Stop";
						break;
					}
				}
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptRow(row: FormModel.Row): boolean {
		this.enter(row);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitRow) {
				process = this.visitor.visitRow(row);
			}
			const cells = row.cell;
			if ("ContinueTraversal" === process && cells) {
				for (const cell of cells) {
					if (!this.acceptCell(cell)) {
						process = "Stop";
						break;
					}
				}
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptCell(cell: FormModel.CellType): boolean {
		this.enter(cell);

		try {
			switch (cell.type) {
				case "Control":
					return (
						this.visitor.visitControl === undefined || this.visitor.visitControl(cell) !== "Stop"
					);
				case "ExpressionCell":
					return (
						this.visitor.visitExpressionCell === undefined ||
						this.visitor.visitExpressionCell(cell) !== "Stop"
					);
				case "TextCell":
					return (
						this.visitor.visitTextCell === undefined || this.visitor.visitTextCell(cell) !== "Stop"
					);
				case "CustomCell":
					return (
						this.visitor.visitCustomCell === undefined ||
						this.visitor.visitCustomCell(cell) !== "Stop"
					);
				default:
					throw new Error();
			}
		} finally {
			this.leave();
		}
	}

	acceptDetachedRepeat(repeat: FormModel.DetachedRepeat): boolean {
		this.enter(repeat);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitDetachedRepeat) {
				process = this.visitor.visitDetachedRepeat(repeat);
			}
			const columns = repeat.repeatOverviewColumn;
			if ("ContinueTraversal" === process && columns) {
				for (const c of columns) {
					if (!this.acceptRepeatOverviewColumn(c)) {
						process = "Stop";
						break;
					}
				}
			}
			const rowActions = repeat.rowActionGroup?.action;
			if ("ContinueTraversal" === process && rowActions) {
				for (const r of rowActions) {
					if (!this.acceptRowAction(r)) {
						process = "Stop";
						break;
					}
				}
			}
			if ("ContinueTraversal" === process) {
				process = this.acceptScreen(repeat.detailScreen as FormModel.Screen) ? process : "Stop";
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptRepeatOverviewColumn(column: FormModel.RepeatOverviewColumn): boolean {
		this.enter(column);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitRepeatOverviewColumn) {
				process = this.visitor.visitRepeatOverviewColumn(column);
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptRowAction(action: FormModel.RowAction): boolean {
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitRowAction) {
				process = this.visitor.visitRowAction(action);
			}
			return "Stop" !== process;
			// eslint-disable-next-line no-empty
		} finally {
		}
	}

	acceptInlineRepeat(repeat: FormModel.InlineRepeat): boolean {
		this.enter(repeat);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitInlineRepeat) {
				process = this.visitor.visitInlineRepeat(repeat);
			}
			const columns = repeat.repeatOverviewColumn;
			if ("ContinueTraversal" === process && columns) {
				for (const c of columns) {
					if (!this.acceptRepeatOverviewColumn(c)) {
						process = "Stop";
						break;
					}
				}
			}
			const rowActions = repeat.rowActionGroup?.action;
			if ("ContinueTraversal" === process && rowActions) {
				for (const r of rowActions) {
					if (!this.acceptRowAction(r)) {
						process = "Stop";
						break;
					}
				}
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptEmbeddedRepeat(repeat: FormModel.EmbeddedRepeat): boolean {
		this.enter(repeat);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitEmbeddedRepeat) {
				process = this.visitor.visitEmbeddedRepeat(repeat);
			}
			const columns = repeat.repeatOverviewColumn;
			if ("ContinueTraversal" === process && columns) {
				for (const c of columns) {
					if (!this.acceptRepeatOverviewColumn(c)) {
						process = "Stop";
						break;
					}
				}
			}
			const rowActions = repeat.rowActionGroup?.action;
			if ("ContinueTraversal" === process && rowActions) {
				for (const r of rowActions) {
					if (!this.acceptRowAction(r)) {
						process = "Stop";
						break;
					}
				}
			}
			if ("ContinueTraversal" === process) {
				process = this.acceptControlGrid(repeat.controlGrid) ? process : "Stop";
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptMultiColumnSection(section: FormModel.MultiColumnSection): boolean {
		this.enter(section);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitMultiColumnSection) {
				process = this.visitor.visitMultiColumnSection(section);
			}
			const elements = section.screenElements;
			if ("ContinueTraversal" === process && elements) {
				for (const se of elements) {
					if (!this.acceptScreenElement(se)) {
						process = "Stop";
						break;
					}
				}
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptSection(section: FormModel.Section): boolean {
		this.enter(section);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitSection) {
				process = this.visitor.visitSection(section);
			}
			const elements = section.screenElements;
			if ("ContinueTraversal" === process && elements) {
				for (const se of elements) {
					if (!this.acceptScreenElement(se)) {
						process = "Stop";
						break;
					}
				}
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}

	acceptCustomScreenElement(customScreenElement: FormModel.CustomScreenElement): boolean {
		this.enter(customScreenElement);
		let process = "ContinueTraversal";
		try {
			if (this.visitor.visitCustomScreenElement) {
				process = this.visitor.visitCustomScreenElement(customScreenElement);
			}
			return "Stop" !== process;
		} finally {
			this.leave();
		}
	}
}
