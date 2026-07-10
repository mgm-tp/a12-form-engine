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

import type {
	RequestFilter,
	RequestFilterPayload,
	RequestFilterResult
} from "@com.mgmtp.a12.utils/utils-connector";

/**
 * This class stores a JWT token and adds it to every server request.
 */
export class JwtTokenFilter implements RequestFilter {
	public jwtToken?: string | null;

	doRequestFilter({ request }: RequestFilterPayload): RequestFilterResult {
		if (this.jwtToken) {
			const headers = request.headers ?? new Headers();
			const headerKey = "Authorization";
			const headerValue = `UAABearer ${this.jwtToken}`;

			if (headers instanceof Headers) {
				headers.append(headerKey, headerValue);
			} else if (Array.isArray(headers)) {
				headers.push([headerKey, headerValue]);
			}
			request.headers = headers;
		}
		return {
			request,
			continue: true
		};
	}

	canHandleRequest(): boolean {
		return true;
	}
}
