// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";
import type { BaseControlProps } from "../../../types/controlProps.js";

export const MULTI_SELECT_TYPE = "MultiSelect";

export interface MultiSelectNode extends ContentModel.Node<BaseControlProps> {
	readonly namespace: typeof FORM_ELEMENTS_NAMESPACE;
	readonly type: typeof MULTI_SELECT_TYPE;
}

/** @internal */
export function isMultiSelectNode(node: ContentModel.Node): node is MultiSelectNode {
	return node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === MULTI_SELECT_TYPE;
}
