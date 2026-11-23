// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { join } from "node:path";
import { it } from "node:test";

import { Project } from "ts-morph";

import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

const TESTDATA_DIR = join(import.meta.dirname, "..", "..", "src", "testData");

/**
 * Tests a codemod recipe against a test project defined by the given tsconfig file.
 *
 * Assumes that the test project is located in the `testData` directory.
 *
 * Changed files are checked against snapshots.
 */
export function testRecipe(recipe: Recipe, tsConfigPath: string): void {
	const project = new Project({
		tsConfigFilePath: join(TESTDATA_DIR, tsConfigPath)
	});
	recipe.execute(project);

	for (const migratedFile of project.getSourceFiles()) {
		it(`should migrate ${migratedFile.getBaseName()} correctly`, ({ assert }) => {
			assert.snapshot(migratedFile.print());
		});
	}
}
