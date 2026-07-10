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

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core";
import type { Activity, Selector } from "@com.mgmtp.a12.client/client-core";
import type {
	CheckUniquenessViolation,
	JsonRpc2UniqueConstraintErrorResponse
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";

import { isRecord } from "../../../core/utils.js";

/** @internal */
export const UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE = "UNIQUE_CONSTRAINT_VIOLATION";

/** @internal */
export interface UniqueConstraintError extends Activity.Error.Base {
	readonly errorCode: typeof UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE;
	readonly messages: Localizable[];
}

/** @internal */
export const UniqueConstraintError = {
	isInstance(error: unknown): error is UniqueConstraintError {
		return (
			isRecord(error) &&
			error.errorCode === UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE &&
			Array.isArray(error.messages)
		);
	},

	fromViolations(violations: CheckUniquenessViolation[]): UniqueConstraintError {
		return {
			errorCode: UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE,
			messages: violations.map(v => {
				return {
					key: v.errorKey,
					defaults: v.errorMessage
				};
			})
		};
	},

	fromException(
		error: JsonRpc2UniqueConstraintErrorResponse,
		fallbackLanguage: string
	): UniqueConstraintError {
		return {
			errorCode: UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE,
			messages: [
				{
					key: error.error.data.description.key,
					// in error cases, the server already localized the message
					// also, only the first one is reported
					defaults: { [fallbackLanguage]: error.error.data.description.default }
				}
			]
		};
	},

	select(activityId: string | undefined): Selector<UniqueConstraintError | undefined> {
		return state => {
			if (!activityId) {
				return undefined;
			}

			const error = ActivitySelectors.error(activityId)(state);

			return UniqueConstraintError.isInstance(error) ? error : undefined;
		};
	}
};
