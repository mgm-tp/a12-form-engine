// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DataReference, ParseError } from "@com.mgmtp.a12.client/client-data";
import { DocumentPath, KernelMessage } from "@com.mgmtp.a12.client/client-data";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { ValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/conversion.js";

export function getMockMessage(options?: Partial<Message>): Message {
	return {
		errorCode: "",
		errorText: [{ key: "test.key" }],
		severity: "ERROR",
		messageType: "VALUE_ERROR",
		entityInstance: options?.entityInstance ?? DocumentPath.fromString(""),
		referencedFields: options?.referencedFields ?? [],
		rulePath: "/test/rule",
		refOmissionErrorResponsible: [],
		...options
	};
}

export function mockConversionError(): ValueConversion.ParseError {
	return {
		errorCode: "",
		errorKey: "",
		errorText: { key: "" },
		severity: "ERROR" as const
	};
}

export function mockParseError(
	conversionError: ValueConversion.ParseError,
	dataReference: DataReference,
	errorValue: string
): ParseError {
	return {
		message: getMockMessage({
			errorCode: conversionError.errorCode,
			errorText: [conversionError.errorText],
			entityInstance: DocumentPath.fromString(dataReference),
			referencedFields: [DocumentPath.fromString(dataReference)],
			rulePath: KernelMessage.FORMAL_VALIDATION
		}),
		value: errorValue
	};
}
