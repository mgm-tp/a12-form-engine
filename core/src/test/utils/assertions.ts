// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
