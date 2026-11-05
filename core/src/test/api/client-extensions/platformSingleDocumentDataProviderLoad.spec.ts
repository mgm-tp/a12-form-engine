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

import { ActivityActions } from "@com.mgmtp.a12.client/client-core";
import { setThumbnails } from "@com.mgmtp.a12.client/client-core/a12internal";
import type {
	LoadThumbnailUrlsJsonRpc2,
	QueryJsonRpc2Response
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access";

import type { EngineStore } from "../../../back-end/store/index.js";
import { createPlatformSingleDocumentDataProvider } from "../../../client-extensions/index.js";
import { PreProcessor } from "../../../client-extensions/internal/extensions/form-engine/internal/preProcessDocument.js";
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
	testDmName,
	testInstance
} from "./platformSingleDocumentDataProvider-setup.js";

describe("api.client-extensions.platformSingleDocumentDataProvider.load", () => {
	let dispatchJsonRpcStub: Mock<typeof Dispatcher.rpc>;

	beforeEach(() => {
		setupProvideDataMocks();
	});

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
			deepStrictEqual(testPlanResult.effects.put[0].payload.action, expectedSetThumbnailAction);
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
			createPlatformSingleDocumentDataProvider({ requestSelectorMap: requestFactory }).provideData,
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
