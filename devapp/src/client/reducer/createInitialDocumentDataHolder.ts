// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type {
	FormModel,
	PreProcessDocumentParams
} from "@com.mgmtp.a12.formengine/formengine-core";
import { createUIState, preProcessDocument } from "@com.mgmtp.a12.formengine/formengine-core";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

/** @internal */
export function createInitialDocumentDataHolder(
	dh: Activity.DataHolder,
	preProcessDoc: boolean,
	params: PreProcessDocumentParams
): Activity.DataHolder {
	const { document, models, now, isNewInstance } = params;
	const { formModel, validatorProvider, documentModel } = models;

	if (!preProcessDoc) {
		return getInitialDataHolder(dh, document, formModel);
	}

	const preProcessingResult = preProcessDocument({
		document,
		isNewInstance,
		models: {
			formModel,
			documentModel,
			validatorProvider
		},
		now
	});

	const hasPreProcessingErrors = preProcessingResult.messages !== undefined;

	if (hasPreProcessingErrors) {
		const errorMessage = Object.entries(preProcessingResult.messages)
			.map(([key, value]) => `${key}: ${value}`)
			.join("; ");
		return {
			...dh,
			loadingState: "error",
			busy: false,
			error: {
				errorCode: "INTERNAL_CLIENT_ERROR",
				message: errorMessage
			}
		};
	}

	return getInitialDataHolder(dh, preProcessingResult.document, formModel);
}

function getInitialDataHolder(
	dh: Activity.DataHolder,
	document: GroupInstance,
	formModel: FormModel
): Activity.DataHolder {
	const initialUiState = createUIState({
		screenLocation: [
			{
				locationPath: [{ elementName: formModel.content.screens[0].name }],
				path: []
			}
		]
	});

	return {
		...dh,
		dirty: false,
		busy: false,
		loadingState: "loaded",
		data: { document },
		slices: { ...dh.slices, uiState: initialUiState }
	};
}
