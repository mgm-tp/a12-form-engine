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

import { AssertionError, deepStrictEqual } from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { mock } from "node:test";

import type { MigrationParameters } from "@com.mgmtp.a12.migrationtool/migrationtool-core/types";
import { createMigrationTool } from "@com.mgmtp.a12.migrationtool/migrationtool-core/web";

import { MIGRATION_PARAMETERS } from "../main/config.js";

describe("migration", () => {
	before(() => {
		mock.method(console, "log", () => {});
		mock.method(console, "info", () => {});
	});

	after(() => mock.reset());

	const ROOT_PATH = join(import.meta.dirname, "..", "..");
	const DATA_PATH = join(ROOT_PATH, "testdata", "migration", "steps");

	const paramsForTest: MigrationParameters & { force: boolean; nextOnly: boolean } = {
		...MIGRATION_PARAMETERS,
		// emulate --no-validate-schema by forcing valid schema for all
		migrationSteps: MIGRATION_PARAMETERS.migrationSteps.map(step => ({ ...step, schema: true })),
		// not part of the public type
		force: true,
		nextOnly: true
	};
	const tool = createMigrationTool(paramsForTest);

	const versions = globSync(join(DATA_PATH, "**", "form-model.json").split(sep).join("/")).map(
		modelPath => dirname(relative(DATA_PATH, modelPath))
	);

	for (const version of versions) {
		it(`migrates to version ${version} correctly`, () => {
			const sourceModel = JSON.parse(
				readFileSync(join(DATA_PATH, version, "form-model.json"), "utf8")
			);
			const verifyModel = JSON.parse(
				readFileSync(join(DATA_PATH, version, "form-model-verify.json"), "utf8")
			);

			const [result] = tool.migrate([sourceModel]);
			if (result.status !== "success") {
				throw new AssertionError({
					message: result.status === "error" ? result.errorMessage : result.skipMessage
				});
			}

			// Match the on-disk shape: JSON.stringify drops `key: undefined` entries
			// that some transforms intentionally leave on the in-memory result.
			const migratedModel = JSON.parse(JSON.stringify(result.model));
			deepStrictEqual(migratedModel, verifyModel, version);
		});
	}
});
