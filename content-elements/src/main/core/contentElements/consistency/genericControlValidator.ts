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
import { Model } from "@com.mgmtp.a12.client/client-core";
import type {
	ContentModel,
	ElementModule,
	NodeValidationContext,
	ValidationMessage
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { BaseControlProps } from "../../types/controlProps.js";

import { checkDmReference } from "./checkDmReference.js";
import { checkGranularity } from "./checkGranularity.js";
import { checkNoChildren } from "./checkNoChildren.js";
import { checkValidElementReference } from "./checkValidElementReference.js";

/** @internal */
export function genericControlValidator(options: {
	context: NodeValidationContext;
	additionalChecks?: ((options: {
		element?: DocumentModel.Element;
		path: ModelPath;
	}) => ValidationMessage[])[];
	isNodeInstance: ElementModule<ContentModel.Node<BaseControlProps>>["isNodeInstance"];
}): ValidationMessage[] {
	const { context, additionalChecks, isNodeInstance } = options;
	const { node, modelPath, referencedModels } = context;

	if (!isNodeInstance(node)) {
		return [];
	}

	const result: ValidationMessage[] = [];

	const dm = referencedModels?.find(Model.isDocumentModel);

	result.push(...checkNoChildren(node));
	result.push(...checkDmReference(dm));

	if (dm) {
		const documentModelService = new DocumentServiceFactory().getDocumentModelSearchService(dm);

		const elementPath = documentModelService.getPathById(node.props.elementId) ?? [];
		const element = documentModelService.getByPath(elementPath);

		result.push(
			...checkValidElementReference({
				elementId: node.props.elementId,
				element
			})
		);

		result.push(
			...checkGranularity({
				dm,
				elementPath,
				contextPath: modelPath
			})
		);

		const additionalMessages =
			additionalChecks?.flatMap(c => c({ element, path: elementPath })) ?? [];

		result.push(...additionalMessages);
	}

	return result;
}
