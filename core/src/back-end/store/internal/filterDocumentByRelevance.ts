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
