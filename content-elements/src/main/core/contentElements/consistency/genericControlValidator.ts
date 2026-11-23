// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type {
	ContentModel,
	ElementModule,
	NodeValidationContext,
	ValidationMessage
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

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
