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

import { notStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import type { Middleware } from "redux";

import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";

import type { EngineStore, MiddlewareOptions } from "../../../../../back-end/store/index.js";
import { createEngineMiddlewares } from "../../../../../back-end/store/index.js";
import { Middlewares } from "../../../../../back-end/store/internal/middleware/index.js";

describe("api.back-end.store.defaults", () => {
	describe("createEngineMiddlewares", () => {
		describe("given no middleware options", () => {
			it("creates middleware options with the default converter and localizer provider and hands them to the middleware factories", () => {
				const addButtonRepeatMiddlewareFactorySpy = mock.method(
					Middlewares,
					"addButtonRepeatMiddlewareFactory"
				);
				const leaveEmbeddedAndDetachedRepeatRowMiddlewareSpy = mock.method(
					Middlewares,
					"leaveDetachedRepeatRowMiddleware"
				);
				const onValueChangeMiddlewareFactorySpy = mock.method(
					Middlewares,
					"onValueChangeMiddlewareFactory"
				);
				const removeRepeatRowMiddlewareSpy = mock.method(Middlewares, "removeRepeatRowMiddleware");
				const cloneButtonRepeatMiddlewareFactorySpy = mock.method(
					Middlewares,
					"cloneButtonRepeatMiddlewareFactory"
				);
				const onLeaveRowMiddlewareFactorySpy = mock.method(
					Middlewares,
					"onLeaveRowMiddlewareFactory"
				);
				const validatePartMiddlewareFactorySpy = mock.method(
					Middlewares,
					"validatePartMiddlewareFactory"
				);
				const validateFullMiddlewareFactorySpy = mock.method(
					Middlewares,
					"validateFullMiddlewareFactory"
				);

				createEngineMiddlewares();

				assertMiddlewareInitialization(
					addButtonRepeatMiddlewareFactorySpy,
					"addButtonRepeatMiddlewareFactory"
				);
				assertMiddlewareInitialization(
					leaveEmbeddedAndDetachedRepeatRowMiddlewareSpy,
					"leaveEmbeddedAndDetachedRepeatRowMiddleware"
				);

				assertMiddlewareInitialization(
					onValueChangeMiddlewareFactorySpy,
					"onValueChangeMiddlewareFactory"
				);

				assertMiddlewareInitialization(removeRepeatRowMiddlewareSpy, "removeRepeatRowMiddleware");

				assertMiddlewareInitialization(
					cloneButtonRepeatMiddlewareFactorySpy,
					"cloneButtonRepeatMiddlewareFactory"
				);

				assertMiddlewareInitialization(
					onLeaveRowMiddlewareFactorySpy,
					"onLeaveRowMiddlewareFactory"
				);

				assertMiddlewareInitialization(
					validatePartMiddlewareFactorySpy,
					"validatePartMiddlewareFactory"
				);
				assertMiddlewareInitialization(
					validateFullMiddlewareFactorySpy,
					"validateFullMiddlewareFactory"
				);
			});
		});

		describe("given a custom converter", () => {
			it("creates middleware options with the custom converter and hands them to the middleware factories", () => {
				const addButtonRepeatMiddlewareFactorySpy = mock.method(
					Middlewares,
					"addButtonRepeatMiddlewareFactory"
				);

				const converterMock: EngineStore.Provider<ValueConversion> = () => ({
					formatValue: () => "",
					parseValue: () => ({})
				});
				createEngineMiddlewares({ converter: converterMock });

				strictEqual(
					addButtonRepeatMiddlewareFactorySpy.mock.calls.at(0)?.arguments.at(0)?.converter,
					converterMock
				);
			});
		});

		describe("given a custom localizer", () => {
			it("creates middleware options with the custom localizer and hands them to the middleware factories", () => {
				const localizerMock: EngineStore.Provider<Localizer> = () => () => "";

				const addButtonRepeatMiddlewareFactorySpy = mock.method(
					Middlewares,
					"addButtonRepeatMiddlewareFactory"
				);

				createEngineMiddlewares({ localizer: localizerMock });

				strictEqual(
					addButtonRepeatMiddlewareFactorySpy.mock.calls.at(0)?.arguments.at(0)?.localizer,
					localizerMock
				);
			});
		});

		function assertMiddlewareInitialization(
			middlewareSpy: Mock<(o: MiddlewareOptions) => Middleware>,
			middlewareName: string
		): void {
			strictEqual(middlewareSpy.mock.callCount(), 1, "Wrong call count " + middlewareName);

			const firstArgOfFirstCall = middlewareSpy.mock.calls.at(0)?.arguments.at(0);

			notStrictEqual(firstArgOfFirstCall?.converter, undefined);
			notStrictEqual(firstArgOfFirstCall?.localizer, undefined);
		}
	});
});
