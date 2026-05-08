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
 * 1. Open-Source License – EUPL v1.2
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

import { ok } from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import semver from "semver";
import { parse } from "yaml";

const REPO_ROOT = join(import.meta.dirname, "..");

// Validate dependencies from pnpm workspace

const yaml = await readFile(join(REPO_ROOT, "pnpm-workspace.yaml"), {
	encoding: "utf-8"
});

const { a12, a12ranges } = parse(yaml).catalogs;

Object.entries(a12ranges).forEach(([name, range]) => {
	const actualVersion = a12[name];

	ok(typeof range === "string");

	if (semver.prerelease(actualVersion)) {
		ok(
			actualVersion === range,
			`${name}@${actualVersion} is a pre-release, the range should exactly match it.`
		);
	} else {
		ok(
			!semver.prerelease(range),
			`${name}@${actualVersion} is a not pre-release, the range must not be one as well`
		);
		ok(
			semver.satisfies(actualVersion, range),
			`${name}@${actualVersion} does not satisfy ${range}!`
		);
	}
});
