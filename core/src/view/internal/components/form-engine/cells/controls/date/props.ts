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
