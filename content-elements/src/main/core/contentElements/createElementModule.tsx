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

import type { JSX } from "react";

import type { DataReference } from "@com.mgmtp.a12.client/client-data";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import { actionCreatorFactory } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type {
	ContentModel,
	NodeRendererProps,
	NodeValidator,
	RuntimeTreeContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization";

import { FORM_ELEMENTS_NAMESPACE } from "../namespace.js";
import type { BaseControlProps } from "../types/controlProps.js";

import { getControlDataReference } from "./elementConfiguration/getControlDataReference.js";

/**
 * @internal
 */
export function createElementModule<Node extends ContentModel.Node<BaseControlProps>>(options: {
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
		dataBinding: { role: "input", getElementReferences: getElementId },
		getNodeLabel: getLabel,
		isRendered: isRelevantControl,
		isInstance: (module): module is ElementModule<Node> => module.id === id,
		isNodeInstance: (node): node is Node =>
			node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === type,
		actionCreator: actionCreatorFactory(`${FORM_ELEMENTS_NAMESPACE}/${type}`)
	};
}

/**
 * The data element the given control lets the user edit, empty while the Content Model author
 * has configured none.
 */
function getElementId(node: ContentModel.Node<BaseControlProps>): string[] {
	return node.props.elementId ? [node.props.elementId] : [];
}

/**
 * The label the Content Model author gave the given control, undefined when they gave none.
 *
 * Returned as the Content Model stores it, so a caller showing it to a user still has to localize
 * it and to fall back to the label of the referenced data element, the way the control itself does
 * when rendering.
 */
function getLabel(node: ContentModel.Node<BaseControlProps>): LocalizedModelText | undefined {
	return node.props.label;
}

/**
 * Whether the given control renders, which it does unless the data it edits is not relevant.
 *
 * The controls hide themselves in that case, so a consumer expanding the content tree outside of a
 * render would otherwise be told about inputs the user cannot see.
 *
 * A control whose data element the Content Model author has not configured yet counts as rendered:
 * the node is unfinished rather than hidden.
 */
function isRelevantControl(
	node: ContentModel.Node<BaseControlProps>,
	dataContext: DataReference,
	context: RuntimeTreeContext
): boolean {
	if (!node.props.elementId) {
		return true;
	}

	const { model, document } = context.documentContext;

	const dataReference = getControlDataReference({
		getModelPathById: elementId => model.getModelPathById(context.state, elementId),
		getElementByPath: path => model.getElementByPath(context.state, path),
		elementId: node.props.elementId,
		dataContext: DocumentPath.fromString(dataContext)
	});

	return !document.getNotRelevant(context.state, dataReference);
}
