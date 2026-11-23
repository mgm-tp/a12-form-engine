// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { ApplicationSetup } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import {
	ApplicationFactories,
	ModuleRegistryProvider
} from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import {
	APPLICATION_MODEL_PLACEHOLDER,
	ModelActions
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling/index.js";
import { createHttpModelLoader } from "@com.mgmtp.a12.client/client-core/lib/extensions/modelLoader/index.js";
import {
	dataComponentReducersFactory,
	formModelProcessor
} from "@com.mgmtp.a12.client/client-data";
import { ElementLibraryRegistry } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { DefaultElementLibrary } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import {
	DefaultEditorElementLibrary,
	EditorElementLibraryRegistry
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { FormElementsLibrary } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { FormElementsEditorLibrary } from "@com.mgmtp.a12.formengine/formengine-content-elements-editor";

import { enableReduxDevTools } from "./enableReduxDevTools.js";
import { MockContentEngineDataLoader } from "./mock/dataLoader.js";
import { contentEditorModule } from "./modules/contentEditor/contentEditorModule.js";
import { contentEngineModule } from "./modules/contentEngine/contentEngineModule.js";
import { HomeModule } from "./modules/home.js";

export async function setup(): Promise<ApplicationSetup> {
	ModuleRegistryProvider.getInstance().addModule(HomeModule);
	ModuleRegistryProvider.getInstance().addModule(contentEngineModule);
	ModuleRegistryProvider.getInstance().addModule(contentEditorModule);

	setupContentLibraries();

	const response = await fetch(`models/modelGraph.json`);
	const modelGraph = (await response.json()) as ModelActions.SetModelGraphPayload;

	const modelLoader = createHttpModelLoader({
		basePath: "models/",
		modelProcessors: [formModelProcessor]
	});

	return ApplicationFactories.createApplicationSetup({
		model: APPLICATION_MODEL_PLACEHOLDER,
		dataHandlers: [new MockContentEngineDataLoader()],
		dataReducers: dataComponentReducersFactory(),
		modelLoader,
		composeEnhancer: enableReduxDevTools(),
		setupActions: [
			ModelActions.setModelGraph(modelGraph),
			ActivityActions.create({
				activityDescriptor: { home: "true" },
				loadingState: "loaded"
			})
		],
		overridePlatformSagas: [...DirtyHandlingFactories.createSagas()]
	});
}

function setupContentLibraries() {
	// runtime
	const defaultLibrary = DefaultElementLibrary.get();
	const elementLibrary = {
		...defaultLibrary,
		modules: [...defaultLibrary.modules, ...FormElementsLibrary.modules]
	};
	ElementLibraryRegistry.get().addEntry(elementLibrary);

	// editor
	const defaultEditorLibrary = DefaultEditorElementLibrary.get();
	const editorLibrary = {
		...defaultEditorLibrary,
		modules: [...defaultEditorLibrary.modules, ...FormElementsEditorLibrary.modules]
	};
	EditorElementLibraryRegistry.get().addEntry(editorLibrary);
}
