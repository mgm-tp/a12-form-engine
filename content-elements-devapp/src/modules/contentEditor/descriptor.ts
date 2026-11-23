// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ContentEditorDataHolder } from "@com.mgmtp.a12.contentengine/contentengine-editor";

export interface EditorDescriptor extends ContentEditorDataHolder.Descriptor {
	readonly contentModelName: string;
}

export function isEditorDescriptor(
	descriptor: Activity.Descriptor
): descriptor is EditorDescriptor {
	return (
		ContentEditorDataHolder.Descriptor.isAssignableFrom(descriptor) &&
		"contentModelName" in descriptor &&
		descriptor.contentModelName !== undefined
	);
}
