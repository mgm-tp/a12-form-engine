// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
