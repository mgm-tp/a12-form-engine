// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type {
	Activity,
	ActivityReducers
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { extractModelsInScenePayload } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

import type { ExistingDocumentRequestedPayload } from "./actions.js";
import { existingDocumentRequested } from "./actions.js";
import { createInitialDocumentDataHolder } from "./createInitialDocumentDataHolder.js";
import { toFormAndDocumentModel } from "./toFormAndDocumentModel.js";

const documentService = new DocumentServiceFactory().getDocumentService();

export const existingDocumentRequestedReducer: ActivityReducers.DataReducer = {
	reduce(dataHolders, action, defaultDataHolder) {
		return existingDocumentRequested.match(action)
			? dataHolders?.map(handleExistingDocumentRequested(action, defaultDataHolder))
			: dataHolders;
	}
};

function handleExistingDocumentRequested(
	action: Action<ExistingDocumentRequestedPayload>,
	defaultDataHolder?: Activity.DataHolder
): (dh: Activity.DataHolder) => Activity.DataHolder {
	return dh => (dh === defaultDataHolder ? getExistingDocument(action, dh) : dh);
}

function getExistingDocument(
	action: Action<ExistingDocumentRequestedPayload>,
	dh: Activity.DataHolder
): Activity.DataHolder {
	const { loadedDocument } = action.payload;
	const { modelsInScene } = extractModelsInScenePayload(action) ?? {};
	const { formModel, documentModel, validatorProvider } = toFormAndDocumentModel(
		modelsInScene?.map(model => model.model) ?? []
	);

	const document = {
		...documentService.parseDates(loadedDocument, documentModel),
		id: dh.descriptor.instance,
		modelId: documentModel.header.id
	};

	return createInitialDocumentDataHolder(dh, true, {
		document,
		models: { formModel, documentModel, validatorProvider },
		isNewInstance: true
	});
}
