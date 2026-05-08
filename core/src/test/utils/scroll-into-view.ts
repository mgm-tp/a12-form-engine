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

import type { Mock } from "node:test";

export type ScrollIntoViewResult = {
	node?: HTMLElement;
	position?: ScrollLogicalPosition;
};

export function getSingleElementScrollIntoView(
	scrollIntoViewStub: Mock<Element["scrollIntoView"]>
): ScrollIntoViewResult {
	const thisValues = scrollIntoViewStub.mock.calls.map(c => c.this as HTMLElement);

	// Remove duplicates
	const [result, ...remaining] = thisValues.filter(
		(element, index, array) => array.lastIndexOf(element) === index
	);
	if (remaining.length > 0) {
		throw new Error(`Found ${thisValues.length} HTMLElements but expected 1!`);
	}
	const callIndex = thisValues.lastIndexOf(result);
	return { node: result, position: getScrollPosition(scrollIntoViewStub, callIndex) };
}

function getScrollPosition(
	scrollIntoViewStub: Mock<Element["scrollIntoView"]>,
	index: number
): ScrollLogicalPosition | undefined {
	if (index < 0 || index >= scrollIntoViewStub.mock.calls.length) {
		return undefined;
	}
	const position = scrollIntoViewStub.mock.calls[index].arguments[0];
	if (typeof position === "boolean") {
		return position ? "start" : "end";
	} else {
		return position?.block;
	}
}
