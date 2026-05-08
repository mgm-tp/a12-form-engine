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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore } from "../../../../../../back-end/store/internal/store.js";

/**@internal */
export type Mutation = [
	string,
	(entry: EngineStore.Validation.Entry | undefined) => EngineStore.Validation.Entry
];

const regExpNoIndex = new RegExp(".*(_copy)$");
const regExpWithIndex = new RegExp(".*(_copy_)[d]+$");

function generateUniqueFileName(fileName: string, existingFileNames: string[]): string {
	const startOfExtension = fileName.lastIndexOf(".");
	const stem = fileName.substring(0, startOfExtension);
	const extension = fileName.substring(startOfExtension);

	let counter = regExpWithIndex.test(fileName) ? +stem.substring(stem.lastIndexOf("_") + 1) : 2;

	const newStem = regExpNoIndex.test(fileName)
		? stem
		: regExpWithIndex.test(fileName)
			? stem.substring(0, stem.lastIndexOf("_"))
			: stem + "_copy";

	let newFileName = newStem;

	while (existingFileNames.includes(newFileName + extension)) {
		newFileName = `${newStem}_${counter}`;
		counter++;
	}

	return `${newFileName}${extension}`;
}

/**
 * Renames a JS file blob by generating a new name for it.
 * Uniqueness is ensured by passing existing file names.
 *
 * NOTE: `existingNames` is mutated since the new name is added to it!
 *
 * @internal
 */
export function renameFile(file: File, existingNames: string[]): File {
	const newFileName = generateUniqueFileName(file.name, existingNames);

	existingNames.push(newFileName);

	return new File([file], newFileName, { type: file.type, lastModified: Date.now() });
}

/**
 * Data structure describing existing attachment files.
 *
 * Used to find duplicates when uploading multiple new files.
 */
export interface ExistingFile {
	/**
	 * Used as the unique identifier of a file
	 */
	readonly fileName: string;

	/**
	 * Used to be able to replace duplicates
	 */
	readonly documentPath: EntityInstancePath;
}
