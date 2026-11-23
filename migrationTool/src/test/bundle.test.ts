// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { doesNotThrow, strictEqual } from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, lstatSync } from "node:fs";
import { resolve } from "node:path";

import pkg from "../../package.json" with { type: "json" };

describe("bundle", () => {
	const projectDir = resolve(import.meta.dirname, "..", "..");

	it("contains a bin property which refers to an existing file that can be executed", () => {
		strictEqual(typeof pkg.bin, "string", "There should be one script path in bin");

		const executableScriptPath = resolve(projectDir, pkg.bin);
		strictEqual(existsSync(executableScriptPath), true, "The script should exist.");

		const executableScriptFileStats = lstatSync(executableScriptPath);
		strictEqual(
			executableScriptFileStats.isFile(),
			true,
			"The referenced script should be a file."
		);

		doesNotThrow(() => {
			execSync(`node ${executableScriptPath} -h`);
		}, "Executing the script with the -h flag should print a help message");
	});
});
