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

import { execSync } from "node:child_process";

import { defineConfig, rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

import packageJson from "../package.json" with { type: "json" };

const commitHash = execSync("git rev-parse HEAD || exit 0", {
	stdio: [1],
	encoding: "utf8"
}).trim();

export default defineConfig(({ envMode, env }) => {
	// for deployments we always use mock mode
	const devappMode = env === "production" ? "mock" : (envMode ?? "mock");
	const version = `${packageJson.version} [${devappMode.toUpperCase()}]`;

	return {
		server: {
			port: 14002,
			publicDir: [{ name: "resources" }, { name: "target" }]
		},
		dev: {
			watchFiles: [
				{
					paths: ["../content-elements/lib"],
					options: {
						// prevent reloading when test code changes
						ignored: "../content-elements/lib/test"
					}
				}
			]
		},
		source: {
			preEntry: "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css",
			entry: { index: `./src/index.tsx` },
			define: {
				__VERSION__: JSON.stringify(version),
				__COMMIT_HASH__: JSON.stringify(commitHash),
				SC_DISABLE_SPEEDY: false,
				__DEVAPP_MODE__: JSON.stringify(devappMode)
			}
		},
		resolve: {
			dedupe: ["scheduler", "react-is", "big.js", "@date-fns/tz", "clsx"]
		},
		html: {
			title: `Form Content Elements Devapp - ${version}`,
			template: "resources/html/index.html"
		},
		plugins: [pluginReact()],
		tools: {
			rspack(config, { addRules, appendPlugins }) {
				addRules({ test: /\.js$/, loader: "source-map-loader", enforce: "pre" });

				if (envMode === "analyze") {
					appendPlugins(new RsdoctorRspackPlugin());
				}

				config.optimization ??= {};
				config.optimization.minimizer = [
					new rspack.SwcJsMinimizerRspackPlugin({
						minimizerOptions: {
							mangle: { keep_fnames: true }
						}
					})
				];
			}
		},
		output: {
			cleanDistPath: false,
			sourceMap: {
				js: env === "production" ? "source-map" : "cheap-module-source-map"
			}
		},
		performance: {
			printFileSize: {
				compressed: false
			}
		}
	};
});
