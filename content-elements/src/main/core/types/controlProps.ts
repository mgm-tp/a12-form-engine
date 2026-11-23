// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
