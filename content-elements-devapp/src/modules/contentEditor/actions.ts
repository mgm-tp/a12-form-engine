// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { actionCreatorFactory } from "typescript-fsa";

import type { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

const acf = actionCreatorFactory("CONTENT_EDITOR_MODULE");

export const initContentEditorSlices = acf<InitContentEditorSlicesPayload>(
	"INIT_CONTENT_EDITOR_SLICES"
);

export interface InitContentEditorSlicesPayload extends ActivityActions.ActivityActionPayload {
	readonly documentModel: DocumentModel;
	readonly contentModel: ContentModel;
}

export const dmReferenceChanged = acf<DmReferenceChangedPayload>("DM_REFERENCE_CHANGED");

export interface DmReferenceChangedPayload extends ActivityActions.ActivityActionPayload {
	readonly documentModel?: DocumentModel;
}
