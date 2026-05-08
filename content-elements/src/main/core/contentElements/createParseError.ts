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

import { KernelMessage } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/message.js";
import type { ParseError } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/types.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/conversion.js";

/** @internal */
export function createParseError(
	parseError: ValueConversion.ParseError,
	documentPath: EntityInstancePath,
	errorValue: string
): ParseError {
	return {
		message: {
			errorCode: parseError.errorCode,
			errorText: [parseError.errorText],
			severity: "ERROR",
			messageType: "VALUE_ERROR",
			entityInstance: documentPath,
			referencedFields: [documentPath],
			rulePath: KernelMessage.FORMAL_VALIDATION,
			refOmissionErrorResponsible: []
		},
		value: errorValue
	};
}
