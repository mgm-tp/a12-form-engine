// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Identifier, QualifiedName } from "ts-morph";
import { SyntaxKind } from "ts-morph";

import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

const TYPE_ONLY_NAMESPACE = ["FormModelMap", "DispatchConfiguration"];

/**
 * Rewrites type aliases written like this `import X = Namespace.X` into `type X = Namespace.X` if
 * `Namespace` is part of the whitelist above and was imported from A12 Form Engine.
 */
export const rewriteImportEqualDeclarationsRecipe: Recipe = {
	metadata: {
		id: "imports",
		description: "Rewrites certain ImportEqualDeclarations as TypeAliasDeclarations",
		supportedVersions: "^38.0.0"
	},

	execute(project) {
		project.getSourceFiles().forEach(file => {
			file.getDescendantsOfKind(SyntaxKind.ImportEqualsDeclaration).forEach(ied => {
				// get the part to the right of "="
				const qualifiedName = ied.getModuleReference().asKind(SyntaxKind.QualifiedName);

				if (hasMatchingIdentifier(qualifiedName)) {
					// a type alias declaration looks exactly the same, except for the keyword at the beginning,
					// therefore we can just replace text here
					ied.replaceWithText(ied.getFullText().replace(/^\s*import /, "type "));
				}
			});
		});
	}
};

/**
 * A qualifiedName looks like this:
 *
 * `RootNamespace[.OtherNamespace].Something`
 *
 * This function finds the left-most namespace and checks whether it comes from client
 */
function hasMatchingIdentifier(qualifiedName?: QualifiedName): boolean | undefined {
	const left = qualifiedName?.getLeft();

	return left?.isKind(SyntaxKind.Identifier)
		? TYPE_ONLY_NAMESPACE.includes(left.getText()) && isImportedFromFE(left)
		: left?.isKind(SyntaxKind.QualifiedName)
			? hasMatchingIdentifier(left)
			: false;
}

/**
 * By looking at symbol declarations, we can find out whether something was defined in a file directly
 * or imported from somewhere.
 *
 * In the second case, its declaration will be an `ImportSpecifier`.
 * In that case, we can go up the AST and find the corresponding `ImportDeclaration` for it and check its import path.
 *
 * `startsWith` is used to ensure this also works when ESM syntax is used (`ModuleSpecifier` ends with ".js")
 */
function isImportedFromFE(id: Identifier) {
	return id
		.getSymbol()
		?.getDeclarations()
		.at(0)
		?.asKind(SyntaxKind.ImportSpecifier)
		?.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)
		?.getModuleSpecifierValue()
		.startsWith("@com.mgmtp.a12.formengine/formengine-core/lib");
}
