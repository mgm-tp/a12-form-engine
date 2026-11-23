// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { AttachmentWithThumbnail } from "./attachmentLoader/AttachmentLoader.js";

/**@internal */
export interface UploadResults {
	readonly successes: AttachmentWithThumbnail[];
	readonly failures: UploadError[];
}

/**@internal */
export interface UploadError {
	readonly error: Localizable;
	readonly path: EntityInstancePath;
}

/**
 * Name of the slice that will be added to the default DH when handling attachments
 * @internal
 */
export const ATTACHMENT_STATE_SLICE = "attachmentState";
