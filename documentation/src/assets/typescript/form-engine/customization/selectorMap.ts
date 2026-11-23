// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::selectorMap[]
import { DefaultSelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";
import type { SelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";

/**
 * The default selector looks up thumbnails by id
 *
 * Here, we use the content property of attachments instead.
 * If it does not exist, we fall back to the default selector.
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
// end::selectorMap[]
