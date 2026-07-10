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

import type { SourceFile } from "ts-morph";

import { CORE_PACKAGE_NAME } from "./packageNames.js";

export function addNamedValueImports(sourceFile: SourceFile, functionNames: string[]): void {
	const uniqueFunctions = [...new Set(functionNames)];

	// Check if there's already an import from formengine-core
	const existingImport = sourceFile.getImportDeclaration(declaration => {
		const moduleSpecifier = declaration.getModuleSpecifierValue();
		return moduleSpecifier.startsWith(CORE_PACKAGE_NAME);
	});

	if (existingImport) {
		// Add to existing import
		const namedImports = existingImport.getNamedImports();
		const existingNames = new Set(namedImports.map(ni => ni.getName()));

		const newImports = uniqueFunctions.filter(fn => !existingNames.has(fn));

		if (newImports.length > 0) {
			existingImport.addNamedImports(newImports);
			// turn this into a value import as well since we're adding functions
			existingImport.setIsTypeOnly(false);
		}
	} else {
		// Create new import
		sourceFile.addImportDeclaration({
			moduleSpecifier: CORE_PACKAGE_NAME,
			namedImports: uniqueFunctions
		});
	}
}
