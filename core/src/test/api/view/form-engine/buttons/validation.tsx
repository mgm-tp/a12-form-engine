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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { Models } from "../../../../../back-end/store/index.js";
import { noop } from "../../../../../internal/noop.js";
import type { FormModel } from "../../../../../models/index.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

type ExpectedValidation = {
	id: string;
	expectedEvent: any[];
};

export function testValidation(params: {
	models: Models;
	type: FormModel.ButtonEnum;
	noValidation: ExpectedValidation;
	partialValidation: ExpectedValidation;
	fullValidation: ExpectedValidation;
}): void {
	const { models, type, noValidation, partialValidation, fullValidation } = params;

	const dispatchedEvent = mock.fn();
	const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
	const dispatchConfig: DispatchConfiguration = {
		...stubbedDispatch.eventHandlers,
		onNavigationButton: type === "NAVIGATION" ? dispatchedEvent : noop,
		onEventButton: type === "EVENT" ? dispatchedEvent : noop
	};

	afterEach(() => {
		dispatchedEvent.mock.resetCalls();
	});

	describe("validation", () => {
		describe("given a button with validation=undefined", () => {
			it("dispatches an Events.eventButtonTriggered action with the arguments ('eventName', undefined)", () => {
				const { widgetMap } = setupFormEngineRendererWithRtl({
					models,
					dispatchConfig
				});

				const button = query(widgetMap.Button).withId(noValidation.id).props();
				button.onClick?.(mouseEventMock);

				strictEqual(
					dispatchedEvent.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchedEvent.mock.callCount()} time(s). Expected call count: 1`
				);

				deepStrictEqual(dispatchedEvent.mock.calls[0].arguments, [
					...noValidation.expectedEvent,
					undefined
				]);
			});
		});

		describe("given an event button with validation=partial", () => {
			it("dispatches an Events.onEventButton action with the arguments ('eventName', validation: 'partial')", () => {
				const { widgetMap } = setupFormEngineRendererWithRtl({
					models,
					dispatchConfig
				});

				const button = query(widgetMap.Button).withId(partialValidation.id).props();
				button.onClick?.(mouseEventMock);

				strictEqual(
					dispatchedEvent.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchedEvent.mock.callCount()} time(s). Expected call count: 1`
				);

				deepStrictEqual(dispatchedEvent.mock.calls[0].arguments, [
					...partialValidation.expectedEvent,
					"partial"
				]);
			});
		});

		describe("given an event button with validation=full", () => {
			it("dispatches an Events.onEventButton action with the ('eventName', validation: 'full')", () => {
				const { widgetMap } = setupFormEngineRendererWithRtl({
					models,
					dispatchConfig
				});

				const button = query(widgetMap.Button).withId(fullValidation.id).props();
				button.onClick?.(mouseEventMock);

				strictEqual(
					dispatchedEvent.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchedEvent.mock.callCount()} time(s). Expected call count: 1`
				);

				deepStrictEqual(dispatchedEvent.mock.calls[0].arguments, [
					...fullValidation.expectedEvent,
					"full"
				]);
			});
		});
	});
}
