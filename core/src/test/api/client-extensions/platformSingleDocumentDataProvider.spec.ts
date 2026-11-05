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

import { rejects, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";

import { expectSaga } from "redux-saga-test-plan";

import type { ReferencedModel } from "@com.mgmtp.a12.client/client-core";
import type { ActivityActions, ActivitySelectors } from "@com.mgmtp.a12.client/client-core";

import { createPlatformSingleDocumentDataProvider } from "../../../client-extensions/index.js";
import {
	TEST_ACTIVITY_ID,
	createActivity,
	createDataHolder,
	createTestConfig
} from "../../utils/client-helpers.js";

import {
	setupProvideDataMocks,
	testDescriptor,
	testInstance
} from "./platformSingleDocumentDataProvider-setup.js";

describe("api.client-extensions.platformSingleDocumentDataProvider", () => {
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
		let activityByIdStub: Mock<typeof ActivitySelectors.activityById>;

		beforeEach(() => {
			({ activityByIdStub } = setupProvideDataMocks());
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
	});
});
