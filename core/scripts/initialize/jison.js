// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

//@ts-check

import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Resolves the path to the jison directory within the models/internal structure.
 *
 * @param {string} location - The location/subdirectory to append to the base path
 * @returns {string} The resolved absolute path to the jison directory
 */
const jisonDir = location =>
	resolve(import.meta.dirname, "..", "..", location, "models", "internal", "jison");

const JISON_SRC_DIR = jisonDir("src");
const JISON_LIB_DIR = jisonDir("lib");

const TYPING_FILE = "repeatfilter.d.cts";
const GRAMMAR_FILE = "repeatfilter.jison";

mkdirSync(JISON_LIB_DIR, { recursive: true });
copyFileSync(join(JISON_SRC_DIR, TYPING_FILE), join(JISON_LIB_DIR, TYPING_FILE));
execSync(
	`jison --module-type js --outfile ${join(JISON_LIB_DIR, GRAMMAR_FILE.replace(".jison", ".cjs"))} ${join(JISON_SRC_DIR, GRAMMAR_FILE)}`
);
