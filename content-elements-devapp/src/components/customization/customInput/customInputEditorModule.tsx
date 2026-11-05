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

import type { NodeRendererProps } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { EditorElementModule } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	FormElementContextsProvider,
	FormElementsModules
} from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { FormElementsEditorLibrary } from "@com.mgmtp.a12.formengine/formengine-content-elements-editor";

import { customInputModule } from "./customInputModule.js";
import type { CustomInputNode } from "./customInputNode.js";

const textLineEditorModule = FormElementsEditorLibrary.modules.find(
	module => module.id === FormElementsModules.TextLine.id
) as unknown as EditorElementModule<CustomInputNode>;

/**
 * The editor counterpart of {@link customInputModule}, reusing the TextLine editor module's
 * settings the same way {@link customInputModule} reuses the TextLine runtime module, so the
 * project-specific input can be placed and configured in the content editor exactly like a
 * TextLine.
 */
export const customInputEditorModule: EditorElementModule<CustomInputNode> = {
	...textLineEditorModule,
	id: customInputModule.id,
	isInstance: customInputModule.isInstance,
	isNodeInstance: customInputModule.isNodeInstance,
	actionCreator: customInputModule.actionCreator,
	label: "Custom Input",
	category: "Custom",
	editingRenderer: CustomInputEditingRenderer
};

function CustomInputEditingRenderer(props: NodeRendererProps<CustomInputNode>) {
	return (
		<FormElementContextsProvider contentModelName="DUMMY">
			<customInputModule.renderer {...props} />
		</FormElementContextsProvider>
	);
}
