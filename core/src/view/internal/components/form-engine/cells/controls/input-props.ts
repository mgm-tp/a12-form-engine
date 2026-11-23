// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement, ReactNode } from "react";

/** @internal */
export interface ControlProps {
	readonly id: string;
	readonly label?: ReactElement | string;
	readonly errorMessage?: ReactElement;
	readonly warningMessage?: ReactElement;
	readonly infoMessage?: ReactElement;
	readonly readonly?: boolean;
	readonly disabled?: boolean;
	readonly addonAfter?: ReactNode;
	readonly suffixes?: ReactNode;
	readonly error?: boolean;
	readonly warning?: boolean;
	readonly info?: boolean;
	readonly hideLabel?: boolean;
	readonly truncateSuffix?: boolean;
	readonly placeholder?: string;

	readonly htmlInputProps?: {
		"aria-required"?: boolean;
		"aria-labelledby"?: string;
		"aria-label"?: string;
		autoComplete?: string;
	};
	readonly ariaDescribedby?: string;
	readonly helperText?: string;
}
