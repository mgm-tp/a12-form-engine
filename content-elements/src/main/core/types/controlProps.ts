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

import type { Annotation } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

export type MessageExpositionEnum = "TOOLTIP";

export type MarkingOfRequiredFields = "NONE" | "REQUIRED" | "ALWAYS";

export interface DatePickerConfig {
	readonly minYear?: number;
	readonly maxYear?: number;
	readonly absolute?: boolean;
	readonly preselectionYear?: number;
}

export interface BaseControlProps {
	readonly elementId: string;
	readonly label?: LocalizedModelText;
	readonly hideLabel?: true;
	readonly hint?: LocalizedModelText;
	readonly readonly?: true;
	readonly messageExposition?: MessageExpositionEnum;
	readonly tooltipsOnTop?: true;
	readonly markingOfRequiredFields?: MarkingOfRequiredFields;
	readonly annotations?: Annotation[];

	/**
	 * Only relevant for some controls. These props are still listed
	 * here to be able to use this typing in useCommonControlSettings.
	 *
	 * TODO: Should all of these properties really stay here? If so, we
	 * should probably rename the interface, because it contains ALL
	 * control props and not just basic control props.
	 */
	readonly placeholder?: LocalizedModelText;
	readonly autoComplete?: string;
	readonly autoExpand?: true;
	readonly secret?: true;
	// TODO: Should we add an amountSuffix on Control level?
	readonly suffix?: LocalizedModelText;
	readonly truncateSuffix?: true;
	readonly uncheckedLabel?: LocalizedModelText;
	readonly checkedLabel?: LocalizedModelText;
	readonly datePickerConfig?: DatePickerConfig;
	readonly enableSelectAll?: true;
	readonly inline?: true;
}
