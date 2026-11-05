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

import { defineConfig } from "oxlint";

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

const TEST_RESTRICTED_IMPORT_PATTERNS = [
	...RESTRICTED_IMPORT_PATTERNS,
	{
		group: ["@testing-library/react"],
		importNames: ["screen", "within", "render", "RenderResult"],
		message:
			"Importing screen, within, render or RenderResult directly from `@testing-library/react` is most likely a mistake. Import from `@com.mgmtp.a12.devtools/react` instead."
	}
];

/**
 * Every rule is listed explicitly and all categories are off, so an oxlint upgrade cannot change
 * what we enforce.
 *
 * Formatting is oxfmt's job, including import order (`sortImports` in oxfmt.config.ts).
 * Without an oxlint rule: `jsdoc/no-undefined-types`, dropped - the only files carrying typed
 * JSDoc sit outside `src`. `react/no-deprecated` and `no-octal` need no replacement:
 * `typescript/no-deprecated` reports the same APIs from the `@types/react` annotations, and the
 * oxc parser rejects a `0`-prefixed octal literal itself.
 */
export default defineConfig({
	plugins: ["typescript", "import", "unicorn", "react"],
	jsPlugins: [
		{ name: "header", specifier: "@tony.ganchev/eslint-plugin-header" },
		{ name: "workspaces", specifier: "eslint-plugin-workspaces" },
		{ name: "typedReduxSaga", specifier: "@jambit/eslint-plugin-typed-redux-saga" },
		{ name: "useEffectNoDeps", specifier: "eslint-plugin-use-effect-no-deps" }
	],
	categories: {
		correctness: "off",
		suspicious: "off",
		pedantic: "off",
		perf: "off",
		style: "off",
		restriction: "off",
		nursery: "off"
	},
	env: { builtin: true },
	options: {
		typeAware: true,
		reportUnusedDisableDirectives: "error"
	},
	ignorePatterns: [
		".gradle",
		".vscode",
		"**/assets/images",
		"**/assets/typedoc",
		"build",
		"dist",
		"lib",
		"node_modules",
		"target",
		"docker",
		"exampleModels",
		"licenses",
		"form-model",
		"form-parent",
		"java-codemod",
		"modelGraph",
		"publish",
		"security",
		"serialization-integration-test",
		"testData",
		"THIRD_PARTY_NOTICES",
		"migrationTool/src/main/steps/index.ts"
	],
	rules: {
		curly: "error",
		eqeqeq: ["error", "smart"],
		"for-direction": "error",
		"no-array-constructor": "error",
		"no-async-promise-executor": "error",
		"no-case-declarations": "error",
		"no-compare-neg-zero": "error",
		"no-cond-assign": "error",
		"no-console": "error",
		"no-constant-binary-expression": "error",
		"no-constant-condition": "error",
		"no-control-regex": "error",
		"no-debugger": "error",
		"no-delete-var": "error",
		"no-dupe-else-if": "error",
		"no-duplicate-case": "error",
		"no-empty": "error",
		"no-empty-character-class": "error",
		"no-empty-pattern": "error",
		"no-empty-static-block": "error",
		"no-ex-assign": "error",
		"no-extra-boolean-cast": "error",
		"no-fallthrough": "error",
		"no-global-assign": "error",
		"no-invalid-regexp": "error",
		"no-irregular-whitespace": "error",
		"no-loss-of-precision": "error",
		"no-misleading-character-class": "error",
		"no-nonoctal-decimal-escape": "error",
		"no-prototype-builtins": "error",
		"no-regex-spaces": "error",
		"no-restricted-imports": ["error", { patterns: RESTRICTED_IMPORT_PATTERNS }],
		"no-self-assign": "error",
		"no-shadow-restricted-names": "error",
		"no-sparse-arrays": "error",
		"no-unassigned-vars": "error",
		"no-unexpected-multiline": "error",
		"no-unsafe-finally": "error",
		"no-unsafe-optional-chaining": "error",
		"no-unused-expressions": "error",
		"no-unused-labels": "error",
		"no-unused-private-class-members": "error",
		"no-unused-vars": [
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
		"no-useless-assignment": "error",
		"no-useless-backreference": "error",
		"no-useless-catch": "error",
		"no-useless-constructor": "error",
		"no-useless-escape": "error",
		"no-var": "error",
		"prefer-const": "error",
		"prefer-rest-params": "error",
		"prefer-spread": "error",
		"preserve-caught-error": "error",
		"require-yield": "error",
		"use-isnan": "error",
		"valid-typeof": "error",
		"import/consistent-type-specifier-style": ["error", "prefer-top-level"],
		"import/newline-after-import": ["error", { count: 1 }],
		"react/error-boundaries": "error",
		"react/exhaustive-deps": "error",
		"react/globals": "error",
		"react/immutability": "error",
		"react/incompatible-library": "warn",
		"react/jsx-key": ["error", { checkKeyMustBeforeSpread: true }],
		"react/jsx-no-comment-textnodes": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-no-target-blank": "error",
		"react/jsx-no-undef": "error",
		"react/no-children-prop": "error",
		"react/no-danger-with-children": "error",
		"react/no-direct-mutation-state": "error",
		"react/no-find-dom-node": "error",
		"react/no-is-mounted": "error",
		"react/no-render-return-value": "error",
		"react/no-string-refs": "error",
		"react/no-unescaped-entities": "error",
		"react/no-unknown-property": "error",
		"react/preserve-manual-memoization": "error",
		"react/purity": "error",
		"react/react-in-jsx-scope": "off",
		"react/refs": "off",
		"react/require-render-return": "error",
		"react/rules-of-hooks": "error",
		"react/set-state-in-effect": "error",
		"react/set-state-in-render": "error",
		"react/static-components": "off",
		"react/unsupported-syntax": "warn",
		"react/use-memo": "error",
		"typescript/ban-ts-comment": ["error", { minimumDescriptionLength: 10 }],
		"typescript/consistent-type-exports": "error",
		"typescript/consistent-type-imports": "error",
		"typescript/no-deprecated": "error",
		"typescript/no-duplicate-enum-values": "error",
		"typescript/no-dynamic-delete": "error",
		"typescript/no-empty-object-type": ["error", { allowObjectTypes: "always" }],
		"typescript/no-explicit-any": "error",
		"typescript/no-extra-non-null-assertion": "error",
		"typescript/no-extraneous-class": "error",
		"typescript/no-invalid-void-type": "warn",
		"typescript/no-misused-new": "error",
		"typescript/no-non-null-asserted-nullish-coalescing": "error",
		"typescript/no-non-null-asserted-optional-chain": "error",
		"typescript/no-non-null-assertion": "warn",
		"typescript/no-require-imports": "error",
		"typescript/no-this-alias": "error",
		"typescript/no-unnecessary-type-constraint": "error",
		"typescript/no-unsafe-declaration-merging": "error",
		"typescript/no-unsafe-function-type": "error",
		"typescript/no-wrapper-object-types": "error",
		"typescript/prefer-as-const": "error",
		"typescript/prefer-literal-enum-member": "error",
		"typescript/prefer-namespace-keyword": "error",
		"typescript/triple-slash-reference": "error",
		"typescript/unified-signatures": "error",
		"header/header": ["error", { header: { file: "./license_header.txt" } }],
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
		"useEffectNoDeps/use-effect-no-deps": "error"
	},
	overrides: [
		{
			files: ["**/*.cjs"],
			rules: {
				"typescript/no-require-imports": "off"
			}
		},
		{
			files: ["codemod/src/**"],
			rules: {
				"no-console": "off"
			}
		},
		{
			files: ["content-elements-editor/src/**"],
			rules: {
				"typescript/no-invalid-void-type": "off"
			}
		},
		{
			files: ["core/scripts/**"],
			rules: {
				"no-console": "off"
			}
		},
		{
			files: ["core/src/**"],
			excludeFiles: ["core/src/test/**"],
			rules: {
				"typedReduxSaga/delegate-effects": "error",
				"typedReduxSaga/use-typed-effects": "error"
			}
		},
		{
			files: ["documentation/src/assets/typescript/**"],
			rules: {
				"no-unused-vars": "off",
				"typedReduxSaga/delegate-effects": "error",
				"typedReduxSaga/use-typed-effects": "error",
				// these tutorial samples are extracted verbatim into the docs, so a suppression
				// comment isn't an option - "connect" is deprecated but still the documented API
				"typescript/no-deprecated": "off"
			}
		},
		{
			files: ["migrationTool/src/**"],
			rules: {
				"no-unused-vars": "off",
				"typescript/ban-ts-comment": "off",
				"typescript/no-explicit-any": "warn"
			}
		},
		{
			files: ["performance-tests/src/**"],
			rules: {
				"no-console": "off"
			}
		},
		{
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
		},
		{
			files: ["content-elements/src/test/**", "core/src/test/**"],
			rules: {
				"no-restricted-imports": ["error", { patterns: TEST_RESTRICTED_IMPORT_PATTERNS }],
				"no-unused-expressions": "off",
				"no-unused-vars": "off",
				"typescript/no-explicit-any": "off"
			}
		}
	]
});
