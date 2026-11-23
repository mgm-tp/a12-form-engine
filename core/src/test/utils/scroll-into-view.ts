// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
