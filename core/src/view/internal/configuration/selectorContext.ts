// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";

import { DataSelectors } from "../../../back-end/store/internal/selectors/data.js";
import type { Selector } from "../../../back-end/store/internal/selectors/selectors.js";

/**
 * @experimental
 * Map of FE selectors that can be customized.
 *
 * Note that this map will only be expanded as needed
 */
export interface SelectorMap {
	/**
	 * Selects the thumbnail for a given attachment.
	 */
	readonly attachmentThumbnail: (attachment: Attachment) => Selector<string | undefined>;
}

/**
 * @experimental
 * Default FE Selectors, must be spread when customizing
 */
export const DefaultSelectorMap: SelectorMap = {
	attachmentThumbnail: DataSelectors.Attachments.thumbnail
};

/** @internal */
export const SelectorContext = createContext<SelectorMap>(DefaultSelectorMap);
