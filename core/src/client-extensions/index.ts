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

export * from "./internal/core/index.js";
export {
	computeDocument,
	createEmptyDocumentDataProvider,
	createFormEngineMiddlewares,
	FormEngineActions,
	formEngineDataReducers,
	formEngineSagas,
	FormEngineSelectors,
	FormEngineStateAdapter,
	FormEngineViews,
	platformAttachmentLoader,
	preProcessDocument
} from "./internal/extensions/form-engine/index.js";
export type {
	AttachmentFile,
	AttachmentLoader,
	AttachmentWithThumbnail,
	DocumentDescriptor,
	DuplicateStrategy,
	EmptyDocumentDataProviderOptions,
	ExistingFile,
	FormEngineSagaOptions,
	PreProcessDocumentParams,
	PreProcessDocumentResult
} from "./internal/extensions/form-engine/index.js";
export { FormModelProcessor } from "./internal/extensions/http-connectors/index.js";
export {
	createPlatformSingleDocumentDataProvider,
	platformSingleDocumentDataProvider,
	type PlatformSingleDocumentDataProviderOptions
} from "./internal/extensions/platform-server-connectors/index.js";

export { DefaultRequestSelectorMap } from "./internal/extensions/platform-server-connectors/internal/providers/DefaultRequestSelectorMap.js";
export type { RequestSelectorMap } from "./internal/extensions/platform-server-connectors/internal/providers/RequestSelectorMap.js";
