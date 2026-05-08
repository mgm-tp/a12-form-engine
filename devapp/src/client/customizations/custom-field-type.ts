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

import type { ICustomFieldType } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/custom/ICustomFieldType.js";
import type { ICustomFieldTypeCheckError } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/custom/ICustomFieldTypeCheckError.js";
import type { ICustomFieldTypeConversionResult } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/custom/ICustomFieldTypeConversionResult.js";
import type { ICustomFieldTypeFactory } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/custom/ICustomFieldTypeFactory.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/localization/Localizable.js";

const EMAIL_REGEXP =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// TODO: will be fixed with A12-16990
// eslint-disable-next-line @typescript-eslint/no-deprecated
const eMailCustomFieldType: ICustomFieldType = {
	validate(value: string): ICustomFieldTypeCheckError | undefined {
		if (!EMAIL_REGEXP.test(value)) {
			return new CustomFieldTypeCheckError("InvalidEMail", {
				key: "InvalidEMail",
				defaults: {
					en: "Please enter a valid e-mail address.",
					de: "Bitte geben Sie eine gültige E-Mail-Adresse ein."
				}
			});
		}
		return undefined;
	},
	convertDisplay2Internal(displayValue: string): ICustomFieldTypeConversionResult {
		return new CustomFieldTypeConversionResult(displayValue);
	},
	convertInternal2Display(internalValue: string): ICustomFieldTypeConversionResult {
		return new CustomFieldTypeConversionResult(internalValue);
	}
};

class CustomFieldTypeCheckError implements ICustomFieldTypeCheckError {
	constructor(
		private _errorKey: string,
		private _errorLocalizable: Localizable
	) {}
	getErrorMessage(): Localizable[] {
		return [this._errorLocalizable];
	}
	getErrorKey(): string {
		return this._errorKey;
	}
}

class CustomFieldTypeConversionResult implements ICustomFieldTypeConversionResult {
	constructor(private _value: string) {}
	getConvertedValue(): string {
		return this._value;
	}
	getErrorMessage(): string | undefined {
		return undefined;
	}
}

export const customFieldTypeFactory: ICustomFieldTypeFactory = {
	// TODO: will be fixed with A12-16990
	// eslint-disable-next-line @typescript-eslint/no-deprecated
	createCustomFieldType(customFieldTypeName: string): ICustomFieldType | null {
		if (customFieldTypeName === "DevApp_EMail") {
			return eMailCustomFieldType;
		}
		return null;
	}
};
