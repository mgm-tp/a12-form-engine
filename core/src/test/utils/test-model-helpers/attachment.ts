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
 * 1. Open-Source License – EUPL v1.2
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
