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

import type { ActivitySelectors } from "@com.mgmtp.a12.client/client-core";
import { ActivityActions } from "@com.mgmtp.a12.client/client-core";
import type {
	CheckUniquenessViolation,
	JsonRpc2UniqueConstraintErrorResponse
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access";

import { createPlatformSingleDocumentDataProvider } from "../../../client-extensions/index.js";
import {
	TEST_ACTIVITY_ID,
	createActivity,
	createDataHolder,
	createTestConfig
} from "../../utils/client-helpers.js";

import {
	addDocumentResponse,
	createRequestFactory,
	preProcessedDocument,
	setupProvideDataMocks,
	setupSaveMocks,
	testDescriptor,
	uniquenessCheckResponse
} from "./platformSingleDocumentDataProvider-setup.js";

describe("api.client-extensions.platformSingleDocumentDataProvider.save", () => {
	let activityByIdStub: Mock<typeof ActivitySelectors.activityById>;

	beforeEach(() => {
		({ activityByIdStub } = setupProvideDataMocks());
	});

	let dispatchRpcSettledStub: Mock<typeof Dispatcher.rpcSettled>;

	beforeEach(() => {
		({ dispatchRpcSettledStub } = setupSaveMocks());
	});

	it("should persist the document and dispatch the configured saving done action", async () => {
		const savingDoneDummyAction = { type: "SavingDoneDummy" };
		const savingDoneStub = mock.fn(() => savingDoneDummyAction);

		const requestFactory = createRequestFactory();
		const testPlanResult = await expectSaga(
			createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory }).provideData,
			createTestConfig({
				operation: "save",
				dataHolders: [
					createDataHolder({
						descriptor: testDescriptor,
						data: { document: preProcessedDocument }
					})
				],
				details: {
					saving: {
						done: savingDoneStub
					}
				}
			})
		).run();

		strictEqual(requestFactory.save.mock.callCount(), 1);
		strictEqual(dispatchRpcSettledStub.mock.callCount(), 1);
		strictEqual(testPlanResult.effects.put.length, 1);
		deepStrictEqual(testPlanResult.effects.put[0].payload.action, savingDoneDummyAction);
	});

	it(
		"should also update the datasource activity when its id is " +
			"present in the data holder and trigger a reload of this activity",
		async () => {
			const datasourceActivityId = "1";
			const expectedSetDataAction = ActivityActions.setData({
				activityId: datasourceActivityId,
				data: { document: preProcessedDocument }
			});
			const expectedReloadAction = ActivityActions.reloadData({
				activityId: datasourceActivityId
			});

			const testPlanResult = await expectSaga(
				createPlatformSingleDocumentDataProvider({
					requestSelectorMap: createRequestFactory()
				}).provideData,
				createTestConfig({
					operation: "save",
					dataHolders: [
						createDataHolder({
							descriptor: testDescriptor,
							data: { document: preProcessedDocument },
							datasourceActivityId
						})
					]
				})
			).run();

			strictEqual(testPlanResult.effects.put.length, 3);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetDataAction);
			deepStrictEqual(testPlanResult.effects.put[2].payload.action, expectedReloadAction);
		}
	);

	it(
		"should also update the document in the activity data, " +
			"when 'updateActivityData' is set in the save config",
		async () => {
			const expectedSetDataAction = ActivityActions.setData({
				activityId: TEST_ACTIVITY_ID,
				data: { document: preProcessedDocument }
			});

			const testPlanResult = await expectSaga(
				createPlatformSingleDocumentDataProvider({
					requestSelectorMap: createRequestFactory()
				}).provideData,
				createTestConfig({
					operation: "save",
					dataHolders: [
						createDataHolder({
							descriptor: testDescriptor,
							data: { document: preProcessedDocument }
						})
					],
					details: {
						updateActivityData: true
					}
				})
			).run();

			strictEqual(testPlanResult.effects.put.length, 2);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetDataAction);
		}
	);

	it("should trigger reloading the activity's initiating activity when given", async () => {
		const initiatingActivityId = "1";
		activityByIdStub.mock.mockImplementation(
			() => () =>
				createActivity({
					initiatingActivityId,
					descriptor: testDescriptor
				})
		);

		const expectedReloadAction = ActivityActions.reloadData({
			activityId: initiatingActivityId
		});

		const testPlanResult = await expectSaga(
			createPlatformSingleDocumentDataProvider({ requestSelectorMap: createRequestFactory() })
				.provideData,
			createTestConfig({
				operation: "save",
				dataHolders: [
					createDataHolder({
						descriptor: testDescriptor,
						data: { document: preProcessedDocument }
					})
				]
			})
		).run();

		strictEqual(testPlanResult.effects.put.length, 2);
		deepStrictEqual(testPlanResult.effects.put[1].payload.action, expectedReloadAction);
	});

	it("should fail saving when the uniqueness check returns violations", async () => {
		const violation: CheckUniquenessViolation = {
			modelName: "testModel",
			constraintName: "testConstraint",
			conflictingDocRef: "otherDoc",
			errorMessage: { en: "already exists" },
			errorKey: "key",
			fieldFullNames: ["/name"]
		};
		dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
			{
				status: "fulfilled",
				value: {
					...uniquenessCheckResponse,
					result: { ...uniquenessCheckResponse.result, violations: [violation] }
				}
			},
			{ status: "fulfilled", value: addDocumentResponse }
		]) as typeof Dispatcher.rpcSettled);

		const savingFailedDummyAction = { type: "SavingFailedDummy" };
		const savingFailedStub = mock.fn(() => savingFailedDummyAction);

		const testPlanResult = await expectSaga(
			createPlatformSingleDocumentDataProvider({
				requestSelectorMap: createRequestFactory()
			}).provideData,
			createTestConfig({
				operation: "save",
				dataHolders: [
					createDataHolder({
						descriptor: testDescriptor,
						data: { document: preProcessedDocument }
					})
				],
				details: {
					saving: {
						failed: savingFailedStub
					}
				}
			})
		).run();

		strictEqual(savingFailedStub.mock.callCount(), 1);
		strictEqual(testPlanResult.effects.put.length, 1);
		deepStrictEqual(testPlanResult.effects.put[0].payload.action, savingFailedDummyAction);
	});

	it(
		"should fail saving when the uniqueness check passes " +
			"but the save request fails with a unique constraint violation",
		async () => {
			const uniqueConstraintErrorResponse: JsonRpc2UniqueConstraintErrorResponse = {
				jsonrpc: "2.0",
				id: "save",
				error: {
					code: -32060,
					message: "Unique constraint violated",
					data: {
						level: "error",
						title: { key: "conflict.title", default: "Conflict" },
						description: { key: "conflict.description", default: "Duplicate" },
						details: {
							code: "UNIQUE_CONSTRAINT_VIOLATION",
							subsystem: "document",
							time: "2026-04-22T00:00:00Z"
						}
					}
				}
			};
			dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
				{ status: "fulfilled", value: uniquenessCheckResponse },
				{ status: "rejected", reason: uniqueConstraintErrorResponse }
			]) as typeof Dispatcher.rpcSettled);

			const savingFailedDummyAction = { type: "SavingFailedDummy" };
			const savingFailedStub = mock.fn(() => savingFailedDummyAction);

			const testPlanResult = await expectSaga(
				createPlatformSingleDocumentDataProvider({
					requestSelectorMap: createRequestFactory()
				}).provideData,
				createTestConfig({
					operation: "save",
					dataHolders: [
						createDataHolder({
							descriptor: testDescriptor,
							data: { document: preProcessedDocument }
						})
					],
					details: {
						saving: {
							failed: savingFailedStub
						}
					}
				})
			).run();

			strictEqual(savingFailedStub.mock.callCount(), 1);
			strictEqual(testPlanResult.effects.put.length, 1);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, savingFailedDummyAction);
		}
	);
});
