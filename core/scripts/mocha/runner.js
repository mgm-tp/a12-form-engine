#!/usr/bin/env node
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

/* eslint-disable no-console */

import "./environment.js";

import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { globSync } from "glob";
import Mocha from "mocha";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

// eslint-disable-next-line no-restricted-imports
import { mochaHooks } from "../../lib/test/utils/hooks.js";

import { heapSnapshot } from "../debug/heapsnapshot.js";

const CORE_DIR = join(import.meta.dirname, "..", "..");

const { default: config } = await import(pathToFileURL(join(CORE_DIR, ".mocharc.json")), {
	with: { type: "json" }
});

const yArguments = yargs(hideBin(process.argv))
	.usage("$0 -i <test file inclusion glob pattern> [<options>]")
	.example(
		'$0 -i "./lib/test/**/*.@(spec|test).js" -e "./lib/test/api/view/repeat/**/*.@(spec|test).js" -r ./.mocha-reporter'
	)
	.command("include", "inclusion glob pattern")
	.alias("i", "include")
	.nargs("i", 1)
	.demandOption(["i"])
	.command("exclude", "exclusion glob pattern")
	.alias("e", "exclude")
	.nargs("e", 1)
	.command("reporter", "mocha reporter config file")
	.alias("r", "reporter")
	.nargs("r", 1)
	.command("allowOnly", 'allow "only"')
	.alias("ao", "allowOnly")
	.boolean("allowOnly")
	.command("timeout", "timeout")
	.command("outputScriptNames", "output the name of each script before executing it")
	.alias("o", "outputScriptNames")
	.boolean("outputScriptNames")
	.command("takeHeapSnapshots", "periodically generate heap snapshots")
	.alias("hs", "takeHeapSnapshots")
	.boolean("takeHeapSnapshots")
	.help("h")
	.parse();

// create patterns containing forward slash also on windows
const includePattern = join(CORE_DIR, yArguments.include).replace(/\\/g, "/");
const excludePattern = yArguments.exclude && join(CORE_DIR, yArguments.exclude).replace(/\\/g, "/");

const reporterOptionsPath = yArguments.reporter ?? ".mocha-reporter.json";
const { default: reporterOption } = await import(
	pathToFileURL(join(CORE_DIR, reporterOptionsPath)),
	{
		with: { type: "json" }
	}
);

const files = globSync(includePattern, excludePattern ? { ignore: excludePattern } : undefined);

const mocha = new Mocha({
	...config,
	forbidOnly: !yArguments.allowOnly,
	timeout: yArguments.timeout ?? config.timeout,
	spec: [], // We set the spec to an empty array because we add the files later
	reporterOption
});

// mocharc require is only used by mocha CLI, we have to do it ourselves here
mocha.rootHooks(mochaHooks);

files.forEach(y => mocha.addFile(y));

if (yArguments.takeHeapSnapshots) {
	takeHeapSnapshotPeriodically();
}

if (yArguments.outputScriptNames) {
	console.log("running: " + files);
}

mocha.run(failures => {
	if (global.gc) {
		console.log("running gc");
		global.gc();
	}
	const heapUsed = process.memoryUsage().heapUsed / 1024 / 1024;
	console.log(`heap usage at end: ${heapUsed.toFixed(1)} MB`);
	process.exit(failures ? 1 : 0);
});

function takeHeapSnapshotPeriodically() {
	setInterval(heapSnapshot, 10 * 1000);
}
