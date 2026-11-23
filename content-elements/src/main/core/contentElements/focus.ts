// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext, useEffect } from "react";
import type { RefObject } from "react";

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
