// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";

import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-range.api.js";

import type { FilterParseError } from "../../../../../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../../../../../models/index.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import type { Value } from "../../../../../utilities/value.js";

interface Common {
	readonly id: string;
	readonly renderOptions: FormModelMap.RenderOptions;
	readonly disabled: boolean;
	readonly label: string;

	readonly datePickerConfig?: FormModel.DatePickerConfig;
}

/** @internal */
export interface FilterBaseProps extends Common {
	readonly path: EntityInstancePath;

	readonly filter?: {
		readonly ui: string;
		readonly data: string | number | boolean | object | Date | null;
	};
	readonly message?: FilterParseError;
}

/**
 * The filter selection callback always expects a js Date, with the
 * exception of the DateRange filer, which needs a `DateRange` object instead.
 * @internal
 */
export interface DateFilterProps<T extends Date | DateRange = Date> extends Common {
	readonly value: Value;
	readonly dataType?: DocumentModel.DateType | DocumentModel.DateRangeType;
	readonly errorMessage?: ReactElement;
	onFilterTyped(value: string): void;
	onFilterSelected(value: T): void;
}
