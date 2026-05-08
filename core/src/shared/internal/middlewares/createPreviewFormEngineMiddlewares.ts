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

import type { MiddlewareOptions } from "../../../back-end/store/index.js";
import {
	createDefaultMiddlewareOptions,
	createEngineMiddlewares
} from "../../../back-end/store/index.js";
import { engineMiddlewareAdapterFactory } from "../../../client-extensions/internal/extensions/form-engine/internal/engineMiddlewareAdapterFactory.js";

import { nowProvider, previewEngineStateSelector } from "../nowValue.js";

import { notifyDocumentSaveMiddleware } from "./notifyDocumentSaveMiddleware.js";
import { notifyEventButtonClickedMiddleware } from "./notifyEventButtonClickedMiddleware.js";
import { notifyRowActionClickedMiddleware } from "./notifyRowActionClickedMiddleware.js";
import { createRecomputePreviewDataMiddleware } from "./recomputeMiddleware.js";
import { replaceActivityMiddleware } from "./replaceActivityMiddleware.js";

export function createPreviewFormEngineMiddlewares(middlewareOptions?: Partial<MiddlewareOptions>) {
	return [
		adaptFormEngineToPreviewState(middlewareOptions),
		notifyEventButtonClickedMiddleware,
		notifyRowActionClickedMiddleware,
		notifyDocumentSaveMiddleware,
		createRecomputePreviewDataMiddleware({
			...createDefaultMiddlewareOptions(middlewareOptions),
			nowProvider
		}),
		replaceActivityMiddleware
	];
}

function adaptFormEngineToPreviewState(middlewareOptions?: Partial<MiddlewareOptions>) {
	return engineMiddlewareAdapterFactory(
		createEngineMiddlewares({ ...middlewareOptions, nowProvider }),
		previewEngineStateSelector
	);
}
