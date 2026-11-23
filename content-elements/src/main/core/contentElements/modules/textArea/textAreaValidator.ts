// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	NodeValidationContext,
	ValidationMessage
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { genericControlValidator } from "../../consistency/genericControlValidator.js";

import { isTextAreaNode } from "./textAreaNode.js";

/** @internal */
export function textAreaValidator(context: NodeValidationContext): ValidationMessage[] {
	return genericControlValidator({
		context,
		additionalChecks: [checkValidElementForTextArea],
		isNodeInstance: isTextAreaNode
	});
}

/**
 * @internal
 * Only exported for testing.
 */
export function checkValidElementForTextArea(options: {
	element?: DocumentModel.Element;
	path: ModelPath;
}): ValidationMessage[] {
	const { element, path } = options;

	if (
		element &&
		(element.type === "Group" ||
			!["StringType", "CustomFieldType"].includes(element.fieldType.type))
	) {
		return [
			{
				severity: "Error",
				message:
					`Invalid reference to element ${ModelPath.toString(path)}. ` +
					`Only fields of type StringType or CustomFieldType are supported.`
			}
		];
	}

	return [];
}
