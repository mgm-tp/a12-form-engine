// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";

/** @internal */
export const DEFAULT_ARIA_LEVEL = 1;

/**
 * This context is used to propagate an aria-level for headings.
 * It is recommended to be used in custom components which render a heading to structure the form.
 * If a heading is rendered it should get the aria-lavel from the Consumer.
 * If the custom component can have children which could render a structuring heading themselves,
 * the children should be wrapped with a Provider providing an increased by 1 aria-level.
 */
export const AriaLevelContext = createContext<AriaLevelContextType>({
	ariaLevel: DEFAULT_ARIA_LEVEL
});
AriaLevelContext.displayName = "AriaLevelContext";

export interface AriaLevelContextType {
	readonly ariaLevel: number;
}
