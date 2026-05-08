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

import { readFile } from "node:fs/promises";
import { EOL } from "node:os";
import { join } from "node:path";

import jambitTypedReduxSaga from "@jambit/eslint-plugin-typed-redux-saga";
import jsdoc from "eslint-plugin-jsdoc";
import mocha from "eslint-plugin-mocha";
import notice from "eslint-plugin-notice";
import useEffectNoDeps from "eslint-plugin-use-effect-no-deps";
import workspaces from "eslint-plugin-workspaces";
import { defineConfig, globalIgnores } from "eslint/config";

import { reactStrict } from "@com.mgmtp.a12.devtools/eslint-config";

const RESTRICTED_IMPORT_PATTERNS = [
	{
		group: ["@com.mgmtp.a12.*/**/internal/**"],
		message:
			"A12 Code should always be imported via the its public API. If this is not possible, please disable the rule inline and add a comment."
	},
	{
		group: ["@com.mgmtp.a12.*/**/src/**"],
		message:
			"Importing A12 Code directly from source is most likely a mistake. Import from `lib` instead."
	},
	{
		group: ["**/test/**"],
		message: "Importing A12 Code from the /test directory is not allowed."
	},
	{
		regex:
			"@com\\.mgmtp\\.a12\\.(?:widgets/widgets-core|dataservices/dataservices-access|kernel/(?:kernel-md-facade|kernel-core-runtime-api-ts))$",
		message:
			"Top-level a12 imports may pull in unwanted dependencies and increase bundle size & compile time. Use the specific subpackage instead."
	},
	{
		/**
		 * Exception is for the index.js of table as it contains the `TableTemplate` namespace, which we need.
		 */
		regex:
			"@com\\.mgmtp\\.a12\\.widgets/widgets-core(?!/lib/table/main/template/index\\.js)(?:$|/.*/index\\.js$)",
		message:
			"Widgets barrel imports may pull in unwanted dependencies and increase bundle size & compile time. Use the specific subpackage instead."
	},
	{
		regex: "^node:assert$",
		message: "Use 'node:assert/strict' instead."
	},
	{
		regex: "^node:*",
		importNames: ["*", "default"],
		message: "Use the specific named exports instead."
	},
	{
		group: ["redux-saga"],
		importNames: ["SagaIterator"],
		message: "Use 'SagaGenerator' from 'typed-redux-saga' instead."
	}
];

const TEST_RESTRICTED_IMPORT_PATTERNS = [
	...RESTRICTED_IMPORT_PATTERNS,
	{
		group: ["@testing-library/react"],
		importNames: ["screen", "within", "render", "RenderResult"],
		message:
			"Importing screen, within, render or RenderResult directly from `@testing-library/react` is most likely a mistake. Import from `@com.mgmtp.a12.devtools/react` instead."
	}
];

const ignores = [
	"**/.gradle",
	"**/.vscode",
	"**/assets/images",
	"**/build",
	"**/dist",
	"**/lib",
	"**/target",
	"codemod/src/testData",
	"computation-relevancy-analyzer",
	"docker",
	"exampleModels",
	"form-model",
	"form-parent",
	"migrationTool/src/main/steps/index.ts",
	"modelGraph",
	"patches",
	"publish",
	"security",
	"serialization-integration-test"
];

const licenseHeaderTemplate = await readFile(
	join(import.meta.dirname, "license_header.txt"),
	"utf-8"
);

const licenseHeaderWithInterpreterLine = `#!/usr/bin/env node${EOL}${licenseHeaderTemplate}`;

export default defineConfig(
	globalIgnores(ignores, "root/ignores"),
	...reactStrict,
	{
		name: "root/base",
		languageOptions: {
			parserOptions: {
				projectService: true
			}
		},
		plugins: {
			"@jambit/typed-redux-saga": jambitTypedReduxSaga,
			notice,
			useEffectNoDeps,
			workspaces,
			jsdoc
		},
		rules: {
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-deprecated": "error",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-empty-object-type": "warn",
			"@typescript-eslint/no-invalid-void-type": "warn",
			"@typescript-eslint/no-non-null-assertion": "warn",
			"@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
			"notice/notice": [
				"error",
				{
					template: licenseHeaderTemplate,
					onNonMatchingHeader: "replace",
					chars: licenseHeaderTemplate.length + 100 // add some tolerance for codemod shebang
				}
			],
			"no-console": "error",
			"no-inner-declarations": "off",
			"react/jsx-key": ["error", { checkKeyMustBeforeSpread: true }],
			"react/react-in-jsx-scope": "off",
			"react-hooks/static-components": "off",
			"react-hooks/refs": "off",
			"react-hooks/immutability": "off",
			"useEffectNoDeps/use-effect-no-deps": "error",
			"workspaces/no-absolute-imports": "error",
			"workspaces/no-cross-imports": [
				"error",
				{
					allow: [
						"@com.mgmtp.a12.formengine/formengine-core",
						"@com.mgmtp.a12.formengine/formengine-content-elements",
						"@com.mgmtp.a12.formengine/formengine-content-elements-editor"
					]
				}
			],
			"workspaces/no-relative-imports": "error",
			"workspaces/require-dependency": "error",
			eqeqeq: ["error", "smart"],
			"no-restricted-imports": [
				"error",
				{
					patterns: RESTRICTED_IMPORT_PATTERNS
				}
			],
			"jsdoc/no-undefined-types": "error"
		}
	},
	{
		name: "files-with-license-header-and-interpreter-line",
		files: ["**/cli.ts", "core/scripts/mocha/runner.js", "performance-tests/src/cli/index.ts"],
		rules: {
			"notice/notice": [
				"error",
				{
					template: licenseHeaderWithInterpreterLine,
					onNonMatchingHeader: "replace",
					chars: licenseHeaderWithInterpreterLine.length
				}
			]
		}
	},
	{
		name: "root/typedReduxSaga",
		files: ["core/src/**/*", "documentation/src/assets/typescript/**/*"],
		ignores: ["core/src/test/**/*"],
		rules: {
			"@jambit/typed-redux-saga/delegate-effects": "error",
			"@jambit/typed-redux-saga/use-typed-effects": "error"
		}
	},
	{
		name: "testOverrides",
		files: ["core/src/test/**/*", "content-elements/src/test/**/*"],
		plugins: {
			mocha
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"mocha/no-setup-in-describe": "warn",
			"no-restricted-imports": [
				"error",
				{
					patterns: TEST_RESTRICTED_IMPORT_PATTERNS
				}
			]
		}
	},
	{
		name: "codemod/specific",
		files: ["codemod/src/**/*"],
		rules: {
			"no-console": "off"
		}
	},
	{
		name: "documentation/specific",
		files: ["documentation/src/assets/typescript/**/*"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off"
		}
	},
	{
		name: "migrationTool/specific",
		files: ["migrationTool/src/**/*"],
		rules: {
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": "off"
		}
	},
	{
		name: "cjsScripts/specific",
		files: ["**/*.cjs"],
		rules: {
			"@typescript-eslint/no-require-imports": "off"
		}
	},
	{
		name: "performance-test/specific",
		files: ["performance-tests/src/**/*"],
		rules: {
			"no-console": "off"
		}
	},
	{
		name: "performance-test/imports",
		files: ["performance-tests/src/test/features/**"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["@playwright/test"],
							message:
								"Performance Tests have to use a custom fixture to be able to collect metrics. Import from `@prometheus/test` instead."
						}
					]
				}
			]
		}
	}
);
