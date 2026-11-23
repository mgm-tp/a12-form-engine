// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { AnyAction } from "typescript-fsa";

import { isObjectEmpty } from "../../../../../../../back-end/utils/internal/guards.js";

import { uploadDone } from "../actions.js";

/**
 * Updates the thumbnail slice after attachments were uploaded and new thumbnail urls exist
 *
 * @internal
 */
export function reduceThumbnails(
	state: Record<string, string> | undefined,
	action: AnyAction
): Record<string, string> | undefined {
	const newThumbnails = uploadDone.match(action)
		? action.payload.attachments.reduce(
				(thumbnails, { attachment_id, thumbnail }) => {
					return attachment_id && thumbnail
						? { ...thumbnails, [attachment_id]: thumbnail }
						: thumbnails;
				},
				{} as Record<string, string>
			)
		: undefined;

	return newThumbnails && !isObjectEmpty(newThumbnails) ? { ...state, ...newThumbnails } : state;
}
