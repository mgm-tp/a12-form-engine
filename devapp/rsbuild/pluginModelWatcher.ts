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

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { platform } from "node:process";
import { createInterface } from "node:readline";

import type { RsbuildPlugin } from "@rsbuild/core";
import pc from "picocolors";

const SUCCESS = /^(BUILD SUCCESSFUL)/;
const INFO = /^(Change detected|new file:|modified:|deleted:)/;

/* eslint-disable no-console */
const success = (msg: string) =>
	console.log(`${pc.bold(pc.greenBright("[model-watcher]"))} ${msg}`);
const info = (msg: string) => console.log(`${pc.bold(pc.cyanBright("[model-watcher]"))} ${msg}`);
const error = (msg: string) => console.log(`${pc.bold(pc.redBright("[model-watcher]"))} ${msg}`);
/* eslint-enable no-console */

/**
 * Dev-only plugin: runs Gradle continuous build so that model edits under
 * exampleModels/src are regenerated automatically while the devapp dev server is
 * running. Gradle writes the regenerated artifacts into exampleModels/build and
 * modelGraph/build, which rsbuild serves via publicDir (watch: true) and reloads.
 *
 * rsbuild's dev.watchFiles cannot run a command, so the regeneration (a Gradle
 * task chain) is delegated to `gradle -t`, which natively handles change
 * detection, incremental rerun, debouncing, and keeps the daemon warm.
 *
 * In platform mode the backend converts the models itself and must be restarted
 * to pick up changes, so regenerating the mock graph here is pointless.
 */
export function pluginModelWatcher(profile: string): RsbuildPlugin {
	return {
		name: "model-watcher",
		setup(api) {
			if (api.context.action !== "dev" || profile !== "mock") {
				return;
			}

			// api.context.rootPath is the devapp dir; the Gradle build is one level up.
			const repoRoot = resolve(api.context.rootPath, "..");
			let child: ChildProcess | undefined;

			const stop = (): void => {
				if (child && child.exitCode === null) {
					// On Unix, SIGINT lets Gradle continuous build shut down cleanly.
					// On Windows, signals are unsupported; SIGTERM triggers TerminateProcess.
					child.kill(platform === "win32" ? "SIGTERM" : "SIGINT");
				}
				child = undefined;
			};

			api.onAfterStartDevServer(() => {
				if (child) {
					return;
				}
				child = spawn("gradle", [":modelGraph:assemble", "--continuous", "--console=plain"], {
					cwd: repoRoot,
					// stderr inherited => full error detail; stdout piped => filtered below.
					stdio: ["ignore", "pipe", "inherit"],
					// shell: true is required on Windows where gradle is a .bat/.cmd script.
					shell: platform === "win32"
				})
					.on("exit", code => {
						if (code) {
							error(`gradle -t exited with code ${code}`);
						}
						child = undefined;
					})
					.on("error", err => {
						error(`failed to spawn gradle: ${err.message}`);
						child = undefined;
					});

				if (child.stdout) {
					createInterface({ input: child.stdout }).on("line", line => {
						if (SUCCESS.test(line)) {
							success(line);
						} else if (INFO.test(line)) {
							info(line);
						}
					});
				}
			});

			api.onCloseDevServer(stop);
			api.onExit(stop);
		}
	};
}
