// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { join } from "node:path";
import { describe } from "node:test";

import { preferTopLevelImportsRecipe } from "../recipes/preferTopLevel.js";

import { testRecipe } from "./testReceipe.js";

describe("codemod.recipes.preferTopLevel", () => {
	describe("Rewrites import paths correctly", () => {
		testRecipe(preferTopLevelImportsRecipe, join("preferTopLevel", "tsconfig.json"));
	});
});
