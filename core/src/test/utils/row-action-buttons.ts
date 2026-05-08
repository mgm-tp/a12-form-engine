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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";

import { fireEvent } from "@testing-library/react";
import { act } from "react";

import { query, within } from "@com.mgmtp.a12.devtools/react";

import { MODAL_OVERLAY } from "../rtl-utils/data-roles.js";
import { mouseEventMock } from "../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../rtl-utils/render-wrapper.js";

async function clickRowAction(wrapper: RtlRenderWrapper, buttonId: string) {
	const rowActionButton = query(wrapper.widgetMap.Button).withId(buttonId).maybeProps();
	const rowActionListItem = query(wrapper.widgetMap.ListItem).withId(buttonId).maybeProps();

	const rowActionElement = rowActionButton ?? rowActionListItem;

	await act(() => rowActionElement?.onClick?.(mouseEventMock));
}

export async function findClickAndAssert<F extends (...args: never) => unknown>(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	func: Mock<F>,
	expectedParameters: Parameters<F>
): Promise<void> {
	await clickRowAction(wrapper, buttonId);
	verifyCallAndParameters(func, 1, expectedParameters);
}

async function clickRowActionWithConfirmationAndRespond(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	response: "confirm" | "cancel"
): Promise<void> {
	await clickRowAction(wrapper, buttonId);

	ok(within(wrapper.baseElement).queryByDataRole(MODAL_OVERLAY));

	const endsWith = (suffix: string) => (value: unknown) =>
		typeof value === "string" && value.endsWith(suffix);
	const responseButton = query(wrapper.widgetMap.Button)
		.withPropMatching("id", endsWith(`-${response}`))
		.props();
	await act(() => responseButton.onClick?.(mouseEventMock));
}

export async function findClickConfirm(wrapper: RtlRenderWrapper, buttonId: string): Promise<void> {
	await clickRowActionWithConfirmationAndRespond(wrapper, buttonId, "confirm");
}

export async function findClickConfirmAndAssert<F extends (...args: never[]) => unknown>(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	func: Mock<F>,
	expectedParameters: Parameters<F>
): Promise<void> {
	await clickRowActionWithConfirmationAndRespond(wrapper, buttonId, "confirm");
	verifyCallAndParameters(func, 1, expectedParameters);
}

export async function findClickCancelAndAssert(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	func: Mock<(...args: never[]) => unknown>
): Promise<void> {
	await clickRowActionWithConfirmationAndRespond(wrapper, buttonId, "cancel");
	verifyCallAndParameters(func, 0, []);
}

export async function findClickAndAssertInContextMenu<F extends (...args: never[]) => unknown>(
	wrapper: RtlRenderWrapper,
	cellId: string,
	listItemId: string,
	func: Mock<F>,
	expectedParameters: Parameters<F>
): Promise<void> {
	// TODO: Do outside of function and do all asserts together
	const cell = within(wrapper.baseElement).getById(cellId);
	await act(() => fireEvent.contextMenu(cell));

	findClickAndAssert(wrapper, listItemId, func, expectedParameters);
}

export async function findClickConfirmAndAssertInContextMenu<
	F extends (...args: never[]) => unknown
>(
	wrapper: RtlRenderWrapper,
	cellId: string,
	listItemId: string,
	func: Mock<F>,
	expectedParameters: Parameters<F>
): Promise<void> {
	// TODO: Do outside of function and do all asserts together
	const cell = within(wrapper.baseElement).getById(cellId);
	await act(() => fireEvent.contextMenu(cell));

	findClickConfirmAndAssert(wrapper, listItemId, func, expectedParameters);
}

export async function findClickCancelAndAssertInContextMenu(
	wrapper: RtlRenderWrapper,
	cellId: string,
	listItemId: string,
	func: Mock<(...args: never[]) => unknown>
): Promise<void> {
	// TODO: Do outside of function and do all asserts together
	const cell = within(wrapper.baseElement).getById(cellId);
	await act(() => fireEvent.contextMenu(cell));

	findClickCancelAndAssert(wrapper, listItemId, func);
}

function verifyCallAndParameters<F extends (...args: never[]) => unknown>(
	func: Mock<F>,
	expectedCallCount: number,
	expectedParameters: Parameters<F>
): void {
	strictEqual(
		func.mock.callCount(),
		expectedCallCount,
		`Dispatch function was called ${func.mock.callCount()} time(s). Expected call count: ${expectedCallCount}`
	);

	if (expectedCallCount > 0) {
		const eventParameters = func.mock.calls.at(0)?.arguments;
		strictEqual(eventParameters?.length, expectedParameters.length);
		for (let i = 0; i < expectedParameters.length; i++) {
			deepStrictEqual(
				eventParameters[i],
				expectedParameters[i],
				`Parameter #${i} does not match expectation`
			);
		}
	}
}
