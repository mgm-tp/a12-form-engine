// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	RequestFilter,
	RequestFilterPayload,
	RequestFilterResult
} from "@com.mgmtp.a12.utils/utils-connector/lib/main/index.js";

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
