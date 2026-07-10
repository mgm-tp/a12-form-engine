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

import { readFile } from "node:fs/promises";
import { EOL } from "node:os";
import { join } from "node:path";

import { fixupPluginRules } from "@eslint/compat";
import jsdoc from "eslint-plugin-jsdoc";
import notice from "eslint-plugin-notice";
// @ts-expect-error No types available
import useEffectNoDeps from "eslint-plugin-use-effect-no-deps";
import workspaces from "eslint-plugin-workspaces";
import { defineConfig, globalIgnores } from "eslint/config";

import { reactStrict } from "@com.mgmtp.a12.devtools/eslint-config";

const RESTRICTED_IMPORT_PATTERNS = [
	{
		group: ["**/test/**"],
		message: "Importing A12 Code from the /test directory is not allowed."
	},
	{
		regex: "^node:assert$",
		message: "Use 'node:assert/strict' instead."
	},
	{
		regex: "^node:(?!process)",
		importNames: ["*", "default"],
		message: "Use the specific named exports instead."
	},
	{
		group: ["redux-saga"],
		importNames: ["SagaIterator"],
		message: "Use 'SagaGenerator' from 'typed-redux-saga' instead."
	}
];

export const TEST_RESTRICTED_IMPORT_PATTERNS = [
	...RESTRICTED_IMPORT_PATTERNS,
	{
		group: ["@testing-library/react"],
		importNames: ["screen", "within", "render", "RenderResult"],
		message:
			"Importing screen, within, render or RenderResult directly from `@testing-library/react` is most likely a mistake. Import from `@com.mgmtp.a12.devtools/react` instead."
	}
];

const sharedIgnores = [
	"**/.gradle",
	"**/.vscode",
	"**/assets/images",
	"**/assets/typedoc",
	"**/build",
	"**/dist",
	"**/lib",
	"**/target",
	"docker",
	"exampleModels",
	"licenses",
	"form-model",
	"form-parent",
	"java-codemod",
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
	globalIgnores(sharedIgnores, "shared/ignores"),
	...reactStrict,
	{
		name: "shared/base",
		languageOptions: {
			parserOptions: {
				projectService: true
			}
		},
		plugins: {
			notice: fixupPluginRules(notice),
			useEffectNoDeps,
			workspaces,
			jsdoc
		},
		rules: {
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-deprecated": "error",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-empty-object-type": ["error", { allowObjectTypes: "always" }],
			"@typescript-eslint/no-invalid-void-type": "warn",
			"@typescript-eslint/no-non-null-assertion": "warn",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true
				}
			],
			"notice/notice": [
				"error",
				{
					template: licenseHeaderTemplate,
					onNonMatchingHeader: "replace",
					chars: licenseHeaderTemplate.length
				}
			],
			"no-console": "error",
			"no-inner-declarations": "off",
			"react/jsx-key": ["error", { checkKeyMustBeforeSpread: true }],
			"react/react-in-jsx-scope": "off",
			"react-hooks/refs": "off",
			"react-hooks/static-components": "off",
			"useEffectNoDeps/use-effect-no-deps": "error",
			"workspaces/no-absolute-imports": "error",
			"workspaces/no-cross-imports": [
				"error",
				{
					allow: [
						"@com.mgmtp.a12.formengine/formengine-core",
						"@com.mgmtp.a12.formengine/formengine-content-elements",
						"@com.mgmtp.a12.formengine/formengine-content-elements-editor",
						"@com.mgmtp.a12.formengine/formengine-a12internal-preview"
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
			"import/consistent-type-specifier-style": ["error", "prefer-top-level"],
			"jsdoc/no-undefined-types": "error"
		}
	},
	{
		name: "shared/files-with-license-header-and-interpreter-line",
		files: ["**/cli.ts", "**/runner.js", "performance-tests/src/cli/index.ts"],
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
		name: "shared/cjsScripts",
		files: ["**/*.cjs"],
		rules: {
			"@typescript-eslint/no-require-imports": "off"
		}
	}
);
