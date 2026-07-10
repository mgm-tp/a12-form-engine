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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Expression } from "@com.mgmtp.a12.expression/expression-core";
import { ExpressionBuilder } from "@com.mgmtp.a12.expression/expression-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { Mutable } from "../../../back-end/utils/internal/types.js";
import {
	isFormModelDetachedRepeat,
	isFormModelEmbeddedRepeat,
	isFormModelRepeat
} from "../../../models/internal/FormModelGuards.js";

import type { FormModel } from "../form-model.js";
import * as RepeatExpressionFilter from "../jison/repeatfilter.cjs";
import { computeGranularity } from "../utils/document-model-utils.js";
import { ModelWalker } from "../utils/form-model-walker.js";
import type { ModelVisitor, VisitProcess } from "../utils/form-model-walker.js";

import type { ValueParser } from "./unmarshallFormModel.js";

class Visitor implements ModelVisitor {
	private elementStack: object[] = [];
	private readonly valueParser: ValueParser;
	private readonly documentModel: DocumentModel;

	constructor(valueParser: ValueParser, documentModel: DocumentModel) {
		this.valueParser = valueParser;
		this.documentModel = documentModel;
	}

	getDetachedRepeatDataContext(): ModelPath {
		// the element stack is shortened by the last element since it can never be the DR that sets
		// the data context for an element
		// even for DR themselves, the data context is given by their last ancestor DR (or the root)
		return (
			[...this.elementStack.slice(0, -1)].reverse().find(isFormModelDetachedRepeat)?.groupPath ?? []
		);
	}

	getDetachedOrEmbeddedRepeatDataContext(): ModelPath {
		return (
			[...this.elementStack]
				.reverse()
				.find(element => isFormModelDetachedRepeat(element) || isFormModelEmbeddedRepeat(element))
				?.groupPath ?? []
		);
	}

	enter(path: object[]): void {
		this.elementStack = path;
	}

	visitContent(content: Mutable<FormModel.Content>): VisitProcess {
		if (content.subtitle?.type === "Expression") {
			content.subtitle = this.parseLabel(content.subtitle);
		}
		return "ContinueTraversal";
	}

	visitControlGrid(grid: Mutable<FormModel.ControlGrid>): VisitProcess {
		if (grid.title?.type === "Expression") {
			const dataContext = this.getDetachedOrEmbeddedRepeatDataContext();
			grid.title = this.parseLabel(grid.title, dataContext);
		}
		return "ContinueTraversal";
	}

	visitButton(button: Mutable<FormModel.ButtonType>): VisitProcess {
		if (button.buttonStyling?.label?.type === "Expression") {
			const dataContext = this.getDetachedRepeatDataContext();
			const newButtonStyling = button.buttonStyling as Mutable<FormModel.ButtonStyling>;
			newButtonStyling.label = this.parseLabel(button.buttonStyling.label, dataContext);
			button.buttonStyling = newButtonStyling;
		}
		return "ContinueTraversal";
	}

	visitButtonPanel(panel: Mutable<FormModel.ButtonPanel>): VisitProcess {
		if (panel.title?.type === "Expression") {
			const dataContext = this.getDetachedRepeatDataContext();
			panel.title = this.parseLabel(panel.title, dataContext);
		}
		return "ContinueTraversal";
	}

	visitControl(control: Mutable<FormModel.Control>): VisitProcess {
		if (control.label?.type === "Expression") {
			const dataContext = computeGranularity(this.documentModel, control.elementPath);
			control.label = this.parseLabel(control.label, dataContext);
		}
		return "ContinueTraversal";
	}

	visitMultiColumnSection(section: Mutable<FormModel.MultiColumnSection>): VisitProcess {
		if (section.title?.type === "Expression") {
			const dataContext = this.getDetachedRepeatDataContext();
			section.title = this.parseLabel(section.title, dataContext);
		}
		return "ContinueTraversal";
	}

	visitSection(section: Mutable<FormModel.Section>): VisitProcess {
		if (section.title?.type === "Expression") {
			const dataContext = this.getDetachedRepeatDataContext();
			section.title = this.parseLabel(section.title, dataContext);
		}
		return "ContinueTraversal";
	}

	visitCustomScreenElement(
		customScreenElement: Mutable<FormModel.CustomScreenElement>
	): VisitProcess {
		if (customScreenElement.title?.type === "Expression") {
			const dataContext = this.getDetachedRepeatDataContext();
			customScreenElement.title = this.parseLabel(customScreenElement.title, dataContext);
		}
		return "ContinueTraversal";
	}

	visitRow(row: Mutable<FormModel.Row>): VisitProcess {
		if (row.title?.type === "Expression") {
			const dataContext = this.getDetachedOrEmbeddedRepeatDataContext();
			row.title = this.parseLabel(row.title, dataContext);
		}
		return "ContinueTraversal";
	}

	visitScreen(screen: Mutable<FormModel.Screen>): VisitProcess {
		if (screen.title?.type === "Expression") {
			const dataContext = this.getDetachedRepeatDataContext();
			screen.title = this.parseLabel(screen.title, dataContext);
		}
		return "ContinueTraversal";
	}

	visitFieldConfigurationEntry(fce: Mutable<FormModel.FieldConfigurationEntry>): VisitProcess {
		if (fce.label?.type === "Expression") {
			const groupPath = computeGranularity(this.documentModel, fce.elementPath);
			fce.label = this.parseLabel(fce.label, groupPath);
		}
		return "ContinueButDoNotGoDeeper";
	}

	visitRowAction(action: Mutable<FormModel.RowAction>): VisitProcess {
		if (
			action.buttonStyling?.label?.type === "Expression" &&
			action.buttonStyling?.label?.expressionText
		) {
			const repeat = this.elementStack[this.elementStack.length - 1];
			if (!isFormModelRepeat(repeat)) {
				throw new Error("Missing parent repeat of overview column");
			}

			const expressionTree = this.parseExpression(
				action.buttonStyling.label.expressionText,
				repeat.groupPath
			);
			const newLabel = {
				...action.buttonStyling.label,
				expressionTree
			};
			const newButtonStyling = action.buttonStyling as Mutable<FormModel.ButtonStyling>;
			newButtonStyling.label = newLabel;
			action.buttonStyling = newButtonStyling;
		}
		return "ContinueTraversal";
	}

	visitRepeatOverviewColumn(overviewColumn: Mutable<FormModel.RepeatOverviewColumn>): VisitProcess {
		if (overviewColumn.type === "ExpressionRepeatOverviewColumn") {
			const repeat = this.elementStack[this.elementStack.length - 2];
			if (!isFormModelRepeat(repeat)) {
				throw new Error("Missing parent repeat of overview column");
			}

			const expressionTree = this.parseExpression(overviewColumn.expression, repeat.groupPath);
			overviewColumn.expressionTree = expressionTree;
		}

		if (overviewColumn.label?.type === "Expression" && overviewColumn.label?.expressionText) {
			// here we slice the stack in order to skip the repeat that contains this column in the search for the data context
			const dataContext =
				[...this.elementStack.slice(0, -2)].reverse().find(isFormModelDetachedRepeat)?.groupPath ??
				[];

			const expressionTree = this.parseExpression(overviewColumn.label.expressionText, dataContext);
			overviewColumn.label = {
				...overviewColumn.label,
				expressionTree
			};
		}

		return "ContinueTraversal";
	}

	visitExpressionCell(expressionCell: Mutable<FormModel.ExpressionCell>): VisitProcess {
		const dataContext = this.getDetachedOrEmbeddedRepeatDataContext();

		expressionCell.expressionTree = this.parseExpression(expressionCell.expression, dataContext);

		if (expressionCell.label?.type === "Expression") {
			expressionCell.label = this.parseLabel(expressionCell.label, dataContext);
		}

		return "ContinueTraversal";
	}

	visitDetachedRepeat(repeat: Mutable<FormModel.DetachedRepeat>): VisitProcess {
		repeat.filterExpressionTree = this.parseFilterExpression(repeat);

		if (repeat.title?.type === "Expression" && repeat.title?.expressionText) {
			const dataContext = this.getDetachedRepeatDataContext();
			repeat.title = {
				...repeat.title,
				expressionTree: this.parseExpression(repeat.title.expressionText, dataContext)
			};
		}

		return "ContinueTraversal";
	}

	visitInlineRepeat(repeat: Mutable<FormModel.InlineRepeat>): VisitProcess {
		repeat.filterExpressionTree = this.parseFilterExpression(repeat);

		if (repeat.title?.type === "Expression" && repeat.title?.expressionText) {
			const dataContext = this.getDetachedRepeatDataContext();
			repeat.title = {
				...repeat.title,
				expressionTree: this.parseExpression(repeat.title.expressionText, dataContext)
			};
		}

		return "ContinueTraversal";
	}

	visitEmbeddedRepeat(repeat: Mutable<FormModel.EmbeddedRepeat>): VisitProcess {
		repeat.filterExpressionTree = this.parseFilterExpression(repeat);

		if (repeat.title?.type === "Expression" && repeat.title?.expressionText) {
			const dataContext = this.getDetachedRepeatDataContext();
			repeat.title = {
				...repeat.title,
				expressionTree: this.parseExpression(repeat.title.expressionText, dataContext)
			};
		}

		return "ContinueTraversal";
	}

	private parseLabel(
		label: FormModel.ExpressionLabel,
		groupPath?: ModelPath
	): FormModel.ExpressionLabel {
		if (label.expressionText) {
			return {
				...label,
				expressionTree: this.parseExpression(label.expressionText, groupPath)
			};
		}
		return label;
	}

	private parseFilterExpression(
		repeat: FormModel.Repeat
	): RepeatExpressionFilter.ParsedFilterNode | undefined {
		if (repeat.filterExpression === undefined) {
			return undefined;
		}
		try {
			const expression = RepeatExpressionFilter.parse(repeat.filterExpression);
			const fieldPath = repeat.groupPath.concat(
				this.findFilterExpressionPath(expression.context, [])
			);
			return {
				...expression,
				content: this.valueParser(fieldPath, expression.content)
			};
		} catch (e) {
			const errorMessage = e instanceof Error ? `\n${e.message}` : "";
			throw new Error(
				`Filter expression is not parsable:\n${repeat.filterExpression}${errorMessage}`,
				{ cause: e }
			);
		}
	}

	private findFilterExpressionPath(
		node: RepeatExpressionFilter.Node,
		parentPath: ModelPath
	): ModelPath {
		if (node.type === "field" || node.type === "group") {
			const elementPath = [...parentPath, { elementName: node.name }];
			return node.type === "field"
				? elementPath
				: this.findFilterExpressionPath(node.context, elementPath);
		} else {
			throw new Error("unknown node type " + node.type);
		}
	}

	private parseExpression(
		expressionText: string,
		rootPath: ModelPath | undefined
	): Expression.RootNode {
		return ExpressionBuilder.build(expressionText, {
			rootPath: rootPath ?? [],
			valueParser: this.valueParser
		});
	}
}

export function parseExpressions(
	formModel: FormModel,
	valueParser: ValueParser,
	documentModel: DocumentModel
): void {
	new ModelWalker(new Visitor(valueParser, documentModel)).acceptModel(formModel);
}
