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
 * 1. Open-Source License – EUPL v1.2
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
