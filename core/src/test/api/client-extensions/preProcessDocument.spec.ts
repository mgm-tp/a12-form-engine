// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, throws } from "node:assert/strict";
import { mock } from "node:test";

import type {
	DocumentModel,
	GroupInstance,
	IGeneratedCodeAccessor
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Change, EngineStore } from "../../../back-end/store/index.js";
import { KernelComputation } from "../../../back-end/store/internal/computation.js";
import { preProcessDocument } from "../../../client-extensions/index.js";
import type { PreProcessDocumentResult } from "../../../client-extensions/index.js";
import { DocumentComputation } from "../../../client-extensions/internal/extensions/form-engine/internal/computeDocument.js";
import type { FormModel, ReadonlyObjectMap } from "../../../models/index.js";
import { DocumentModelHelpers } from "../../utils/model-helpers.js";

describe("api.client-extensions.preProcessDocument", () => {
	interface TestSpec {
		readonly description: string;
		readonly testModels: {
			formModel: FormModel;
			documentModel: DocumentModel;
			validatorProvider: IGeneratedCodeAccessor;
		};
		readonly expectedResult: PreProcessDocumentResult;
		readonly inputDoc?: GroupInstance;
		readonly stubSetup?: () => void;
	}

	it("given a form model with an unknown preprocessing mode, throws an error", () => {
		const testModels = createTestModels({ isNewInstance: false, mode: "UNKNOWN_MODE" });
		throws(
			() =>
				preProcessDocument({
					document: {} as GroupInstance,
					models: testModels,
					isNewInstance: false
				}),
			new Error("Unknown pre-processing mode")
		);
	});

	function createTestSpecs(options: { isNewInstance: boolean }): TestSpec[] {
		const { isNewInstance } = options;
		return [
			{
				description:
					`given ${isNewInstance ? "a new" : "an existing"} document and ` +
					"given a form model with preprocessing set to 'none', " +
					"returns the unaltered document and no changes and messages",
				testModels: createTestModels({ isNewInstance, mode: "NONE" }),
				inputDoc: simpleDoc(),
				expectedResult: {
					document: simpleDoc(),
					changes: {}
				}
			},
			{
				description:
					`given ${isNewInstance ? "a new" : "an existing"} document and ` +
					"given a form model with preprocessing set to " +
					"'computations', returns the computed document, changes and " +
					"no messages when there was no computation error",
				testModels: createTestModels({ isNewInstance, mode: "COMPUTATIONS" }),
				stubSetup: createComputeDocumentStubSetup(),
				expectedResult: {
					document: documentAfterComputations(),
					changes: changesAfterComputations()
				}
			},
			{
				description:
					`given ${isNewInstance ? "a new" : "an existing"} document and ` +
					"given a form model with preprocessing set to " +
					"'computations', returns the computed document, changes and " +
					"error messages when there were computation errors",
				testModels: createTestModels({ isNewInstance, mode: "COMPUTATIONS" }),
				stubSetup: createComputeDocumentStubSetup({ hasError: true }),
				expectedResult: {
					document: documentAfterComputations(),
					changes: changesAfterComputations(),
					messages: messagesAfterComputations()
				}
			},
			{
				description:
					`given ${isNewInstance ? "a new" : "an existing"} document and ` +
					"given a form model with preprocessing set to " +
					"'computations and dependencies', returns the processed " +
					"document, changes and no messages when there was no computation error",
				testModels: createTestModels({ isNewInstance, mode: "COMPUTATIONS_AND_DEPENDENCIES" }),
				stubSetup: createComputeAndEvalDepsStubSetup(),
				expectedResult: {
					document: documentAfterComputationsAndDependencies(),
					changes: changesAfterComputationsAndDependencies()
				}
			},
			{
				description:
					`given ${isNewInstance ? "a new" : "an existing"} document and ` +
					"given a form model with preprocessing set to " +
					"'computations and dependencies', returns the computed " +
					"document, changes and error messages when there were computation errors",
				testModels: createTestModels({ isNewInstance, mode: "COMPUTATIONS_AND_DEPENDENCIES" }),
				stubSetup: createComputeAndEvalDepsStubSetup({ hasError: true }),
				expectedResult: {
					document: documentAfterComputationsAndDependencies(),
					changes: changesAfterComputationsAndDependencies(),
					messages: messagesAfterComputationsAndDependencies()
				}
			}
		];
	}

	for (const isNewInstance of [true, false]) {
		createTestCases({ testSpecs: createTestSpecs({ isNewInstance }), isNewInstance });
	}

	function createTestCases(options: { testSpecs: TestSpec[]; isNewInstance: boolean }): void {
		const { testSpecs, isNewInstance } = options;

		for (const spec of testSpecs) {
			it(`${spec.description}`, () => {
				spec.stubSetup?.();

				const actualResult = preProcessDocument({
					document: spec.inputDoc ?? ({} as GroupInstance),
					isNewInstance,
					models: spec.testModels
				});

				deepStrictEqual(actualResult, spec.expectedResult);
			});
		}
	}
});

function createTestModels(options?: {
	isNewInstance: boolean;
	mode?: FormModel.OpenDocumentPreProcessing | "UNKNOWN_MODE";
}): {
	formModel: FormModel;
	documentModel: DocumentModel;
	validatorProvider: IGeneratedCodeAccessor;
} {
	return {
		formModel: {
			content: {
				...(options?.isNewInstance
					? { openNewDocumentPreProcessing: options?.mode }
					: { openExistingDocumentPreProcessing: options?.mode })
			}
		} as unknown as FormModel,
		documentModel: DocumentModelHelpers.createDocumentModel(DocumentModelHelpers.Group()),
		validatorProvider: {} as unknown as IGeneratedCodeAccessor
	};
}

function simpleDoc(): GroupInstance {
	return {
		foo: "bar"
	};
}

function documentAfterComputations(): GroupInstance {
	return {
		computations: "yes"
	};
}
function changesAfterComputations(): Record<string, Change> {
	return {
		"computations[1]": { type: "ValueChanged", path: [{ elementName: "computations", index: 1 }] }
	};
}
function messagesAfterComputations(): Record<string, EngineStore.Validation.Entry> {
	return {
		"computations[1]": { validationMessages: [{} as unknown as EngineStore.Validation.Message] }
	};
}

function documentAfterComputationsAndDependencies(): GroupInstance {
	return {
		compsAndDeps: "yes"
	};
}
function changesAfterComputationsAndDependencies(): Record<string, Change> {
	return {
		"compsAndDeps[1]": { type: "ValueChanged", path: [{ elementName: "compsAndDeps", index: 1 }] }
	};
}
function messagesAfterComputationsAndDependencies(): Record<string, EngineStore.Validation.Entry> {
	return {
		"compsAndDeps[1]": { validationMessages: [{} as unknown as EngineStore.Validation.Message] }
	};
}

function createComputeDocumentStubSetup(options?: { hasError: boolean }) {
	return () => {
		mock.method(DocumentComputation, "computeDocument", () => ({
			document: documentAfterComputations(),
			changes: changesAfterComputations() as ReadonlyObjectMap<Change>,
			messages: options?.hasError
				? (messagesAfterComputations() as ReadonlyObjectMap<EngineStore.Validation.Entry>)
				: {}
		}));
	};
}

function createComputeAndEvalDepsStubSetup(options?: { hasError: boolean }) {
	return () => {
		mock.method(KernelComputation, "computeAndEvaluateDependencies", () => ({
			document: documentAfterComputationsAndDependencies(),
			changes: changesAfterComputationsAndDependencies() as ReadonlyObjectMap<Change>,
			parseErrors: options?.hasError
				? (messagesAfterComputationsAndDependencies() as ReadonlyObjectMap<EngineStore.Validation.Entry>)
				: {}
		}));
	};
}
