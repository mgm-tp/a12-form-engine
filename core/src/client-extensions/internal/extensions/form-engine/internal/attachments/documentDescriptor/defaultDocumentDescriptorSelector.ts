// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import { FormActivity } from "../../../../../core/activity/internal/activity.js";
import { assertCondition } from "../../../../../core/assertion.js";

import type { DocumentDescriptor } from "./DocumentDescriptor.js";

/**
 * @internal
 *
 * Assumes a default form engine setup, meaning:
 * - the document lies in the default dataholder directly
 * - the document includes the metadata directly (via `id` and `modelId` properties)
 */
export function defaultDocumentDescriptorSelector(
	state: object,
	activityId: string
): DocumentDescriptor {
	const data = ActivitySelectors.data(activityId)(state);
	assertCondition(
		FormActivity.Data.SingleDocumentData.isInstance(data),
		`Expected data of activity ${activityId} to contain an A12 document`
	);

	return {
		documentId: data.document.id,
		documentModelName: data.document.modelId
	};
}
