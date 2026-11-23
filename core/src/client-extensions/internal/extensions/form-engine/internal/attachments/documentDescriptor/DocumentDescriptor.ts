// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * An object containing metadata about the current document (model) of the form engine
 */
export interface DocumentDescriptor {
	/**
	 * The id of the current document (also referred to as "docRef")
	 */
	readonly documentId: string;
	/**
	 * The name of the document model for the current document
	 */
	readonly documentModelName: string;
}
