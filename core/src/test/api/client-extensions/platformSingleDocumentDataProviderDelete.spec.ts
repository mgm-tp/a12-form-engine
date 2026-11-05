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

import { expectSaga } from "redux-saga-test-plan";
import type { SagaGenerator } from "typed-redux-saga";
import { call } from "typed-redux-saga";

import type { Activity } from "@com.mgmtp.a12.client/client-core";
import {
	ActivityActions,
	ActivitySagas,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access";

import { createPlatformSingleDocumentDataProvider } from "../../../client-extensions/index.js";
import {
	TEST_ACTIVITY_ID,
	createDataHolder,
	createTestConfig
} from "../../utils/client-helpers.js";

import {
	createRequestFactory,
	preProcessedDocument,
	setupProvideDataMocks,
	testDescriptor,
	testInstance
} from "./platformSingleDocumentDataProvider-setup.js";

describe("api.client-extensions.platformSingleDocumentDataProvider.delete", () => {
	let dispatchJsonRpcStub: Mock<typeof Dispatcher.rpc>;

	beforeEach(() => {
		setupProvideDataMocks();
	});

	let childActivityByInstanceIdStub: Mock<typeof ActivitySelectors.childActivityByInstanceId>;

	beforeEach(() => {
		childActivityByInstanceIdStub = mock.method(
			ActivitySelectors,
			"childActivityByInstanceId",
			() => () => undefined
		);
		dispatchJsonRpcStub = mock.method(Dispatcher, "rpc", (async () => []) as typeof Dispatcher.rpc);
	});

	it("should delete the instance and reload the activity", async () => {
		const expectedReloadAction = ActivityActions.reloadData({ activityId: TEST_ACTIVITY_ID });

		const requestFactory = createRequestFactory();
		const testPlanResult = await expectSaga(
			createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory }).provideData,
			createTestConfig({
				operation: "delete",
				dataHolders: [
					createDataHolder({
						descriptor: testDescriptor,
						data: { document: preProcessedDocument }
					})
				]
			})
		).run();

		strictEqual(requestFactory.delete.mock.callCount(), 1);
		strictEqual(dispatchJsonRpcStub.mock.callCount(), 1);
		strictEqual(testPlanResult.effects.put.length, 1);
		deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedReloadAction);
	});

	describe("when the activity has a child activity with the instance to delete in its descriptor", () => {
		it("should trigger cancellation of the child activity before deleting the data", async () => {
			const childActivity = { id: "1", descriptor: { instance: testInstance } } as Activity;
			childActivityByInstanceIdStub.mock.mockImplementationOnce(() => () => childActivity);
			function* testWaitSaga(): SagaGenerator<boolean> {
				yield* call(() => {});
				return true;
			}
			mock.method(ActivitySagas, "waitForResponseCancelRequested", () => testWaitSaga);
			const expectedReloadAction = ActivityActions.reloadData({
				activityId: TEST_ACTIVITY_ID
			});
			const expectedCancelRequestedAction = ActivityActions.cancelRequested({
				activityIds: [childActivity.id]
			});

			const testPlanResult = await expectSaga(
				createPlatformSingleDocumentDataProvider({
					requestSelectorMap: createRequestFactory()
				}).provideData,
				createTestConfig({
					operation: "delete",
					dataHolders: [
						createDataHolder({
							descriptor: testDescriptor,
							data: { document: preProcessedDocument }
						})
					]
				})
			).run();

			strictEqual(testPlanResult.effects.put.length, 2);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedCancelRequestedAction);
			deepStrictEqual(testPlanResult.effects.put[1].payload.action, expectedReloadAction);
		});
	});
});
