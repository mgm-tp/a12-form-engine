// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore } from "../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../models/index.js";
import { DocumentPath } from "../../models/internal/utils/document-utils.js";

export function createValidationEntryWithParsingError(
	path: EntityInstancePath,
	value: string,
	type: keyof ParsingErrorDetailMap
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	return {
		[DocumentPath.toString(path)]: {
			validationMessages: [],
			parseError: createParsingError(path, value, type)
		}
	};
}

export function createParsingError(
	path: EntityInstancePath,
	value: string,
	type: keyof ParsingErrorDetailMap
): EngineStore.Validation.ParseError {
	return {
		value,
		message: {
			element: path,
			...map[type],
			severity: "ERROR",
			referencedFields: [path]
		}
	};
}

export function createValidationMessage(options: {
	readonly path: EntityInstancePath;
	readonly errorText?: Localizable[];
	readonly errorCode?: string;
	readonly errorKey?: string;
	readonly type?: EngineStore.Validation.MessageSeverity;
	readonly referencedFields?: EntityInstancePath[];
}): EngineStore.Validation.Message {
	return {
		element: options.path,
		errorCode: options.errorCode ?? "MessageCode",
		errorKey: options.errorKey ?? "MessageKey",
		errorText: options.errorText ?? [],
		severity: options.type ?? "ERROR",
		referencedFields: options.referencedFields ?? [options.path]
	};
}

export function createValidationEntry(options: {
	readonly path: EntityInstancePath;
	readonly errorText?: Localizable[];
	readonly errorCode?: string;
	readonly errorKey?: string;
	readonly type?: EngineStore.Validation.MessageSeverity;
	readonly referencedFields?: EntityInstancePath[];
}): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	return {
		[DocumentPath.toString(options.path)]: {
			validationMessages: [createValidationMessage(options)]
		}
	};
}

interface ParsingErrorDetailMap {
	readonly numberContainsIllegalSymbols: {
		readonly errorText: Localizable[];
		readonly errorCode: string;
		readonly errorKey: string;
	};
}

const map: ParsingErrorDetailMap = {
	numberContainsIllegalSymbols: {
		errorText: [
			{ key: "numberContainsIllegalSymbols", defaults: { en: "The value must be integer." } }
		],
		errorCode: "zahlHatUngueltigeZeichen",
		errorKey: "formalePruefung"
	}
};
