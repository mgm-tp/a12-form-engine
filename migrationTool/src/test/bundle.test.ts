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
