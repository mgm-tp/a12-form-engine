// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { fireEvent } from "@testing-library/react";
import { act } from "react";

import { assertObjectType } from "../../client-extensions/internal/core/assertion.js";

/**
 * Convenience function to simulate a click on an HTMLElement.
 *
 * fireEvent.click does not set the focus. Therefore it is set manually.
 *
 * Also catches missing elements (you can pass the result of querySelector).
 */
export async function click(element: Element | null): Promise<void> {
	assertObjectType(element, e => e instanceof HTMLElement);
	element.focus();
	act(() => fireEvent.click(element));
}
