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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DataReference } from "@com.mgmtp.a12.client/client-data";
import {
	DocumentPath,
	getDocumentPath,
	getDocumentPathForRepeatableGroup
} from "@com.mgmtp.a12.client/client-data";
import type { DocumentModel, EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { isRepeatableGroupLikeElement } from "./isRepeatableGroupLikeElement.js";

/**
 * The data reference a control reads and writes: the document path of the data element it
 * references, resolved in the data context the control is rendered in.
 *
 * A repeatable group that a control edits as a whole — a multi-select — is addressed by the group
 * itself rather than by one of its instances.
 *
 * @internal
 */
export function getControlDataReference(params: {
	getModelPathById: (elementId: string) => ModelPath;
	getElementByPath: (path: ModelPath) => DocumentModel.Element;
	elementId: string;
	dataContext: EntityInstancePath;
}): DataReference {
	const { getModelPathById, getElementByPath, elementId, dataContext } = params;

	const elementModelPath = getModelPathById(elementId);
	const elementDocumentPath = getDocumentPath(elementModelPath, dataContext);
	const dmElement = getElementByPath(elementModelPath);

	return isRepeatableGroupLikeElement(dmElement)
		? DocumentPath.toString(
				getDocumentPathForRepeatableGroup(elementDocumentPath, elementDocumentPath)
			)
		: DocumentPath.toString(elementDocumentPath);
}
