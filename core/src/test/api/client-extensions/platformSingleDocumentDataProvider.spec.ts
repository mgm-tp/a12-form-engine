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

import { deepStrictEqual, rejects, strictEqual } from "node:assert/strict";
import { mock, type Mock } from "node:test";

import { expectSaga } from "redux-saga-test-plan";
import type { SagaGenerator } from "typed-redux-saga";
import { call } from "typed-redux-saga";

import type { Model as ModelAPI } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { setThumbnails } from "@com.mgmtp.a12.client/client-core/lib/core/activity/a12-internal/thumbnails/action.js";
import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import {
	ActivityActions,
	ActivitySagas,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import type {
	Model,
	ReferencedModel
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { ModelSagas } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { LoadThumbnailUrlsJsonRpc2 } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js";
import type { AddDocumentJsonRpc2Response } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Document/index.js";
import type { QueryJsonRpc2Response } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/query/Response.js";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore } from "../../../back-end/store/index.js";
import { createPlatformSingleDocumentDataProvider } from "../../../client-extensions/index.js";
import { PreProcessor } from "../../../client-extensions/internal/extensions/form-engine/internal/preProcessDocument.js";
import type { RequestSelectorMap } from "../../../client-extensions/internal/extensions/platform-server-connectors/internal/providers/RequestSelectorMap.js";
import { RequestBuilder } from "../../../client-extensions/internal/extensions/platform-server-connectors/internal/utils/requestBuilder.js";
import type { FormModel } from "../../../models/index.js";
import {
	TEST_ACTIVITY_ID,
	createActivity,
	createDataHolder,
	createDescriptor,
	createTestConfig
} from "../../utils/client-helpers.js";
import { US_LOCALE } from "../../utils/localization.js";
import { DocumentModelHelpers } from "../../utils/model-helpers.js";

describe("api.client-extensions.platformSingleDocumentDataProvider", () => {
	const testInstance = "testInstance";

	describe("canHandle", () => {
		interface TestSpec {
			readonly description: string;
			readonly instance: string | undefined;
			readonly hasFormModel: boolean;
			readonly expected: boolean;
		}

		const testSpecs: TestSpec[] = [
			{
				description:
					"should return true, when an instance is defined in the activity descriptor " +
					"and when a form model is defined for the activity",
				instance: testInstance,
				hasFormModel: true,
				expected: true
			},
			{
				description:
					"should return false, when an instance is defined in the activity descriptor " +
					"but no form model is defined for the activity",
				instance: testInstance,
				hasFormModel: false,
				expected: false
			},
			{
				description:
					"should return false, when no instance is defined in the activity descriptor " +
					"and when a form model is defined for the activity",
				instance: undefined,
				hasFormModel: true,
				expected: false
			},
			{
				description:
					"should return false, when no instance is defined in the activity descriptor " +
					"and no form model is defined for the activity",
				instance: undefined,
				hasFormModel: false,
				expected: false
			}
		];

		createTestCases(testSpecs);

		function createTestCases(testSpecs: TestSpec[]) {
			for (const { description, expected, hasFormModel, instance } of testSpecs) {
				it(description, () => {
					const actual = createPlatformSingleDocumentDataProvider().canHandle({
						activityId: TEST_ACTIVITY_ID,
						activities: {
							[TEST_ACTIVITY_ID]: createActivity({
								id: TEST_ACTIVITY_ID,
								descriptor: { instance }
							})
						},
						operation: "load",
						dataHolder: createDataHolder(),
						action: {
							type: "dummy",
							payload: {
								activityId: TEST_ACTIVITY_ID,
								modelsInScene: createTestModels({ hasFormModel })
							}
						} as ActivityActions.DataReducerAction
					});
					strictEqual(actual, expected);
				});
			}
		}

		function createTestModels(options?: { hasFormModel?: boolean }): ReferencedModel.NotLoaded[] {
			return [
				...(options?.hasFormModel
					? [
							{
								direct: true as const,
								loadingState: "notLoaded" as const,
								model: { name: "testFormModel", modelType: "form" }
							}
						]
					: [])
			];
		}
	});

	describe("provideData", () => {
		const testDmName = "testDm";
		const testDescriptor = createDescriptor({ instance: testInstance });

		let activityByIdStub: Mock<typeof ActivitySelectors.activityById>;

		let dispatchJsonRpcStub: Mock<typeof Dispatcher.rpc>;

		function createRequestFactory() {
			return {
				load: mock.fn(
					() => () =>
						RequestBuilder.query({
							constraint: { field: "/__meta/docRef", operator: "exact_match", value: "" },
							targetDocumentModel: "",
							projectionName: "document",
							paging: { pageNumber: 1, pageSize: 10 }
						})
				),
				save: mock.fn(() => () => RequestBuilder.addDocument("", {}, US_LOCALE)),
				delete: mock.fn(() => () => RequestBuilder.deleteDocument("", US_LOCALE))
			} satisfies RequestSelectorMap;
		}

		beforeEach(() => {
			mock.method(console, "error", () => () => {});

			activityByIdStub = mock.method(
				ActivitySelectors,
				"activityById",
				() => () => createActivity({ descriptor: testDescriptor })
			);
			mock.method(LocaleSelectors, "locale", () => () => Locale.fromString("en_US") as Locale);
			mock.method(ModelSagas, "waitForModelsLoaded", fakeWaitForModelsLoaded);
		});

		describe("common", () => {
			it("should throw an error when the activity with the id given in the config is not present", async () => {
				const expectedError = new Error(`No activity found for id ${TEST_ACTIVITY_ID}.`);
				activityByIdStub.mock.mockImplementation(() => () => undefined);

				const testPlan = expectSaga(
					createPlatformSingleDocumentDataProvider().provideData,
					createTestConfig({
						operation: "load",
						dataHolders: [createDataHolder({ descriptor: testDescriptor })]
					})
				).run();

				await rejects(testPlan, expectedError);
			});

			it("should throw an error when the activity descriptor's instance is undefined", async () => {
				const expectedError = new Error("Instance must be set");
				activityByIdStub.mock.mockImplementation(
					() => () => createActivity({ descriptor: { something: "something" } })
				);

				const testPlan = expectSaga(
					createPlatformSingleDocumentDataProvider().provideData,
					createTestConfig({
						operation: "load",
						dataHolders: [createDataHolder({ descriptor: testDescriptor })]
					})
				).run();

				await rejects(testPlan, expectedError);
			});

			it("should throw an error when among the data holders in the config there is none with the activities descriptor", async () => {
				const expectedError = new Error(
					`No default DataHolder found for activityId ${TEST_ACTIVITY_ID}`
				);

				const testPlan = expectSaga(
					createPlatformSingleDocumentDataProvider().provideData,
					createTestConfig({
						operation: "load",
						dataHolders: [createDataHolder({ descriptor: { something: "something" } })]
					})
				).run();

				await rejects(testPlan, expectedError);
			});
		});

		describe("operations", () => {
			const preProcessedDocument = {
				id: testInstance,
				modelId: testDmName,
				preprocessed: true
			};

			describe("load", () => {
				const loadedDocument = {
					loaded: true
				};

				const getDocumentQueryResponse = {
					jsonrpc: "2.0",
					id: "test2",
					result: {
						entries: [
							{
								docRef: testInstance,
								document: loadedDocument,
								documentModelName: testDmName
							}
						],
						fullSize: 1
					}
				} as QueryJsonRpc2Response;

				const thumbnails = {
					thumbnail: "mc thumbface"
				};
				const thumbnailResponse: LoadThumbnailUrlsJsonRpc2.Response = {
					jsonrpc: "2.0",
					id: "1",
					result: {
						doc: { thumbnail: { bigThumbnailUrl: "mc thumbface" } }
					}
				};

				const testPreProcessingMessages: Record<string, EngineStore.Validation.Entry> = {
					"/preProcessed": { validationMessages: [] }
				};

				let preProcessDocumentStub: Mock<typeof PreProcessor.preProcessDocument>;

				beforeEach(() => {
					dispatchJsonRpcStub = mock.method(Dispatcher, "rpc", (async () => [
						getDocumentQueryResponse,
						{ jsonrpc: "2.0", id: "test", result: {} }
					]) as typeof Dispatcher.rpc);

					preProcessDocumentStub = mock.method(PreProcessor, "preProcessDocument", () => ({
						document: preProcessedDocument,
						changes: {}
					}));
				});

				it(
					"should load the document, set the thumbnails if there could be loaded some and " +
						"should set a loaded, preprocessed document in the activity data",
					async () => {
						dispatchJsonRpcStub.mock.mockImplementationOnce((async () => [
							getDocumentQueryResponse,
							thumbnailResponse
						]) as typeof Dispatcher.rpc);

						const expectedSetThumbnailAction = setThumbnails({
							activityId: TEST_ACTIVITY_ID,
							thumbnails
						});
						const expectedSetDataAction = ActivityActions.setData({
							activityId: TEST_ACTIVITY_ID,
							data: {
								document: preProcessedDocument
							}
						});

						const requestFactory = createRequestFactory();

						const testPlanResult = await expectSaga(
							createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory })
								.provideData,
							createTestConfig({
								operation: "load",
								dataHolders: [createDataHolder({ descriptor: testDescriptor })]
							})
						).run();

						strictEqual(testPlanResult.effects.put.length, 2);
						deepStrictEqual(
							testPlanResult.effects.put[0].payload.action,
							expectedSetThumbnailAction
						);
						deepStrictEqual(testPlanResult.effects.put[1].payload.action, expectedSetDataAction);
					}
				);

				it("should use the query rpc operation for loading the document when enabled via options", async () => {
					dispatchJsonRpcStub.mock.mockImplementationOnce((async () => [
						getDocumentQueryResponse,
						{ jsonrpc: "2.0", id: "test", result: {} }
					]) as typeof Dispatcher.rpc);
					const requestFactory = createRequestFactory();
					const testPlanResult = await expectSaga(
						createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory })
							.provideData,
						createTestConfig({
							operation: "load",
							dataHolders: [createDataHolder({ descriptor: testDescriptor })]
						})
					).run();

					strictEqual(requestFactory.load.mock.callCount(), 1);

					const expectedSetDataAction = ActivityActions.setData({
						activityId: TEST_ACTIVITY_ID,
						data: {
							document: preProcessedDocument
						}
					});

					deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetDataAction);
				});

				it(
					"should set an activity error but still set the preprocessed " +
						"document as activity data, when the preprocessing fails",
					async () => {
						preProcessDocumentStub.mock.mockImplementationOnce(() => ({
							document: preProcessedDocument,
							changes: {},
							messages: testPreProcessingMessages
						}));

						const expectedSetErrorAction = ActivityActions.error({
							activityId: TEST_ACTIVITY_ID,
							operationType: "loading",
							error: {
								errorCode: "INTERNAL_CLIENT_ERROR",
								message:
									"At least one computation failed during the initial computation for the document.",
								computationErrorMessages: testPreProcessingMessages
							}
						});
						const expectedSetDataAction = ActivityActions.setData({
							activityId: TEST_ACTIVITY_ID,
							data: {
								document: preProcessedDocument
							}
						});

						const requestFactory = createRequestFactory();
						const testPlanResult = await expectSaga(
							createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory })
								.provideData,
							createTestConfig({
								operation: "load",
								dataHolders: [createDataHolder({ descriptor: testDescriptor })]
							})
						).run();

						strictEqual(testPlanResult.effects.put.length, 2);
						deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetErrorAction);
						deepStrictEqual(testPlanResult.effects.put[1].payload.action, expectedSetDataAction);
					}
				);
			});

			describe("save", () => {
				const addDocumentResponse = {
					jsonrpc: "2.0",
					id: "test",
					result: {
						docRef: testInstance
					}
				} as AddDocumentJsonRpc2Response;

				beforeEach(() => {
					dispatchJsonRpcStub = mock.method(Dispatcher, "rpc", (async () => [
						addDocumentResponse
					]) as typeof Dispatcher.rpc);
				});

				it("should persist the document and dispatch the configured saving done action", async () => {
					const savingDoneDummyAction = { type: "SavingDoneDummy" };
					const savingDoneStub = mock.fn(() => savingDoneDummyAction);

					const requestFactory = createRequestFactory();
					const testPlanResult = await expectSaga(
						createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory })
							.provideData,
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
					strictEqual(dispatchJsonRpcStub.mock.callCount(), 1);
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
			});

			describe("delete", () => {
				let childActivityByInstanceIdStub: Mock<typeof ActivitySelectors.childActivityByInstanceId>;

				beforeEach(() => {
					childActivityByInstanceIdStub = mock.method(
						ActivitySelectors,
						"childActivityByInstanceId",
						() => () => undefined
					);
					dispatchJsonRpcStub = mock.method(
						Dispatcher,
						"rpc",
						(async () => []) as typeof Dispatcher.rpc
					);
				});

				it("should delete the instance and reload the activity", async () => {
					const expectedReloadAction = ActivityActions.reloadData({ activityId: TEST_ACTIVITY_ID });

					const requestFactory = createRequestFactory();
					const testPlanResult = await expectSaga(
						createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory })
							.provideData,
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
						deepStrictEqual(
							testPlanResult.effects.put[0].payload.action,
							expectedCancelRequestedAction
						);
						deepStrictEqual(testPlanResult.effects.put[1].payload.action, expectedReloadAction);
					});
				});
			});
		});

		function* fakeWaitForModelsLoaded(): SagaGenerator<ModelAPI[]> {
			yield* call(() => {});

			return createTestModels();
		}

		function createTestModels(): ModelAPI[] {
			return [
				{
					header: {
						modelType: "form",
						modelReferences: [{ modelType: "document", reference: testDmName }]
					},
					content: {}
				} as FormModel,
				{
					header: { id: testDmName, modelType: "document", modelVersion: "0.0.0" },
					content: DocumentModelHelpers.DocumentModelContent(),
					generatedCodeAccessor: {}
				} as Model.DocumentAndValidationModel
			];
		}
	});
});
