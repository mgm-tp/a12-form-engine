// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, strictEqual } from "node:assert/strict";
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
	response: "confirm" | "cancel",
	expectedOverlays: number
): Promise<void> {
	await clickRowAction(wrapper, buttonId);

	strictEqual(
		within(wrapper.baseElement).queryAllByDataRole(MODAL_OVERLAY).length,
		expectedOverlays
	);

	const endsWith = (suffix: string) => (value: unknown) =>
		typeof value === "string" && value.endsWith(suffix);
	const responseButton = query(wrapper.widgetMap.Button)
		.withPropMatching("id", endsWith(`-${response}`))
		.props();
	await act(() => responseButton.onClick?.(mouseEventMock));
}

export async function findClickConfirm(wrapper: RtlRenderWrapper, buttonId: string): Promise<void> {
	await clickRowActionWithConfirmationAndRespond(wrapper, buttonId, "confirm", 1);
}

export async function findClickConfirmAndAssert<F extends (...args: never[]) => unknown>(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	func: Mock<F>,
	expectedParameters: Parameters<F>,
	expectedOverlays = 1
): Promise<void> {
	await clickRowActionWithConfirmationAndRespond(wrapper, buttonId, "confirm", expectedOverlays);
	verifyCallAndParameters(func, 1, expectedParameters);
}

export async function findClickCancelAndAssert(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	func: Mock<(...args: never[]) => unknown>,
	expectedOverlays = 1
): Promise<void> {
	await clickRowActionWithConfirmationAndRespond(wrapper, buttonId, "cancel", expectedOverlays);
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

	await findClickAndAssert(wrapper, listItemId, func, expectedParameters);
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

	// the confirmation opens inside the context menu's overlay
	await findClickConfirmAndAssert(wrapper, listItemId, func, expectedParameters, 2);
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

	await findClickCancelAndAssert(wrapper, listItemId, func, 2);
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
