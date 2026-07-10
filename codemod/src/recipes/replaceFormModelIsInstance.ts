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

import type { Identifier, PropertyAccessExpression, SourceFile } from "ts-morph";
import { SyntaxKind } from "ts-morph";

import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

import { addNamedValueImports } from "../utils/addNamedValueImports.js";
import { isImportedFromCore } from "../utils/isImportedFromPackage.js";

/**
 * Mapping of old FormModel.X.isInstance paths to new standalone guard functions.
 * Key: The full path (e.g., "FormModel.Content.isInstance")
 * Value: The new function name (e.g., "isFormModelContent")
 */
const IS_INSTANCE_REPLACEMENTS: Record<string, string> = {
	"FormModel.isInstance": "isFormModel",
	"FormModel.Content.isInstance": "isFormModelContent",
	"FormModel.HeaderFooterType.isInstance": "isFormModelHeaderFooterType",
	"FormModel.Screen.isInstance": "isFormModelScreen",
	"FormModel.ScreenElement.isInstance": "isFormModelScreenElement",
	"FormModel.CustomScreenElement.isInstance": "isFormModelCustomScreenElement",
	"FormModel.Section.isInstance": "isFormModelSection",
	"FormModel.MultiColumnSection.isInstance": "isFormModelMultiColumnSection",
	"FormModel.RowAction.isInstance": "isFormModelRowAction",
	"FormModel.Repeat.isInstance": "isFormModelRepeat",
	"FormModel.DetachedRepeat.isInstance": "isFormModelDetachedRepeat",
	"FormModel.RepeatOverviewColumn.isInstance": "isFormModelRepeatOverviewColumn",
	"FormModel.FieldOverviewColumn.isInstance": "isFormModelFieldOverviewColumn",
	"FormModel.ExpressionOverviewColumn.isInstance": "isFormModelExpressionOverviewColumn",
	"FormModel.InlineRepeat.isInstance": "isFormModelInlineRepeat",
	"FormModel.EmbeddedRepeat.isInstance": "isFormModelEmbeddedRepeat",
	"FormModel.ControlGrid.isInstance": "isFormModelControlGrid",
	"FormModel.Row.isInstance": "isFormModelRow",
	"FormModel.CustomCell.isInstance": "isFormModelCustomCell",
	"FormModel.TextCell.isInstance": "isFormModelTextCell",
	"FormModel.ExpressionCell.isInstance": "isFormModelExpressionCell",
	"FormModel.FieldBasedInputType.isInstance": "isFormModelFieldBasedInputType",
	"FormModel.Control.isInstance": "isFormModelControl",
	"FormModel.ButtonPanel.isInstance": "isFormModelButtonPanel",
	"FormModel.ButtonType.isInstance": "isFormModelButtonType",
	"FormModel.TitledComponent.isInstance": "isFormModelTitledComponent",
	"FormModel.LabeledComponent.isInstance": "isFormModelLabeledComponent",
	"FormModel.ComponentWithDescription.isInstance": "isFormModelComponentWithDescription",
	// ButtonType special methods
	"FormModel.ButtonType.isNavigationButton": "isFormModelNavigationButton",
	"FormModel.ButtonType.isEventButton": "isFormModelEventButton"
};

export const replaceFormModelIsInstanceRecipe: Recipe = {
	metadata: {
		id: "replaceFormModelIsInstance",
		description:
			"Replaces FormModel.X.isInstance() calls with standalone guard functions (e.g., isFormModelX)",
		supportedVersions: "^39.0.0"
	},

	execute(project): void {
		for (const sourceFile of project.getSourceFiles()) {
			const allFunctionNames = replaceAccessExpressions(sourceFile);

			if (allFunctionNames.length > 0) {
				addNamedValueImports(sourceFile, allFunctionNames);
			}
		}
	}
};

function replaceAccessExpressions(sourceFile: SourceFile): string[] {
	return sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression).flatMap(pa => {
		const newFunctionName = getReplacement(pa);

		if (newFunctionName) {
			pa.replaceWithText(newFunctionName);
			return [newFunctionName];
		} else {
			return [];
		}
	});
}

function getReplacement(expression: PropertyAccessExpression): string | undefined {
	// when A.B.C was already replaced, A.B does not exist anymore -> expression becomes "forgotten"
	if (expression.wasForgotten()) {
		return undefined;
	}

	const expressionIdentifier = getLeftMostId(expression);

	return isImportedFromCore(expressionIdentifier)
		? IS_INSTANCE_REPLACEMENTS[expression.getText()]
		: undefined;
}

function getLeftMostId(expression: PropertyAccessExpression): Identifier | undefined {
	const left = expression.getExpression();

	if (left.isKind(SyntaxKind.PropertyAccessExpression)) {
		return getLeftMostId(left);
	} else if (left.isKind(SyntaxKind.Identifier)) {
		return left;
	} else {
		return undefined;
	}
}
