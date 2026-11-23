// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { actionCreatorFactory } from "typescript-fsa";

import type { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { UploadError, UploadResults } from "./attachmentState.js";

const factory = actionCreatorFactory("Attachments");

/**
 * @internal
 */
export const resetUnassigned = factory<ActivityActions.ActivityActionPayload>("RESET_UNASSIGNED");

/**
 * @internal
 */
export const uploadDone = factory<UploadDonePayload>("UPLOAD_DONE");

/** @internal */
export interface UploadDonePayload extends ActivityActions.ActivityActionPayload {
	readonly attachments: UploadResults["successes"];
	readonly errors: UploadError[];
	readonly pathToRepeatGroup?: EntityInstancePath;
}
