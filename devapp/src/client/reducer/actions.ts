// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { actionCreatorFactory } from "typescript-fsa";

import type { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import type { EmptyDocumentDataProviderOptions } from "../backend/mock/mockCreateEmptyDataProvider.js";

const factory = actionCreatorFactory("DEVAPP_PREVIEW");

export interface NewDocumentRequestedPayload extends ActivityActions.ActivityActionPayload {
	readonly options?: EmptyDocumentDataProviderOptions;
	readonly preComputeNewDocuments?: boolean;
}

export const newDocumentRequested = factory<NewDocumentRequestedPayload>("NEW_DOCUMENT_REQUESTED");

export interface ExistingDocumentRequestedPayload extends ActivityActions.ActivityActionPayload {
	readonly loadedDocument: object;
}
export const existingDocumentRequested = factory<ExistingDocumentRequestedPayload>(
	"EXISTING_DOCUMENT_REQUESTED"
);
