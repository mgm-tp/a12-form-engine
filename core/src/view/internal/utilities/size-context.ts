// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-detector.api.js";

/** @internal */
export function isOnSmallDevice(size?: SizeDetectorProps.Size): boolean {
	return size === "xs" || size === "sm";
}
