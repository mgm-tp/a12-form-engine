// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { notStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import type { Middleware } from "redux";

import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

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
