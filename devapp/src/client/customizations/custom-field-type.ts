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
 * 1. Open-Source License - EUPL v1.2
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

import type { Endomorphism } from "fp-ts/lib/Endomorphism.js";

import type { KernelOptionsProvider } from "@com.mgmtp.a12.formengine/formengine-core";
import type {
	ICustomFieldTypeCheckError,
	ICustomFieldTypeConversionResult,
	ICustomFieldTypeFactory,
	ICustomFieldValidator
} from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";

const EMAIL_REGEXP =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const eMailCustomFieldType: ICustomFieldValidator = {
	validate(value: string): ICustomFieldTypeCheckError | undefined {
		if (!EMAIL_REGEXP.test(value)) {
			return new DevappFieldTypeCheckError("InvalidEMail", {
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
		return new DevappFieldTypeConversionResult(displayValue);
	},
	convertInternal2Display(internalValue: string): ICustomFieldTypeConversionResult {
		return new DevappFieldTypeConversionResult(internalValue);
	}
};

class DevappFieldTypeCheckError implements ICustomFieldTypeCheckError {
	private _errorKey: string;
	private _errorLocalizable: Localizable;

	constructor(errorKey: string, errorLocalizable: Localizable) {
		this._errorKey = errorKey;
		this._errorLocalizable = errorLocalizable;
	}
	getErrorMessage(): Localizable[] {
		return [this._errorLocalizable];
	}
	getErrorKey(): string {
		return this._errorKey;
	}
}

class DevappFieldTypeConversionResult implements ICustomFieldTypeConversionResult {
	private _value: string;

	constructor(value: string) {
		this._value = value;
	}
	getConvertedValue(): string {
		return this._value;
	}
	getErrorMessage(): string | undefined {
		return undefined;
	}
}

const devappFieldTypeFactory: ICustomFieldTypeFactory = {
	createCustomFieldType(customFieldTypeName: string): ICustomFieldValidator | null {
		if (customFieldTypeName === "DevApp_EMail") {
			return eMailCustomFieldType;
		}
		return null;
	}
};

export const withDevappFieldTypeFactory: Endomorphism<KernelOptionsProvider> =
	kernelOptionsProvider => state => {
		const kernelOptions = kernelOptionsProvider(state);
		return {
			...kernelOptions,
			customFieldTypeFactory: devappFieldTypeFactory
		};
	};
