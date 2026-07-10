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

import { deepEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { identity } from "fp-ts/lib/function.js";

import type { ICustomFieldTypeFactory } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts";
import type {
	DocumentComputationResult,
	DocumentValidationResult,
	GeneratedCodeRtConfig,
	ICustomConditionFactory
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentRtServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentRtServiceFactoryA12internal } from "@com.mgmtp.a12.kernel/kernel-md-facade/a12internal";
import type { ExternalComputation } from "@com.mgmtp.a12.kernel/kernel-md-facade/a12internal";

import { DataSelectors, ModelSelectors, UiStateSelectors } from "../../../back-end/store/index.js";
import type { EngineState } from "../../../back-end/store/index.js";
import { computeWithKernel } from "../../../back-end/store/internal/kernel-adapter.js";
import { fullValidation, validateElements } from "../../../back-end/store/internal/validation.js";
import { computeDocument } from "../../../client-extensions/index.js";

describe("unit.back-end.store.kernel-adapter", () => {
	describe("kernelOptions are passed to DocumentRtService by", () => {
		it("validateElements", () => {
			const expected = mockGeneratedCodeRtConfig();
			const spy = createDocumentRtServiceSpy();
			mock.method(DocumentRtServiceFactory, "createDocumentRtService", spy);

			validateElements({
				document: {} as any,
				initialMessages: {},
				relevantElements: [[]],
				type: "full",
				validatorProvider: {} as any,
				kernelOptions: expected
			});

			const actual = spy.mock.calls[0].arguments[1];
			deepEqual(actual, expected);
		});

		it("fullValidation", () => {
			const expected = mockGeneratedCodeRtConfig();
			const state = {} as EngineState;
			const spy = createDocumentRtServiceSpy();
			mock.method(DocumentRtServiceFactory, "createDocumentRtService", spy);

			mock.method(ModelSelectors, "validationCode", MockSelector);
			mock.method(DataSelectors, "relevantDocument", MockSelector);
			mock.method(UiStateSelectors, "messages", MockSelector);

			fullValidation(state, expected);

			const actual = spy.mock.calls[0].arguments[1];
			deepEqual(actual, expected);
		});

		it("computeDocument", () => {
			const expected = mockGeneratedCodeRtConfig();
			const spy = createDocumentRtServiceSpy();
			mock.method(DocumentRtServiceFactory, "createDocumentRtService", spy);
			const document = {} as any;
			const validatorProvider = {} as any;

			computeDocument({ document, validatorProvider, kernelOptions: expected });

			const actual = spy.mock.calls[0].arguments[1];
			deepEqual(actual, expected);
		});

		it("computeWithKernel", () => {
			const expected = mockGeneratedCodeRtConfig();
			const spy = createDocumentRtServiceSpy();
			mock.method(DocumentRtServiceFactoryA12internal, "createDocumentRtService", spy);

			const document = {} as any;
			const validatorProvider = {
				getMetaModel() {
					return {
						getValue() {
							return [];
						}
					};
				}
			} as any;
			const externalComputations: ExternalComputation[] = [{} as any]; // prevent early exit

			computeWithKernel({
				document,
				validatorProvider,
				externalComputations,
				kernelOptions: expected
			});

			const actual = spy.mock.calls[0].arguments[1];
			deepEqual(actual, expected);
		});
	});
});

function mockGeneratedCodeRtConfig(): GeneratedCodeRtConfig {
	return {
		currentDateForTest: new Date("2024-01-01T00:00:00Z"),
		customConditionFactory: {} as ICustomConditionFactory,
		customFieldTypeFactory: {} as ICustomFieldTypeFactory,
		ignoreUnknownFields: false
	};
}

function createDocumentRtServiceSpy(): Mock<CreateDocumentRtService> {
	const mockValidate: () => DocumentValidationResult = () => ({
		messages: [],
		noErrorOccurred: true
	});
	const mockCompute: () => DocumentComputationResult = () =>
		({
			computedFieldInstancesWithoutErrors: [],
			computedFieldInstancesWithErrors: [],
			computedFieldInstancesWithChanges: [],
			clearedFieldInstances: [],
			appliedTo: identity
		}) as any;
	return mock.fn<CreateDocumentRtService>(() => ({
		validatePart: mockValidate,
		validateFull: mockValidate,
		compute: mockCompute,
		computeA12internal: mockCompute,
		applyComputationResult: mock.fn()
	}));
}

const MockSelector = () => () => ({});

type CreateDocumentRtService = typeof DocumentRtServiceFactory.createDocumentRtService;
