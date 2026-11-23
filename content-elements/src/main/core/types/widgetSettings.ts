// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { KernelTypes } from "@com.mgmtp.a12.client/client-data";

// TODO: internal? => useCommonWidgetSettings is currently used in EEP
export interface BaseWidgetSettings {
	readonly value: KernelTypes.Value;
	readonly formattedValue?: string;
	readonly error?: boolean;
	readonly warning?: boolean;
	readonly info?: boolean;
	readonly errors?: React.ReactNode;
	readonly warnings?: React.ReactNode;
	readonly infos?: React.ReactNode;
	readonly readonly?: boolean;
	readonly label?: React.ReactNode;
	readonly hideLabel?: boolean;
	readonly helperText?: string;
	readonly tooltips?: React.ReactNode;
	readonly tooltipsOnTop?: boolean;
	readonly suffixes?: React.ReactNode;
	readonly uncheckedLabel?: string;
	readonly checkedLabel?: string;
	readonly inputProps?: { "aria-required"?: boolean; autoComplete?: string; type?: string };
	readonly ariaDescribedBy: string[];
	readonly inline?: boolean;
}
