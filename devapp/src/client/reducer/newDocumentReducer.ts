// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type {
	Activity,
	ActivityReducers
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { extractModelsInScenePayload } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { createEmptyDocument } from "@com.mgmtp.a12.formengine/formengine-core";

import type { NewDocumentRequestedPayload } from "./actions.js";
import { newDocumentRequested } from "./actions.js";
import { createInitialDocumentDataHolder } from "./createInitialDocumentDataHolder.js";
import { toFormAndDocumentModel } from "./toFormAndDocumentModel.js";

export const newDocumentRequestedReducer: ActivityReducers.DataReducer = {
	reduce(dataHolders, action, defaultDataHolder) {
		return newDocumentRequested.match(action)
			? dataHolders?.map(handleNewDocumentRequested(action, defaultDataHolder))
			: dataHolders;
	}
};

function handleNewDocumentRequested(
	action: Action<NewDocumentRequestedPayload>,
	defaultDataHolder?: Activity.DataHolder
): (dh: Activity.DataHolder) => Activity.DataHolder {
	return dh => (dh === defaultDataHolder ? getNewDocument(action, dh) : dh);
}

function getNewDocument(
	action: Action<NewDocumentRequestedPayload>,
	dh: Activity.DataHolder
): Activity.DataHolder {
	const { options, preComputeNewDocuments } = action.payload;
	const { modelsInScene } = extractModelsInScenePayload(action) ?? {};
	const { formModel, documentModel, validatorProvider } = toFormAndDocumentModel(
		modelsInScene?.map(model => model.model) ?? []
	);

	const document = {
		id: NEW_INSTANCE_IDENTIFIER,
		modelId: documentModel.header.id,
		...createEmptyDocument(documentModel, formModel)
	};

	return createInitialDocumentDataHolder(dh, !!preComputeNewDocuments, {
		document,
		models: { formModel, documentModel, validatorProvider },
		isNewInstance: true,
		now: options?.now
	});
}
