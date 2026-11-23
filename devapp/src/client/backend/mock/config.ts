// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Store } from "redux";

import { ModelActions } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { createHttpModelLoader } from "@com.mgmtp.a12.client/client-core/lib/extensions/modelLoader/index.js";
import { FormModelProcessor } from "@com.mgmtp.a12.formengine/formengine-core";

import { mockCreateEmptyDocumentDataProvider } from "./mockCreateEmptyDataProvider.js";
import { mockSingleDocumentDataProvider } from "./mockDataProvider.js";

export const mockConfig = {
	modelLoader: createHttpModelLoader({
		basePath: "models/",
		modelProcessors: [FormModelProcessor]
	}),
	dataHandlers: [mockCreateEmptyDocumentDataProvider(), mockSingleDocumentDataProvider]
};

export async function loadLocalModelGraph({ dispatch }: Store) {
	try {
		const response = await fetch(`modelIndex/modelGraph.json`);
		const modelGraph = (await response.json()) as ModelActions.SetModelGraphPayload;

		dispatch(ModelActions.setModelGraph(modelGraph));
	} catch (error) {
		// oxlint-disable-next-line no-console
		console.error(`Failed to set model graph, try running "gradle generateModelGraph"\n`, error);
	}
}
