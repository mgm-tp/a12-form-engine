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

import type { Activity } from "@com.mgmtp.a12.client/client-core";
import type {
	FormModel,
	PreProcessDocumentParams
} from "@com.mgmtp.a12.formengine/formengine-core";
import { createUIState, preProcessDocument } from "@com.mgmtp.a12.formengine/formengine-core";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

/** @internal */
export function createInitialDocumentDataHolder(
	dh: Activity.DataHolder,
	preProcessDoc: boolean,
	params: PreProcessDocumentParams
): Activity.DataHolder {
	const { document, models, kernelOptions, isNewInstance } = params;
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
		kernelOptions
	});

	const hasPreProcessingErrors = preProcessingResult.messages !== undefined;

	if (hasPreProcessingErrors) {
		return {
			...dh,
			loadingState: "error",
			busy: false,
			error: {
				errorCode: "VALIDATION_ERROR",
				validationMessages: preProcessingResult.messages
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
