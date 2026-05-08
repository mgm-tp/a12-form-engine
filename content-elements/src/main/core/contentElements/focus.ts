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

import { useContext, useEffect, type RefObject } from "react";

import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { FunctionMapContext } from "./functionMap/functionMapContext.js";

/** @internal */
export function useFocus(options: {
	uiId: string;
	dataReference: string;
	ref: RefObject<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>;
	messages: Message[];
}) {
	const { uiId, dataReference, ref, messages } = options;

	const { useFocusField, useFocusFirstError, useFocusInput } = useContext(FunctionMapContext);

	useFocusInput(uiId, ref);
	useFocusFirstError(
		messages.some(m => m.severity === "ERROR"),
		ref
	);
	useFocusField(dataReference, ref);
}

const FOCUS_INPUT_EVENT_NAME = "focus-input";

export function useFocusInput(
	uiId: string,
	inputRef: RefObject<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>
) {
	useEffect(() => {
		const ref = inputRef.current;

		const eventListener = handleFocusEvent(uiId, ref);

		document.addEventListener(FOCUS_INPUT_EVENT_NAME, eventListener);

		return () => {
			document.removeEventListener(FOCUS_INPUT_EVENT_NAME, eventListener);
		};
	}, [uiId, inputRef]);
}

function handleFocusEvent(
	uiId: string,
	ref: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
) {
	return (e: Event) => {
		if (isCustomEvent(e) && e.detail === uiId) {
			ref?.focus();
			// if there are multiple input fields for one data field, this makes sure that the first input field gets focused.
			e.stopImmediatePropagation();
		}
	};
}

export function publishFocusInputEvent(uiId: string) {
	const event = new CustomEvent(FOCUS_INPUT_EVENT_NAME, { detail: uiId });
	document.dispatchEvent(event);
}

function isCustomEvent(event: Event): event is CustomEvent {
	return "detail" in event;
}
