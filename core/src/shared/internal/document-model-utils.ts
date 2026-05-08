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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

/**
 * @internal
 * @ignore
 */
export namespace DocumentModelUtils {
	/** @internal */
	export function findByPath(
		documentModel: DocumentModel,
		targetPath: ModelPath
	): DocumentModel.Element {
		if (targetPath.length === 0) {
			return documentModel.content.modelRoot;
		}

		const element = new DocumentServiceFactory()
			.getDocumentModelSearchService(documentModel)
			.getByPath(targetPath);

		if (element === undefined) {
			throw new Error(`Invalid path: ${ModelPath.toString(targetPath)}`);
		}

		return element;
	}

	/**
	 * @internal
	 *
	 * Returns the path of the nearest ancestor group of the given element that is
	 * repeatable.
	 */
	export function findContextGroup(
		documentModel: DocumentModel,
		elementPath: ModelPath
	): ModelPath {
		const path = [...elementPath];
		while (path.length > 0) {
			const element = DocumentModelUtils.findByPath(documentModel, path);
			if (element.type === "Group" && element.repeatability > 1 && !isMultiSelect(element)) {
				return path;
			}
			path.pop();
		}

		return [];
	}

	/** @internal */
	export function isMultiSelect(element: DocumentModel.Element): element is DocumentModel.Group {
		return (
			element.type === "Group" &&
			element.usageType !== undefined &&
			element.usageType === "multi-select"
		);
	}

	/** @internal */
	export function isAttachment(element: DocumentModel.Element): element is DocumentModel.Group {
		return (
			element.type === "Group" &&
			element.usageType !== undefined &&
			element.usageType === "attachment"
		);
	}
}

/** @internal */
export type StringValueDataType = DocumentModel.StringType | DocumentModel.EnumerationType;
