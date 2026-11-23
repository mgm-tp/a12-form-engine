// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { execSync } from "node:child_process";
import { env as processEnv } from "node:process";

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
	const version = `${processEnv.RELEASE_VERSION ?? packageJson.version} [${devappMode.toUpperCase()}]`;

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
