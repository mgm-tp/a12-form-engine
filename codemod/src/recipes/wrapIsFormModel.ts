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

import type { Identifier, SourceFile } from "ts-morph";
import { Node, SyntaxKind } from "ts-morph";

import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

import { isImportedFromCore } from "../utils/isImportedFromPackage.js";

const TARGET_FUNCTION = "isFormModel";

/**
 * Array methods that pass index as second argument to callbacks.
 */
const ARRAY_METHODS_WITH_INDEX = new Set([
	"find",
	"findIndex",
	"filter",
	"some",
	"every",
	"map",
	"forEach",
	"flatMap"
]);

export const wrapIsFormModelRecipe: Recipe = {
	metadata: {
		id: "wrapIsFormModel",
		description:
			"Wraps isFormModel passed directly to array methods in arrow functions to avoid parameter conflicts",
		supportedVersions: "^39.0.0"
	},

	execute(project): void {
		for (const sourceFile of project.getSourceFiles()) {
			const replacements = collectReplacements(sourceFile);

			// Perform replacements in reverse order to preserve positions
			for (const { identifier, wrappedText } of replacements.reverse()) {
				identifier.replaceWithText(wrappedText);
			}
		}
	}
};

interface ReplacementInfo {
	identifier: Identifier;
	wrappedText: string;
}

/**
 * Collects all isFormModel references that are passed directly as callbacks
 * to array methods and need to be wrapped.
 */
function collectReplacements(sourceFile: SourceFile): ReplacementInfo[] {
	const replacements: ReplacementInfo[] = [];

	const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier);

	for (const identifier of identifiers) {
		const functionName = identifier.getText();

		if (functionName !== TARGET_FUNCTION || !isImportedFromCore(identifier)) {
			continue;
		}

		// Check if this identifier is an argument to an array method call
		const parent = identifier.getParent();

		// Skip if this is part of a call expression (already being called with arguments)
		if (Node.isCallExpression(parent) && parent.getExpression() === identifier) {
			continue;
		}

		// Skip if this is a property access expression like obj.isFormModel
		if (Node.isPropertyAccessExpression(parent)) {
			continue;
		}

		// Check if the identifier is an argument in a call expression
		const callExpression = identifier.getFirstAncestorByKind(SyntaxKind.CallExpression);
		if (!callExpression) {
			continue;
		}

		// Check if the identifier is a direct argument (not nested deeper)
		const args = callExpression.getArguments();
		const isDirectArgument = args.some(arg => arg === identifier);
		if (!isDirectArgument) {
			continue;
		}

		// Check if the call expression is an array method
		const callee = callExpression.getExpression();
		if (!Node.isPropertyAccessExpression(callee)) {
			continue;
		}

		const methodName = callee.getName();
		if (!ARRAY_METHODS_WITH_INDEX.has(methodName)) {
			continue;
		}

		// isFormModel passed directly to an array method - wrap it
		const wrappedText = `v => ${TARGET_FUNCTION}(v)`;
		replacements.push({ identifier, wrappedText });
	}

	return replacements;
}
