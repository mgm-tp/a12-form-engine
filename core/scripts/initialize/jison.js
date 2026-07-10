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
