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

import { deepStrictEqual, fail, strictEqual } from "node:assert/strict";

import type { AnyAction } from "redux";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { Commands } from "../../back-end/store/index.js";
import { DocumentPath } from "../../models/internal/utils/document-utils.js";

import type { RtlRenderWrapper } from "../rtl-utils/render-wrapper.js";

export function validateSetErrorMessageStateAction(
	action: AnyAction,
	errorMessagePath: EntityInstancePath
): void {
	if (Commands.setMessageState.match(action)) {
		const messages = action.payload.messages;
		const errorMessage = messages[DocumentPath.toString(errorMessagePath)];
		if (errorMessage === undefined) {
			fail("Expected to find an error message for " + errorMessagePath);
		} else if (errorMessage.validationMessages.length > 0) {
			deepStrictEqual(errorMessage.validationMessages[0].element, errorMessagePath);
		} else if (errorMessage.parseError) {
			deepStrictEqual(errorMessage.parseError.message.element, errorMessagePath);
		}
	} else {
		fail("Expected that dispatch gets called first with Commands.setMessageState");
	}
}

function findElementById(wrapper: RtlRenderWrapper, id: string, element?: string) {
	return wrapper.baseElement.querySelectorAll(`*[id="${id}"]`);
}

export function assertUniqueId(params: {
	wrapper: RtlRenderWrapper;
	element?: string;
	id: string;
	assertions?: "GROUP"[];
}) {
	const { wrapper, element, id, assertions } = params;

	const htmlElement = findElementById(wrapper, id, element);
	strictEqual(htmlElement.length, 1, `Cannot find element with id ${id} `);

	if (assertions && assertions.indexOf("GROUP") > -1) {
		const groupElement = findElementById(wrapper, `${id}-group`, "div");
		strictEqual(groupElement.length, 1, `Cannot find group div element with id ${id}-group `);
	}
}

/**
 * Throw runtime error if given value is null or undefined. Also assert TSC
 * that the value of T is not null or undefined.
 */
export function assertExists<T>(
	value: T,
	message = "Expected value to exist"
): asserts value is NonNullable<T> {
	if (value === null || value === undefined) {
		throw new Error(message);
	}
}
