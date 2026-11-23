// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DropdownItemProps } from "@com.mgmtp.a12.contentengine/contentengine-editor";

/** @internal */
export const messageExpositionItems: DropdownItemProps[] = [
	{ value: "DEFAULT", label: "Default" },
	{ value: "TOOLTIP", label: "Show validation messages as a tooltip" }
];

/** @internal */
export const markingOfRequiredFieldsItems: DropdownItemProps[] = [
	{ value: "REQUIRED", label: "If required" },
	{ value: "NONE", label: "Never" },
	{ value: "ALWAYS", label: "Always" }
];
