// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { DefaultSelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";
import type { SelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";

/**
 * The necessary customization to make embedded attachments work
 *
 * The default selector looks up thumbnails by id, which do not exist when embedding.
 * Instead, the attachment is stored as a data uri which can be used directly as the image source.
 */
export const CustomSelectorMap: SelectorMap = {
	...DefaultSelectorMap,
	attachmentThumbnail(attachment) {
		return state =>
			attachment.content?.startsWith("data:image/")
				? attachment.content
				: DefaultSelectorMap.attachmentThumbnail(attachment)(state);
	}
};
