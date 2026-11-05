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

import { actionCreatorFactory } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule as ElementModuleNamespace } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { FormElementsModules } from "@com.mgmtp.a12.formengine/formengine-content-elements";

import type { CustomInputNode } from "./customInputNode.js";
import { CUSTOM_INPUT_NAMESPACE, CUSTOM_INPUT_TYPE } from "./customInputNode.js";

const id = ElementModuleNamespace.Identifier.create({
	namespace: CUSTOM_INPUT_NAMESPACE,
	type: CUSTOM_INPUT_TYPE
});

/**
 * A project-specific input that behaves exactly like the built-in TextLine, only registered under
 * its own namespace and type, so that the message group examples can show that jump links and
 * auto-collection work for custom inputs just as they do for built-in ones.
 */
const textLineAsCustomInput =
	FormElementsModules.TextLine as unknown as ElementModule<CustomInputNode>;

export const customInputModule: ElementModule<CustomInputNode> = {
	...textLineAsCustomInput,
	id,
	isInstance: (module): module is ElementModule<CustomInputNode> => module.id === id,
	isNodeInstance: (node): node is CustomInputNode =>
		node.namespace === CUSTOM_INPUT_NAMESPACE && node.type === CUSTOM_INPUT_TYPE,
	actionCreator: actionCreatorFactory(`${CUSTOM_INPUT_NAMESPACE}/${CUSTOM_INPUT_TYPE}`)
};
