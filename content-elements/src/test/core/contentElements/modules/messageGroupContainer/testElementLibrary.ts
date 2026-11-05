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

import type { ContentModel, ElementLibrary } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { createElementModule } from "../../../../../main/core/contentElements/createElementModule.js";
import { CHECKBOX_TYPE } from "../../../../../main/core/contentElements/modules/checkbox/checkboxNode.js";
import { TEXT_LINE_TYPE } from "../../../../../main/core/contentElements/modules/textLine/textLineNode.js";
import type { BaseControlProps } from "../../../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../../main/core/namespace.js";

import type { MultiInputProps, ProjectInputProps } from "./testContentNodes.js";
import { MULTI_INPUT_TYPE, PROJECT_INPUT_TYPE, PROJECT_NAMESPACE } from "./testContentNodes.js";

/**
 * An element library holding the Form Elements controls the tests reference, plus the given
 * project-specific modules.
 */
export function createTestLibrary(additionalModules: ElementModule[] = []): ElementLibrary {
	return {
		id: FORM_ELEMENTS_NAMESPACE,
		modules: [
			createControlModule(TEXT_LINE_TYPE),
			createControlModule(CHECKBOX_TYPE),
			...additionalModules
		],
		configuration: {}
	};
}

function createControlModule(type: string): ElementModule<ContentModel.Node<BaseControlProps>> {
	return createElementModule<ContentModel.Node<BaseControlProps>>({
		type,
		renderer: () => null,
		validator: () => []
	});
}

/**
 * The module of an element a project adds outside of the Form Elements library, declaring its own
 * props as the data reference and the label.
 */
export function createProjectInputModule(): ElementModule {
	const createModule = ElementModule.createFactory(PROJECT_NAMESPACE);

	return createModule<ProjectInputProps>(PROJECT_INPUT_TYPE, {
		renderer: () => null,
		dataBinding: { role: "input", getElementReferences: node => [node.props.dataRef] },
		getNodeLabel: node => node.props.caption
	});
}

/**
 * The module of an element that edits several data elements at once, for asserting that each
 * reference is reported separately.
 */
export function createMultiInputModule(): ElementModule {
	const createModule = ElementModule.createFactory(PROJECT_NAMESPACE);

	return createModule<MultiInputProps>(MULTI_INPUT_TYPE, {
		renderer: () => null,
		dataBinding: { role: "input", getElementReferences: node => node.props.dataRefs }
	});
}
