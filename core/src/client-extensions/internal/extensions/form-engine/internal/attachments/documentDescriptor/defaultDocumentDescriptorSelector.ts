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

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core";

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
