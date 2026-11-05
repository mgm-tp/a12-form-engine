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

import { deepStrictEqual, rejects, strictEqual } from "node:assert/strict";
import { mock } from "node:test";
import type { Mock } from "node:test";

import { expectSaga } from "redux-saga-test-plan";

import type {
	AddDocumentJsonRpc2Response,
	CheckUniquenessViolation,
	DocumentValidationError,
	JsonRpc2UniqueConstraintErrorResponse
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access";

import { Commands, createUIState } from "../../../back-end/store/index.js";
import { createPlatformSingleDocumentDataProvider } from "../../../client-extensions/index.js";
import { FormEngineActions } from "../../../client-extensions/internal/extensions/form-engine/internal/actions.js";
import { FormEngineSelectors } from "../../../client-extensions/internal/extensions/form-engine/internal/selectors.js";
import {
	createValidationMessagesFromServerResults,
	mergeServerMessages
} from "../../../client-extensions/internal/extensions/platform-server-connectors/internal/providers/handleServerValidation.js";
import {
	TEST_ACTIVITY_ID,
	createDataHolder,
	createTestConfig
} from "../../utils/client-helpers.js";

import {
	createRequestFactory,
	preProcessedDocument,
	setupProvideDataMocks,
	setupSaveMocks,
	testDescriptor,
	testInstance,
	uniquenessCheckResponse
} from "./platformSingleDocumentDataProvider-setup.js";

describe("api.client-extensions.platformSingleDocumentDataProvider.serverValidation", () => {
	const documentValidationResult: DocumentValidationError = {
		errorText: "Field is required",
		errorCode: "rule_1",
		messageType: "VALUE_ERROR",
		rulePath: "/Root/Field",
		referencedFieldsPointers: ["/Root[1]/Field[1]"],
		severityType: "ERROR",
		errorFieldPointer: "/Root[1]/Field[1]"
	};

	// the shape Data Services' JsonRpc2Response.Exception guard requires
	const validationException = (documentValidationResults: readonly unknown[]) => ({
		level: "error",
		title: { key: "error.document.validation.title", default: "Invalid document" },
		description: { key: "error.document.validation", default: "Document is not valid" },
		details: { code: "-32002", subsystem: "document", time: "2026-04-22T00:00:00Z" },
		extraDetails: { documentValidationResults }
	});

	const uiState = createUIState({ screenLocation: [{ path: [], locationPath: [] }] });

	const expectedSetMessageStateAction = FormEngineActions.command({
		activityId: TEST_ACTIVITY_ID,
		engineEvent: Commands.setMessageState({
			messages: mergeServerMessages(
				{},
				createValidationMessagesFromServerResults([documentValidationResult], "en")
			)
		})
	});
	const expectedSetValidationBarStateAction = FormEngineActions.command({
		activityId: TEST_ACTIVITY_ID,
		engineEvent: Commands.CorrectionMode.setValidationBarState({
			validationBar: { visible: true }
		})
	});
	const expectedFocusValidationBarAction = FormEngineActions.command({
		activityId: TEST_ACTIVITY_ID,
		engineEvent: Commands.CorrectionMode.focusValidationBar()
	});

	let dispatchRpcSettledStub: Mock<typeof Dispatcher.rpcSettled>;
	let uiStateStub: Mock<typeof FormEngineSelectors.uiState>;

	beforeEach(() => {
		setupProvideDataMocks();
		({ dispatchRpcSettledStub } = setupSaveMocks());
		uiStateStub = mock.method(FormEngineSelectors, "uiState", () => () => uiState);
	});

	it(
		"should run server validation and dispatch saving.failed with an empty payload, " +
			"without rethrowing, when the save is rejected with document validation results",
		async () => {
			const validationErrorResponse = {
				jsonrpc: "2.0",
				id: "save",
				error: {
					code: -32000,
					message: "Validation failed",
					data: validationException([documentValidationResult])
				}
			};
			dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
				{ status: "fulfilled", value: uniquenessCheckResponse },
				{ status: "rejected", reason: validationErrorResponse }
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

			strictEqual(testPlanResult.effects.put.length, 4);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetMessageStateAction);
			deepStrictEqual(
				testPlanResult.effects.put[1].payload.action,
				expectedSetValidationBarStateAction
			);
			deepStrictEqual(
				testPlanResult.effects.put[2].payload.action,
				expectedFocusValidationBarAction
			);
			strictEqual(savingFailedStub.mock.callCount(), 1);
			deepStrictEqual(savingFailedStub.mock.calls[0].arguments, [{}]);
			deepStrictEqual(testPlanResult.effects.put[3].payload.action, savingFailedDummyAction);
		}
	);

	it(
		"should rethrow the save error unchanged, without dispatching saving.failed, " +
			"when the document validation results are empty",
		async () => {
			const emptyValidationErrorResponse = {
				jsonrpc: "2.0",
				id: "save",
				error: {
					code: -32000,
					message: "Validation failed",
					data: validationException([])
				}
			};
			dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
				{ status: "fulfilled", value: uniquenessCheckResponse },
				{ status: "rejected", reason: emptyValidationErrorResponse }
			]) as typeof Dispatcher.rpcSettled);

			const savingFailedStub = mock.fn(() => ({ type: "SavingFailedDummy" }));

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
			)
				.throws(emptyValidationErrorResponse)
				.run();

			strictEqual(savingFailedStub.mock.callCount(), 0);
			strictEqual(testPlanResult.effects.put, undefined);
		}
	);

	it(
		"should show a warnings-only result in the validation bar but still rethrow, " +
			"because it does not explain why the save failed",
		async () => {
			const warningResult: DocumentValidationError = {
				...documentValidationResult,
				severityType: "WARNING"
			};
			const warningErrorResponse = {
				jsonrpc: "2.0",
				id: "save",
				error: {
					code: -32000,
					message: "Save failed",
					data: validationException([warningResult])
				}
			};
			dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
				{ status: "fulfilled", value: uniquenessCheckResponse },
				{ status: "rejected", reason: warningErrorResponse }
			]) as typeof Dispatcher.rpcSettled);

			const savingFailedStub = mock.fn(() => ({ type: "SavingFailedDummy" }));

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
			)
				.throws(warningErrorResponse)
				.run();

			// the warning is reported and the bar opened, but the save error is not swallowed
			strictEqual(testPlanResult.effects.put.length, 3);
			deepStrictEqual(
				testPlanResult.effects.put[1].payload.action,
				expectedSetValidationBarStateAction
			);
			deepStrictEqual(
				testPlanResult.effects.put[2].payload.action,
				expectedFocusValidationBarAction
			);
			strictEqual(savingFailedStub.mock.callCount(), 0);
		}
	);

	it("should rethrow the save error unchanged when it carries no document validation results", async () => {
		const genericErrorResponse = {
			jsonrpc: "2.0",
			id: "save",
			error: { code: -32000, message: "Something else failed" }
		};
		dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
			{ status: "fulfilled", value: uniquenessCheckResponse },
			{ status: "rejected", reason: genericErrorResponse }
		]) as typeof Dispatcher.rpcSettled);

		const testPlan = expectSaga(
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
				]
			})
		).run();

		await rejects(testPlan, genericErrorResponse as unknown as Error);
	});

	it(
		"should run server validation and still complete normal success handling " +
			"when the save response carries document validation results",
		async () => {
			const addDocumentResponseWithValidation = {
				jsonrpc: "2.0",
				id: "test",
				// a save that persisted the document reports what it validated in the result
				result: {
					docRef: testInstance,
					validationResults: [documentValidationResult]
				}
			} as AddDocumentJsonRpc2Response;

			dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
				{ status: "fulfilled", value: uniquenessCheckResponse },
				{ status: "fulfilled", value: addDocumentResponseWithValidation }
			]) as typeof Dispatcher.rpcSettled);

			const savingDoneDummyAction = { type: "SavingDoneDummy" };
			const savingDoneStub = mock.fn(() => savingDoneDummyAction);

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
							done: savingDoneStub
						}
					}
				})
			).run();

			strictEqual(testPlanResult.effects.put.length, 4);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetMessageStateAction);
			deepStrictEqual(
				testPlanResult.effects.put[1].payload.action,
				expectedSetValidationBarStateAction
			);
			deepStrictEqual(
				testPlanResult.effects.put[2].payload.action,
				expectedFocusValidationBarAction
			);
			strictEqual(savingDoneStub.mock.callCount(), 1);
			deepStrictEqual(testPlanResult.effects.put[3].payload.action, savingDoneDummyAction);
		}
	);

	it(
		"should drop the previous save's server messages, without opening the validation bar, " +
			"when a successful save carries no validation results",
		async () => {
			uiStateStub.mock.mockImplementation(
				() => () =>
					createUIState({
						screenLocation: [{ path: [], locationPath: [] }],
						messages: mergeServerMessages(
							{},
							createValidationMessagesFromServerResults([documentValidationResult], "en")
						)
					})
			);

			const savingDoneDummyAction = { type: "SavingDoneDummy" };
			const savingDoneStub = mock.fn(() => savingDoneDummyAction);

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
							done: savingDoneStub
						}
					}
				})
			).run();

			strictEqual(testPlanResult.effects.put.length, 2);
			deepStrictEqual(
				testPlanResult.effects.put[0].payload.action,
				FormEngineActions.command({
					activityId: TEST_ACTIVITY_ID,
					engineEvent: Commands.setMessageState({ messages: {} })
				})
			);
			strictEqual(savingDoneStub.mock.callCount(), 1);
			deepStrictEqual(testPlanResult.effects.put[1].payload.action, savingDoneDummyAction);
		}
	);

	const violation: CheckUniquenessViolation = {
		modelName: "testModel",
		constraintName: "testConstraint",
		conflictingDocRef: "otherDoc",
		errorMessage: { en: "already exists" },
		errorKey: "key",
		fieldFullNames: ["/name"]
	};

	it(
		"should report the document validation results as well when the uniqueness check " +
			"reports violations, so both problems can be fixed in one pass",
		async () => {
			const validationErrorResponse = {
				jsonrpc: "2.0",
				id: "save",
				error: {
					code: -32000,
					message: "Validation failed",
					data: validationException([documentValidationResult])
				}
			};
			dispatchRpcSettledStub.mock.mockImplementationOnce((async () => [
				{
					status: "fulfilled",
					value: {
						...uniquenessCheckResponse,
						result: { ...uniquenessCheckResponse.result, violations: [violation] }
					}
				},
				{ status: "rejected", reason: validationErrorResponse }
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

			strictEqual(testPlanResult.effects.put.length, 4);
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetMessageStateAction);
			deepStrictEqual(
				testPlanResult.effects.put[1].payload.action,
				expectedSetValidationBarStateAction
			);
			deepStrictEqual(
				testPlanResult.effects.put[2].payload.action,
				expectedFocusValidationBarAction
			);
			strictEqual(savingFailedStub.mock.callCount(), 1);
			deepStrictEqual(testPlanResult.effects.put[3].payload.action, savingFailedDummyAction);
		}
	);

	it(
		"should drop stale server messages when the save is rejected for a unique constraint " +
			"violation, because the server validates before it checks uniqueness",
		async () => {
			uiStateStub.mock.mockImplementation(
				() => () =>
					createUIState({
						screenLocation: [{ path: [], locationPath: [] }],
						messages: mergeServerMessages(
							{},
							createValidationMessagesFromServerResults([documentValidationResult], "en")
						)
					})
			);

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

			strictEqual(testPlanResult.effects.put.length, 2);
			deepStrictEqual(
				testPlanResult.effects.put[0].payload.action,
				FormEngineActions.command({
					activityId: TEST_ACTIVITY_ID,
					engineEvent: Commands.setMessageState({ messages: {} })
				})
			);
			deepStrictEqual(testPlanResult.effects.put[1].payload.action, savingFailedDummyAction);
		}
	);
});
