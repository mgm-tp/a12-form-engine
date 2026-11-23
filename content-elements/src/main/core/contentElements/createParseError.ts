// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
