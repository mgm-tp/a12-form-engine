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
