// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactNode } from "react";

import type {
	ContentModel,
	ElementModule,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { NodeSettingProps } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	createDocumentModelElementReferenceMatch,
	EditorElementModule
} from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { FormElementControllers } from "./controllers/controllerMap.js";

const editorElementFactory = EditorElementModule.createFactory();

/** @internal */
export interface ExtendModuleDependencies {
	readonly editorElementFactory: typeof editorElementFactory;
	readonly createDocumentModelElementReferenceMatch: typeof createDocumentModelElementReferenceMatch;
}

/**
 * @internal
 *
 * Wrapper for testing
 */
export function createExtendModule(dependencies: ExtendModuleDependencies) {
	return function extendModule<Node extends ContentModel.Node>(options: {
		module: ElementModule<Node>;
		label: string;
		icon: ReactNode;
		settingsRenderer: React.ComponentType<NodeSettingProps<Node>>;
		editingRenderer: React.ComponentType<NodeRendererProps<Node>>;
	}): EditorElementModule<Node> {
		const { module, label, icon, settingsRenderer, editingRenderer } = options;

		return dependencies.editorElementFactory(module, {
			label,
			icon,
			category: "Form Elements",
			controllers: FormElementControllers,
			childRules: { type: "anyOf", rules: [] },
			propertiesCreator: () => ({
				props: {
					elementId: "",
					annotations: []
				}
			}),
			settingsRenderer,
			editingRenderer,
			getSearchMatches: dependencies.createDocumentModelElementReferenceMatch("elementId", [
				"elementId"
			])
		});
	};
}

/**
 * @internal
 *
 * Default implementation
 */
export const extendModule = createExtendModule({
	editorElementFactory,
	createDocumentModelElementReferenceMatch
});
