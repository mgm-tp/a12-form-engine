// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { join } from "node:path";
import { describe } from "node:test";

import { rewriteImportEqualDeclarationsRecipe } from "../recipes/rewriteImportEqualDeclarations.js";

import { testRecipe } from "./testReceipe.js";

describe("codemod.recipes.rewriteImportEqualDeclarations", () => {
	describe("Rewrites ImportEqualDeclarations to type aliases correctly", () => {
		testRecipe(
			rewriteImportEqualDeclarationsRecipe,
			join("rewriteImportEqualDeclarations", "tsconfig.json")
		);
	});

	describe("does not rewrite ImportEqualDeclarations that are not explicitly listed or not from FE", () => {
		testRecipe(
			rewriteImportEqualDeclarationsRecipe,
			join("rewriteImportEqualDeclarations", "tsconfig.other.json")
		);
	});
});
