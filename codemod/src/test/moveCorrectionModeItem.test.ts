// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { join } from "node:path";
import { describe } from "node:test";

import { moveCorrectionModeItemRecipe } from "../recipes/moveCorrectionModeItem.js";

import { testRecipe } from "./testReceipe.js";

describe("codemod.recipes.moveCorrectionModeItem", () => {
	describe("rewrites import for CorrectionModeItem correctly", () => {
		testRecipe(moveCorrectionModeItemRecipe, join("moveCorrectionModeItem", "tsconfig.json"));
	});

	describe("does not rewrite unrelated imports from FE", () => {
		testRecipe(moveCorrectionModeItemRecipe, join("moveCorrectionModeItem", "tsconfig.other.json"));
	});
});
