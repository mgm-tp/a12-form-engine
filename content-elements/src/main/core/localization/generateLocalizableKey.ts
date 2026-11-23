// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { addDotEscaping } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

/**
 * @internal
 *
 * TODO: We need to decide whether localizable keys should contain IDs or paths.
 * The Form Engine used paths and Document Model keys still use paths (see
 * DocumentModelKeyFactory).
 * This is also relevant for future migration of projects, that use custom
 * localization resources.
 */
export function generateLocalizableKey(modelId: string, elementId: string, suffix: string): string {
	return `${addDotEscaping(modelId)}.${addDotEscaping(elementId)}.${addDotEscaping(suffix)}`;
}
