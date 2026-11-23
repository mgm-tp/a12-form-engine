// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
