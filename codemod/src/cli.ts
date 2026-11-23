#!/usr/bin/env node
// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createCodemodCLI } from "@com.mgmtp.a12.devtools/codemod";

import pkg from "../package.json" with { type: "json" };

import { moveCorrectionModeItemRecipe } from "./recipes/moveCorrectionModeItem.js";
import { preferTopLevelImportsRecipe } from "./recipes/preferTopLevel.js";
import { rewriteImportEqualDeclarationsRecipe } from "./recipes/rewriteImportEqualDeclarations.js";

createCodemodCLI({
	name: pkg.name,
	description: "Codemod tooling for assisting migrations of A12 Form Engine",
	version: pkg.version,
	recipes: [
		preferTopLevelImportsRecipe,
		rewriteImportEqualDeclarationsRecipe,
		moveCorrectionModeItemRecipe
	]
});
