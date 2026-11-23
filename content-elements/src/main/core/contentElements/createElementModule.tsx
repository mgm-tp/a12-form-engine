// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { actionCreatorFactory } from "typescript-fsa";

import type {
	ContentModel,
	NodeRendererProps,
	NodeValidator
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FORM_ELEMENTS_NAMESPACE } from "../namespace.js";

/**
 * @internal
 */
export function createElementModule<Node extends ContentModel.Node>(options: {
	type: string;
	renderer: (props: NodeRendererProps<Node>) => JSX.Element | null;
	validator: NodeValidator;
}): ElementModule<Node> {
	const { type, renderer, validator } = options;

	const id = ElementModule.Identifier.create({ namespace: FORM_ELEMENTS_NAMESPACE, type });

	return {
		id,
		renderer,
		validator,
		isInstance: (module): module is ElementModule<Node> => module.id === id,
		isNodeInstance: (node): node is Node =>
			node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === type,
		actionCreator: actionCreatorFactory(`${FORM_ELEMENTS_NAMESPACE}/${type}`)
	};
}
