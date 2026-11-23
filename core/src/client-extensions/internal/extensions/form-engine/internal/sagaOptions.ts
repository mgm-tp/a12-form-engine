// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { AttachmentLoader } from "./attachments/attachmentLoader/AttachmentLoader.js";
import type { DocumentDescriptor } from "./attachments/documentDescriptor/DocumentDescriptor.js";

/**
 * Configuration options for the default form engine sagas
 */
export interface FormEngineSagaOptions {
	/**
	 * Specifies how to handle up- and download of attachments
	 * NOTE: Required when using attachments in forms!
	 */
	readonly attachmentLoader?: AttachmentLoader;
	/**
	 * Selector that extracts a {@link DocumentDescriptor} for the element specified by `documentPath` from a given activity.
	 *
	 * By default, the default dataholder of the given activity is searched for the necessary information
	 * (meaning it is assumed that the `data` property of that dataholder is of type `Activity.Data.Document`).
	 */
	readonly documentDescriptorSelector?: (
		state: object,
		activityId: string,
		documentPath: EntityInstancePath
	) => DocumentDescriptor;
}
