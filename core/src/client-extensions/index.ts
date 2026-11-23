// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
