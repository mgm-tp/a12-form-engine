// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";
import type { BaseControlProps } from "../../../types/controlProps.js";

export const CHECKBOX_GROUP_TYPE = "CheckboxGroup";

export interface CheckboxGroupNode extends ContentModel.Node<BaseControlProps> {
	readonly namespace: typeof FORM_ELEMENTS_NAMESPACE;
	readonly type: typeof CHECKBOX_GROUP_TYPE;
}

/** @internal */
export function isCheckboxGroupNode(node: ContentModel.Node): node is CheckboxGroupNode {
	return node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === CHECKBOX_GROUP_TYPE;
}
