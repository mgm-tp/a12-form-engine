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

import type { ApplicationSetup } from "@com.mgmtp.a12.client/client-core";
import {
	ActivityActions,
	APPLICATION_MODEL_PLACEHOLDER,
	ApplicationFactories,
	ModelActions,
	ModuleRegistryProvider
} from "@com.mgmtp.a12.client/client-core";
import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/dirtyHandling";
import { createHttpModelLoader } from "@com.mgmtp.a12.client/client-core/modelLoader";
import { dataComponentReducerFactory, formModelProcessor } from "@com.mgmtp.a12.client/client-data";
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
		dataReducers: [dataComponentReducerFactory()],
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
