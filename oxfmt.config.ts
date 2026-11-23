// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
import { defineConfig } from "oxfmt";

export default defineConfig({
	useTabs: true,
	tabWidth: 2,
	trailingComma: "none",
	arrowParens: "avoid",
	printWidth: 100,
	endOfLine: "lf",
	insertFinalNewline: true,
	sortPackageJson: false,

	/**
	 * The `ancestors` group has to match `../../**`: oxfmt's globstar crosses `..`, so a custom
	 * `../**` group would match every parent import instead of only the direct-parent tier.
	 */
	sortImports: {
		groups: ["builtin", "external", "internal", "ancestors", "parent", "sibling", "index"],
		customGroups: [{ groupName: "ancestors", elementNamePattern: ["../../**"] }],
		newlinesBetween: true,
		internalPattern: ["@com.mgmtp.a12"]
	},

	/**
	 * gitignore semantics: a bare name matches at any depth, a pattern with a slash is anchored.
	 * `testData` holds codemod fixtures whose imports must keep the exact order the test expects,
	 * and `*.api.md` is generated (and CRLF, unlike every source file).
	 */
	ignorePatterns: [
		"*.api.md",
		"THIRD_PARTY_NOTICES",
		"licenses",
		"build",
		"dist",
		"lib",
		"target",
		"testData",
		"worktrees"
	]
});
