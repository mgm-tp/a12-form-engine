// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export namespace ATTACHMENT {
	export const ID_ATTACHMENT = "a12-attachment-G3";
	export const ID_ATTACHMENT_PLACEHOLDER_ICON = "a12-attachmentForPlaceholderIcon-group_a6da2";
	export const ID_ATTACHMENT_ACCEPT = "a12-attachmentForAccept-group_d6c2c";
	export const ID_ATTACHMENT_COMPACT = "a12-attachment-G3-3";
	export const ID_IR_ATTACHMENT = "a12-fieldbasedrepeatoverviewcolumn-b04ba-cell-0";
	export const ID_IR_ATTACHMENT_THUMBNAIL_OR_ICON =
		"a12-fieldbasedrepeatoverviewcolumn-f63b0-cell-0";
	export const ID_IR_ATTACHMENT_COMPACT = "a12-fieldbasedrepeatoverviewcolumn-29680-cell-0";
	export const ID_DR_ATTACHMENT = "a12-fieldbasedrepeatoverviewcolumn-5a88d-cell-0";
	export const ID_DR_ATTACHMENT_PLACEHOLDER_ICON =
		"a12-fieldbasedrepeatoverviewcolumn-9fed0-bodycell-0";
	export const ID_DR_ATTACHMENT_ACCEPT = "a12-fieldbasedrepeatoverviewcolumn-9af51-bodycell-0";
	export const ID_DR_ATTACHMENT_COMPACT = "a12-fieldbasedrepeatoverviewcolumn-9e114-bodycell-0";

	export const ID_IR_MULTI_FILE_UPLOAD_ATTACHMENT =
		"a12-fieldbasedrepeatoverviewcolumn-7c7ec-cell-0";

	export function createDocumentForAttachment(values: {
		repeatableGroup?: GroupInstance[];
	}): GroupInstance {
		return {
			root: {
				...(values.repeatableGroup ? { repeat: values.repeatableGroup } : {})
			}
		};
	}
}
