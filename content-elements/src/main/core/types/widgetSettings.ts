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
 * 1. Open-Source License - EUPL v1.2
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
