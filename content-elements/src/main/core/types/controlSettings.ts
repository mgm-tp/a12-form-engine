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

import type { DataReference } from "@com.mgmtp.a12.client/client-data/lib/core/api/data-reference.js";
import type { KernelTypes } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/types.js";
import type {
	DocumentModel,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { ValueConversionConfig } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { DatePickerConfig } from "./controlProps.js";

// TODO: internal? => useCommonControlSettings is currently used in EEP
export interface BaseControlSettings {
	readonly uiIdPrefix?: string;
	readonly uiId: string;
	readonly value: KernelTypes.Value;
	readonly formattedValue?: string;
	readonly messageGroupId?: string;
	readonly groupedValidationMessages: Message[];
	readonly ungroupedValidationMessages: Message[];
	readonly required?: boolean;
	readonly readonly?: boolean;
	readonly notRelevant?: boolean;
	readonly label?: string;
	readonly hideLabel?: true;
	readonly hint?: string;
	readonly helperText?: string;

	readonly showMessagesAsTooltip?: boolean;
	readonly tooltipsOnTop?: true;

	// TODO: add inputRef for initiallyFocusedElement?
	readonly dmElement: DocumentModel.Element;
	readonly conversionConfig?: ValueConversionConfig;
	readonly dataReference: DataReference;

	/**
	 * Only relevant for some controls. These props are still listed
	 * here to be able to use this typing in useCommonControlSettings.
	 */
	readonly placeholder?: string;
	readonly autoComplete?: string;
	readonly autoExpand?: true;
	readonly secret?: true;
	readonly suffix?: string;
	readonly truncateSuffix?: true;
	readonly uncheckedLabel?: string;
	readonly checkedLabel?: string;
	readonly timeZone?: string;
	readonly datePickerConfig?: DatePickerConfig;
	readonly enableSelectAll?: true;
	readonly inline?: true;
}
