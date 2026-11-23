// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { RefObject } from "react";
import { createContext, useContext } from "react";

/** @internal */
export const InputRefContext = createContext<RefObject<HTMLElement | null> | null>(null);

/** @internal */
export function useInputRef(
	controlId: string,
	initiallyFocusedElementId: string | undefined
): RefObject<HTMLElement | null> | undefined {
	const inputRef = useContext(InputRefContext);
	if (initiallyFocusedElementId) {
		if (inputRef === null) {
			throw new Error("useInputRef must be used within an InputRefProvider");
		}

		return controlId === initiallyFocusedElementId ? inputRef : undefined;
	}

	return undefined;
}
