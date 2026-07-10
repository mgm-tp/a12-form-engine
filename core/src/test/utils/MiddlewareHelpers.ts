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
 * 1. Open-Source License - EUPL v1.2
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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";
import type { Mock } from "node:test";
import { isDeepStrictEqual } from "node:util";

import type { Action, Middleware } from "redux";

import type { ActionCreator } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";

import type { Middlewares } from "../../back-end/store/internal/middleware/index.js";

export const MiddlewareHelpers = {
	/**
	 * A middleware to spy on dispatched actions.
	 */
	createMiddlewareSpy(ignore: ActionCreator<any>[] = []): {
		readonly spy: Mock<(a: Action) => Action>;
		readonly middleware: Middleware;
	} {
		const spy = mock.fn(x => x);
		const middleware: Middleware =
			ignore.length === 0
				? () => next => action => next(spy(action))
				: () => next => action =>
						ignore.every(x => !x.match(action)) ? next(spy(action)) : action;
		return { spy, middleware };
	},

	stubMiddleware(obj: typeof Middlewares, method: keyof typeof Middlewares): void {
		const stubbedMiddleware: Middleware = _ => next => action => {
			return next(action);
		};

		beforeEach(() => {
			mock.method(obj, method, () => stubbedMiddleware);
		});
	},

	/**
	 * A middleware to wait for actions.
	 */
	createMiddlewareWaitForAction(waitFor: Action): {
		readonly ready: Promise<void>;
		readonly middleware: Middleware;
	} {
		let dispatcher: (next: (action: unknown) => unknown) => (action: unknown) => unknown = next =>
			next;

		const ready = new Promise<void>(resolve => {
			dispatcher = next => action => {
				if (isDeepStrictEqual(action, waitFor)) {
					resolve();
				}
				return next(action);
			};
		});

		return {
			ready,
			middleware() {
				return dispatcher;
			}
		};
	},

	/**
	 * Checks if a set of expected actions is dispatched by an executed middleware and no others.
	 * @param middlewareSpy The spy of the middleware to assert.
	 * @param expectedActions The expected actions.
	 * @param actualActionsIncludeInitialAction Do the dispatched actions of the middleware contain
	 * the action initiating the middleware?
	 */
	assertActions(
		middlewareSpy: Mock<(a: Action) => Action>,
		expectedActions: ReadonlyArray<Action | undefined>,
		actualActionsIncludeInitialAction = true
	): void {
		const actualActions = middlewareSpy.mock.calls.map(c => c.arguments[0]);
		const cleanExpectedActions = expectedActions.filter(
			<T>(x: T | undefined): x is T => x !== undefined
		);

		strictEqual(
			actualActions.length - (actualActionsIncludeInitialAction ? 1 : 0),
			cleanExpectedActions.length,
			"Expected and actual actions are not the same.\n" +
				generateActionOutput(cleanExpectedActions, actualActions)
		);
		for (const expectedAction of cleanExpectedActions) {
			deepStrictEqual(
				actualActions.find(actualAction => actualAction.type === expectedAction.type),
				expectedAction
			);
		}
	},

	/**
	 * Check if an action is dispatched by an executed middleware.
	 * @param middlewareSpy The spy of the middleware to assert.
	 * @param expectedAction The expected action.
	 */
	assertAction(middlewareSpy: Mock<(a: Action) => Action>, expectedAction: Action): void {
		const actualActions = middlewareSpy.mock.calls.map(c => c.arguments[0]);
		deepStrictEqual(
			actualActions.find(actualAction => actualAction.type === expectedAction.type),
			expectedAction
		);
	},

	/**
	 * Check if an action is NOT dispatched by an executed middleware.
	 * @param middlewareSpy The spy of the middleware to assert.
	 * @param unexpectedAction The action which is not expected
	 */
	assertNoAction(middlewareSpy: Mock<(a: Action) => Action>, unexpectedAction: Action): void {
		const actualActions = middlewareSpy.mock.calls.map(c => c.arguments[0]);

		strictEqual(
			actualActions.find(actualAction => actualAction.type === unexpectedAction.type),
			undefined,
			"Expected action of type " + unexpectedAction.type + " not to be dispatched, but it was."
		);
	},

	assertNumberOfActions(
		middlewareSpy: Mock<(a: Action) => Action>,
		expectedActions: ReadonlyArray<Action | undefined>,
		actualActionsIncludeInitialAction = true
	): void {
		const actualActions = middlewareSpy.mock.calls.map(c => c.arguments[0]);
		const cleanExpectedActions = expectedActions.filter(
			<T>(x: T | undefined): x is T => x !== undefined
		);

		strictEqual(
			actualActions.length - (actualActionsIncludeInitialAction ? 1 : 0),
			cleanExpectedActions.length,
			"Expected and actual actions are not the same.\n" +
				generateActionOutput(cleanExpectedActions, actualActions)
		);
	}
};

function generateActionOutput(expectedActions: Action[], actualActions: Action[]): string {
	return (
		"Expected actions:\n" +
		expectedActions.map(a => a.type).join("\n") +
		"\n\n" +
		"Actual actions (incl. initiating action):\n" +
		actualActions.map(a => a.type).join("\n")
	);
}
