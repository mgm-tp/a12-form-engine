// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	Document,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentModelUtils } from "../../../shared/internal/document-model-utils.js";
import { ElementStateUtil } from "../../../view/internal/utilities/elementState.js";

import type { Models } from "./store.js";

/**
 * Collects all paths to remove, when all dependent field and dependent group
 * dependencies with the notRelevant flag are applied,
 * without paths to then not relevant descendants.
 *
 * I.e. returns the paths of all non-relevant fields and groups from the
 * document based on the current state of the data.
 *
 * @param document
 * @param models
 * @returns the paths of non-relevant fields and groups in the document
 */
export function findNotRelevantPaths(document: Document, models: Models): EntityInstancePath[] {
	return traverseObject(
		document,
		[],
		[],
		path =>
			!ElementStateUtil.evaluateGroupNotRelevant(document, models, path, path) &&
			!ElementStateUtil.evaluateFieldNotRelevant(document, models, path, path)
	);

	function traverseObject(
		currentData: object,
		currentOmittedPaths: EntityInstancePath[],
		path: EntityInstancePath,
		searchPredicate: (path: EntityInstancePath) => boolean
	): EntityInstancePath[] {
		let result: EntityInstancePath[];

		try {
			const dmElement = DocumentModelUtils.findByPath(models.documentModel, path);

			if (Array.isArray(currentData) && dmElement.type === "Group") {
				const curElement = path[path.length - 1];
				const parentPath = path.slice(0, -1);

				result = currentData
					.map((item, index) => {
						// kernel indices start at 1 !!!
						const newPath = [...parentPath, { ...curElement, index: index + 1 }];
						return searchPredicate(newPath)
							? traverseObject(item, [], newPath, searchPredicate)
							: [newPath];
					})
					.reduce((acc, curr) => [...acc, ...curr], []);
			} else if (
				!Array.isArray(currentData) &&
				currentData !== null &&
				typeof currentData === "object" &&
				!(currentData instanceof Date)
			) {
				result = Object.entries(currentData as object)
					.map(([key, value]) => {
						const newPath = [...path, { elementName: key, index: 1 }];
						const omittedPaths = Array.isArray(value)
							? range(value.length, 1).map(index => [...path, { elementName: key, index }])
							: [newPath];
						return searchPredicate(newPath)
							? traverseObject(value, [], newPath, searchPredicate)
							: [...omittedPaths];
					})
					.reduce((acc, curr) => [...acc, ...curr], []);
			} else {
				result = currentOmittedPaths;
			}
		} catch {
			// the current element does not exist in the DM -> we keep its path since there cannot be a dependency
			result = currentOmittedPaths;
		}
		return result;
	}

	function range(size: number, startAt = 0) {
		return [...Array(size).keys()].map(i => i + startAt);
	}
}
