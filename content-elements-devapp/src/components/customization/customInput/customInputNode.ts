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

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { BaseControlProps } from "@com.mgmtp.a12.formengine/formengine-content-elements";

export const CUSTOM_INPUT_NAMESPACE = "com.example.devapp";

export const CUSTOM_INPUT_TYPE = "CustomInput";

/**
 * A project-specific input, identical to a TextLine except for its namespace and type.
 */
export interface CustomInputNode extends ContentModel.Node<BaseControlProps> {
	readonly namespace: typeof CUSTOM_INPUT_NAMESPACE;
	readonly type: typeof CUSTOM_INPUT_TYPE;
}

export function isCustomInputNode(node: ContentModel.Node): node is CustomInputNode {
	return node.namespace === CUSTOM_INPUT_NAMESPACE && node.type === CUSTOM_INPUT_TYPE;
}
