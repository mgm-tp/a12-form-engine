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

import type { Model as ModelAPI } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import {
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import type {
	Model,
	ReferencedModel
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";

import type { EngineStore } from "../../../back-end/store/index.js";
import { createEmptyDocumentDataProvider } from "../../../client-extensions/index.js";
import { InternalModelSelectors } from "../../../client-extensions/internal/core/view/internal/components/selectors.js";
import { PreProcessor } from "../../../client-extensions/internal/extensions/form-engine/internal/preProcessDocument.js";
import { EmptyDocument } from "../../../models/internal/utils/document-utils.js";
import {
	TEST_ACTIVITY_ID,
	createActivity,
	createDataHolder,
	createTestConfig
} from "../../utils/client-helpers.js";

describe("api.client-extensions.createEmptyDocumentDataProvider", () => {
	describe("canHandle", () => {
		interface TestSpec {
			readonly description: string;
			readonly operation: DataProvider.Operation;
			readonly descriptor: Record<string, string>;
			readonly hasFormModel: boolean;
			readonly expected: boolean;
		}

		const testSpecs: TestSpec[] = [
			{
				description:
					"should return true when given operation is 'load' and a data holder with instance __NEW__ in the descriptor and a form model is referenced in the scene",
				operation: "load",
				descriptor: {
					instance: NEW_INSTANCE_IDENTIFIER
				},
				hasFormModel: true,
				expected: true
			},
			{
				description:
					"should return false when given operation is 'load' and a data holder with instance __NEW__ in the descriptor and no form model is referenced in the scene",
				operation: "load",
				descriptor: {
					instance: NEW_INSTANCE_IDENTIFIER
				},
				hasFormModel: false,
				expected: false
			},
			{
				description:
					"should return false when given operation is 'load' and a data holder with an instance other than __NEW__ in the descriptor",
				operation: "load",
				descriptor: {
					instance: "otherInstance"
				},
				hasFormModel: true,
				expected: false
			},
			{
				description:
					"should return false when given operation is not 'load' and a data holder with instance __NEW__ in the descriptor",
				operation: "save",
				descriptor: {
					instance: NEW_INSTANCE_IDENTIFIER
				},
				hasFormModel: true,
				expected: false
			},
			{
				description:
					"should return false when given operation is not 'load' and a data holder with an instance other than __NEW__ in the descriptor",
				operation: "save",
				descriptor: {
					instance: "otherInstance"
				},
				hasFormModel: true,
				expected: false
			}
		];

		createTestCases(testSpecs);

		function createTestCases(testSpecs: TestSpec[]) {
			const emptyDocumentDataProvider = createEmptyDocumentDataProvider();
			for (const spec of testSpecs) {
				it(`${spec.description}`, () => {
					const actual = emptyDocumentDataProvider.canHandle(createTestConfig(spec));
					strictEqual(actual, spec.expected);
				});
			}
		}

		function createTestConfig({
			operation,
			descriptor,
			hasFormModel
		}: TestSpec): DataProvider.CanHandleConfig {
			return {
				activities: {},
				activityId: "0",
				operation,
				dataHolder: {
					descriptor,
					dirty: false,
					loadingState: "missing",
					savingState: "not_saved",
					slices: {}
				},
				action: {
					type: "dummy",
					payload: {
						activityId: TEST_ACTIVITY_ID,
						modelsInScene: createTestModels({ hasFormModel })
					}
				} as ActivityActions.DataReducerAction
			};
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
		const idAndModelId = { id: NEW_INSTANCE_IDENTIFIER, modelId: "testDm" };
		const initializedDocument = {
			...idAndModelId,
			onlyInitialized: true
		};
		const preProcessedDocument = {
			...idAndModelId,
			preprocessed: true
		};
		const testPreProcessingMessages: Record<string, EngineStore.Validation.Entry> = {
			"/preProcessed": { validationMessages: [] }
		};

		let emptyDocumentDataProvider: DataProvider;

		let uiModelAndDocumentModelLoadedByActivityIdStub: Mock<
			typeof InternalModelSelectors.uiModelAndDocumentModelLoadedByActivityId
		>;
		let activityByIdStub: Mock<typeof ActivitySelectors.activityById>;
		let preProcessDocumentStub: Mock<typeof PreProcessor.preProcessDocument>;

		beforeEach(() => {
			mock.method(console, "error", () => () => {});

			emptyDocumentDataProvider = createEmptyDocumentDataProvider();

			uiModelAndDocumentModelLoadedByActivityIdStub = mock.method(
				InternalModelSelectors,
				"uiModelAndDocumentModelLoadedByActivityId",
				() =>
					<T extends ModelAPI>() => ({
						stateChanged: true,
						returnValue: {
							uiModel: { header: { modelType: "form" }, content: {} } as T,
							documentAndValidationModel: {
								header: { id: "testDm" },
								generatedCodeAccessor: {}
							} as Model.DocumentAndValidationModel
						}
					})
			);
			activityByIdStub = mock.method(ActivitySelectors, "activityById", () => createActivity);
			mock.method(EmptyDocument, "createEmptyDocument", () => initializedDocument);
			preProcessDocumentStub = mock.method(PreProcessor, "preProcessDocument", () => ({
				document: preProcessedDocument,
				changes: {}
			}));
		});

		it("should throw an error when the operation from the config isn't load", async () => {
			const expectedError = new Error("EmptyDocumentDataProvider does not support delete.");

			const testPlan = expectSaga(
				emptyDocumentDataProvider.provideData,
				createTestConfig({ operation: "delete" })
			).run();

			await rejects(testPlan, expectedError);
		});

		it("should throw an error when the activity with the id from the config is not present", async () => {
			const expectedError = new Error(`No activity found for id ${TEST_ACTIVITY_ID}.`);
			activityByIdStub.mock.mockImplementationOnce(() => () => undefined);

			const testPlan = expectSaga(
				emptyDocumentDataProvider.provideData,
				createTestConfig({ operation: "load" })
			).run();

			await rejects(testPlan, expectedError);
		});

		it("should throw an error when among the data holders in the config there is none with the activities descriptor", async () => {
			const expectedError = new Error(
				`No data holder found for activity's descriptor ${JSON.stringify(createActivity().descriptor)}`
			);

			const testPlan = expectSaga(
				emptyDocumentDataProvider.provideData,
				createTestConfig({
					operation: "load",
					dataHolders: [createDataHolder({ descriptor: { something: "something" } })]
				})
			).run();

			await rejects(testPlan, expectedError);
		});

		it("should throw an error when the models for the activity couldn't be loaded", async () => {
			uiModelAndDocumentModelLoadedByActivityIdStub.mock.mockImplementationOnce(() => () => ({
				stateChanged: true,
				returnValue: undefined
			}));

			const expectedError = new Error("Cannot load necessary models.");

			const testPlan = expectSaga(
				emptyDocumentDataProvider.provideData,
				createTestConfig({ operation: "load" })
			).run();

			await rejects(testPlan, expectedError);
		});

		it("should throw an error when an error happened during model loading", async () => {
			const testModelLoadingErrorMessage = "test error message";
			const expectedError = new Error(testModelLoadingErrorMessage);

			uiModelAndDocumentModelLoadedByActivityIdStub.mock.mockImplementationOnce(() => () => ({
				stateChanged: true,
				returnValue: { type: "UNKNOWN", message: testModelLoadingErrorMessage }
			}));

			const testPlan = expectSaga(
				emptyDocumentDataProvider.provideData,
				createTestConfig({ operation: "load" })
			).run();

			await rejects(testPlan, expectedError);
		});

		it("should throw an error when the returned ui model is not a form model", async () => {
			const expectedError = new Error("Loaded ui model is not a form model.");

			uiModelAndDocumentModelLoadedByActivityIdStub.mock.mockImplementationOnce(<
				T extends ModelAPI
			>() => () => ({
				stateChanged: true,
				returnValue: {
					uiModel: { header: { modelType: "unknown" } } as T,
					documentAndValidationModel: {} as Model.DocumentAndValidationModel
				}
			}));

			const testPlan = expectSaga(
				emptyDocumentDataProvider.provideData,
				createTestConfig({ operation: "load" })
			).run();

			await rejects(testPlan, expectedError);
		});

		it(
			"should set an initialized document without any preprocessing as activity " +
				"data and return, when preComputeNewDocuments is set to false in the config",
			async () => {
				const expectedPutAction = ActivityActions.setData({
					activityId: TEST_ACTIVITY_ID,
					data: { document: initializedDocument }
				});

				const testPlanResult = await expectSaga(
					emptyDocumentDataProvider.provideData,
					createTestConfig({ operation: "load", details: { preComputeNewDocuments: false } })
				).run();

				strictEqual(testPlanResult.effects.put.length, 1);
				deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedPutAction);
			}
		);

		it("should set an initialized and preprocessed document as activity data and return", async () => {
			const expectedPutAction = ActivityActions.setData({
				activityId: TEST_ACTIVITY_ID,
				data: { document: preProcessedDocument }
			});

			const testPlanResult = await expectSaga(
				emptyDocumentDataProvider.provideData,
				createTestConfig({ operation: "load" })
			).run();

			strictEqual(testPlanResult.effects.put.length, 1);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedPutAction);
		});

		it(
			"should set an initialized and preprocessed document as activity data and " +
				"a loading error, when the preprocessing produced errors",
			async () => {
				const expectedSetErrorAction = ActivityActions.error({
					activityId: TEST_ACTIVITY_ID,
					error: {
						errorCode: "INTERNAL_CLIENT_ERROR",
						message:
							"At least one computation failed during the initial computation for the document.",
						computationErrorMessages: testPreProcessingMessages
					},
					operationType: "loading"
				});
				const expectedSetDataAction = ActivityActions.setData({
					activityId: TEST_ACTIVITY_ID,
					data: { document: preProcessedDocument }
				});
				preProcessDocumentStub.mock.mockImplementationOnce(() => ({
					document: preProcessedDocument,
					changes: {},
					messages: testPreProcessingMessages
				}));

				const testPlanResult = await expectSaga(
					emptyDocumentDataProvider.provideData,
					createTestConfig({ operation: "load" })
				).run();

				strictEqual(testPlanResult.effects.put.length, 2);
				deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetErrorAction);
				deepStrictEqual(testPlanResult.effects.put[1].payload.action, expectedSetDataAction);
			}
		);
	});
});
