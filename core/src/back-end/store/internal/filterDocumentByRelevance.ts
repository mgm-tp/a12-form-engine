// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	Document,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { notUndefined } from "../../../client-extensions/internal/core/utils.js";
import { DocumentModelUtils } from "../../../shared/internal/document-model-utils.js";
import { ElementStateUtil } from "../../../view/internal/utilities/elementState.js";

import type { Models } from "./store.js";

/**
 * Applies all dependent field and dependent group dependencies with the notRelevant flag.
 * I.e. removes all non-relevant fields and groups from the document based on the current state of the data.
 *
 * @param document
 * @param models
 * @returns the document without non-relevant fields and groups
 */
export function filterDocumentByRelevance(document: Document, models: Models): Document {
	return filterObject(
		document,
		[],
		path =>
			!ElementStateUtil.evaluateGroupNotRelevant(document, models, path, path) &&
			!ElementStateUtil.evaluateFieldNotRelevant(document, models, path, path)
	) as Document;

	function filterObject(
		currentData: object,
		path: EntityInstancePath,
		filterPredicate: (path: EntityInstancePath) => boolean
	): object | undefined {
		let result;

		try {
			const dmElement = DocumentModelUtils.findByPath(models.documentModel, path);

			if (Array.isArray(currentData) && dmElement.type === "Group") {
				const curElement = path[path.length - 1];
				const parentPath = path.slice(0, -1);
				result = currentData
					.map((item, index) => {
						// kernel indices start at 1 !!!
						const newPath = [...parentPath, { ...curElement, index: index + 1 }];
						return filterPredicate(newPath)
							? filterObject(item, newPath, filterPredicate)
							: undefined;
					})
					.filter(notUndefined);
			} else if (
				!Array.isArray(currentData) &&
				currentData !== null &&
				typeof currentData === "object" &&
				!(currentData instanceof Date)
			) {
				const newEntries: [string, object | undefined][] = Object.entries(
					currentData as object
				).map(([key, value]) => {
					const newPath = [...path, { elementName: key, index: 1 }];
					if (!filterPredicate(newPath)) {
						return [key, undefined];
					}
					return [key, filterObject(value, newPath, filterPredicate)];
				});
				result = Object.fromEntries(newEntries.filter(([, value]) => value !== undefined));
			} else {
				result = currentData;
			}
		} catch {
			// the current element does not exist in the DM -> we keep it since there cannot be a dependency
			result = currentData;
		}
		return result;
	}
}
