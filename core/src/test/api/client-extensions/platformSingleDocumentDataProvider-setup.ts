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

import { mock } from "node:test";
import type { Mock } from "node:test";

import type { SagaGenerator } from "typed-redux-saga";
import { call } from "typed-redux-saga";

import type { Model as ModelAPI } from "@com.mgmtp.a12.base/base-model-api";
import type { Model } from "@com.mgmtp.a12.client/client-core";
import { ActivitySelectors, LocaleSelectors, ModelSagas } from "@com.mgmtp.a12.client/client-core";
import type {
	AddDocumentJsonRpc2Response,
	CheckUniquenessJsonRpc2Response
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import { FormEngineSelectors } from "../../../client-extensions/internal/extensions/form-engine/internal/selectors.js";
import type { RequestSelectorMap } from "../../../client-extensions/internal/extensions/platform-server-connectors/internal/providers/RequestSelectorMap.js";
import { RequestBuilder } from "../../../client-extensions/internal/extensions/platform-server-connectors/internal/utils/requestBuilder.js";
import type { FormModel } from "../../../models/index.js";
import { createActivity, createDescriptor } from "../../utils/client-helpers.js";
import { DocumentModelHelpers } from "../../utils/DocumentModelHelpers.js";
import { createFormModelContent } from "../../utils/FormModelHelpers.js";
import { US_LOCALE } from "../../utils/localization.js";

export const testInstance = "testInstance";

export const testDmName = "testDm";

export const testDescriptor = createDescriptor({ instance: testInstance });

export const preProcessedDocument = {
	id: testInstance,
	modelId: testDmName,
	preprocessed: true
};

export const uniquenessCheckResponse = {
	jsonrpc: "2.0",
	id: "uniqueness",
	result: { rootModelName: "", violations: [], errorKey: "" }
} as CheckUniquenessJsonRpc2Response;

export const addDocumentResponse = {
	jsonrpc: "2.0",
	id: "test",
	result: {
		docRef: testInstance
	}
} as AddDocumentJsonRpc2Response;

export function createRequestFactory() {
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
		save: mock.fn(() => () => [
			RequestBuilder.checkUniqueness("", {}, ""),
			RequestBuilder.addDocument("", {}, US_LOCALE)
		]),
		delete: mock.fn(() => () => RequestBuilder.deleteDocument("", US_LOCALE))
	} satisfies RequestSelectorMap;
}

/** The mocks every `provideData` operation needs to reach the request dispatch. */
export function setupProvideDataMocks(): {
	activityByIdStub: Mock<typeof ActivitySelectors.activityById>;
} {
	mock.method(console, "error", () => () => {});

	const activityByIdStub = mock.method(
		ActivitySelectors,
		"activityById",
		() => () => createActivity({ descriptor: testDescriptor })
	);
	mock.method(LocaleSelectors, "locale", () => () => Locale.fromString("en_US") as Locale);
	mock.method(ModelSagas, "waitForModelsLoaded", fakeWaitForModelsLoaded);

	return { activityByIdStub };
}

/** Adds what a save needs on top of {@link setupProvideDataMocks}: a settled uniqueness check
 * plus add, and the ui state every save reads to decide whether server messages have to be
 * dropped. */
export function setupSaveMocks(): {
	dispatchRpcSettledStub: Mock<typeof Dispatcher.rpcSettled>;
} {
	const dispatchRpcSettledStub = mock.method(Dispatcher, "rpcSettled", (async () => [
		{ status: "fulfilled", value: uniquenessCheckResponse },
		{ status: "fulfilled", value: addDocumentResponse }
	]) as typeof Dispatcher.rpcSettled);
	mock.method(FormEngineSelectors, "uiState", () => () => undefined);

	return { dispatchRpcSettledStub };
}

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
			content: createFormModelContent()
		} as FormModel,
		{
			header: { id: testDmName, modelType: "document", modelVersion: "0.0.0" },
			content: DocumentModelHelpers.DocumentModelContent(),
			generatedCodeAccessor: {}
		} as Model.DocumentAndValidationModel
	];
}
