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
