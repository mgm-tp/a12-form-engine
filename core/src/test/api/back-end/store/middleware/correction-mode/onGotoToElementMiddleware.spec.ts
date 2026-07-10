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

import type { Action, Store } from "redux";

import { provider } from "@com.mgmtp.a12.widgets/widgets-core";

import type { EngineState } from "../../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../../back-end/store/index.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";
import { MiddlewareHelpers } from "../../../../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";

describe("api.back-end.store.middleware", () => {
	describe("onGotoToElementMiddleware", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		const models = setupModelsFixture("computation-validation.errors_and_warnings_and_infos");

		beforeEach(() => {
			middlewareSpy.spy.mock.resetCalls();
		});

		const initialLocationStackInformation = [
			{
				path: [],
				locationPath: createModelPath("Screen-Initial")
			}
		];

		const initialSectionCollapseInformation = {
			"sec-1": true,
			"sec-2": true
		};

		const initialBackups = [
			{
				document: { root: 1 },
				messages: {}
			}
		];

		function setupStore(setCorrectionModeBackup?: boolean): Store<EngineState, Action> {
			return createTestStore({
				storeConfig: {
					models: models,
					ui: {
						validationBar: {
							visible: true,
							expanded: true,
							currentMessageKey: "Test-Key"
						},
						screenLocation: initialLocationStackInformation,
						sectionState: initialSectionCollapseInformation,
						backup: initialBackups,
						correctionModeBackup: setCorrectionModeBackup
							? {
									location: [],
									sections: {}
								}
							: undefined
					}
				},
				middlewares: [middlewareSpy.middleware]
			});
		}

		describe("handles Events.CorrectionMode.goToElement", () => {
			describe("Mobile", () => {
				beforeEach(() => {
					mock.method(provider, "get", () => "phone");
				});

				it(
					"dispatches " +
						"Commands.CorrectionMode.setValidationBarState with 'expanded=false' and 'currentMessageKey='undefined'",
					() => {
						const action = Events.CorrectionMode.goToElement({
							item: {
								formModelPath: createModelPath("My", "Test", "Path"),
								locationStack: [],
								sectionsCollapse: []
							},
							messageKey: "My-Message-Key"
						});

						setupStore().dispatch(action);
						const expectedCommand = Commands.CorrectionMode.setValidationBarState({
							validationBar: {
								visible: true,
								expanded: false,
								currentMessageKey: undefined
							}
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					}
				);

				assertions();
			});

			describe("Desktop", () => {
				it(
					"dispatches " +
						"Commands.CorrectionMode.setValidationBarState with " +
						"the message key from the payload and the other validation bar information from the state",
					() => {
						const action = Events.CorrectionMode.goToElement({
							item: {
								formModelPath: createModelPath("My", "Test", "Path"),
								locationStack: [],
								sectionsCollapse: []
							},
							messageKey: "My-Key"
						});

						setupStore().dispatch(action);
						const expectedCommand = Commands.CorrectionMode.setValidationBarState({
							validationBar: {
								visible: true,
								expanded: true,
								currentMessageKey: action.payload.messageKey
							}
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					}
				);

				assertions();
			});

			function assertions(): void {
				it("dispatches Commands.CorrectionMode.setCorrectionScreenState with 'visible=false'", () => {
					const action = Events.CorrectionMode.goToElement({
						item: {
							formModelPath: createModelPath("My", "Test", "Path"),
							locationStack: [],
							sectionsCollapse: []
						}
					});

					setupStore().dispatch(action);
					const expectedCommand = Commands.CorrectionMode.setCorrectionScreenState({
						correctionScreen: {
							visible: false,
							showDetailsState: {}
						}
					});
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});

				it("dispatches Commands.setSectionsCollapsed with the given information from the payload", () => {
					const sectionCollapseInformation = [
						{
							path: createModelPath("My", "Test", "Path", "sec1"),
							collapse: true
						},
						{
							path: createModelPath("My", "Test", "Path", "sec1"),
							collapse: true
						}
					];

					const action = Events.CorrectionMode.goToElement({
						item: {
							formModelPath: createModelPath("My", "Test", "Path"),
							locationStack: [],
							sectionsCollapse: sectionCollapseInformation
						}
					});

					setupStore().dispatch(action);
					const expectedCommand = Commands.setSectionsCollapsed({
						sections: sectionCollapseInformation
					});
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});

				it("dispatches Commands.Commands.setLocationStack with the given information from the payload", () => {
					const locationStackInformation = [
						{
							path: [],
							locationPath: createModelPath("Screen1")
						},
						{
							path: createDocumentPath(["Root"], ["Group1", 1]),
							locationPath: createModelPath("Screen1", "dr-1")
						}
					];

					const action = Events.CorrectionMode.goToElement({
						item: {
							formModelPath: createModelPath("My", "Test", "Path"),
							locationStack: locationStackInformation,
							sectionsCollapse: []
						}
					});

					setupStore().dispatch(action);
					const expectedCommand = Commands.setLocationStack({
						locationStack: locationStackInformation
					});
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});

				it(
					"dispatches Commands.CorrectionMode.setCorrectionModeBackup " +
						"with the current ui stack if the backup is undefined",
					() => {
						const action = Events.CorrectionMode.goToElement({
							item: {
								formModelPath: createModelPath("My", "Test", "Path"),
								locationStack: [],
								sectionsCollapse: []
							}
						});

						setupStore(false).dispatch(action);
						const expectedCommand = Commands.CorrectionMode.setCorrectionModeBackup({
							backup: {
								location: initialLocationStackInformation,
								sections: initialSectionCollapseInformation,
								backups: initialBackups,
								repeatStaticState: undefined
							}
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					}
				);

				it(
					"not dispatch Commands.CorrectionMode.setCorrectionModeBackup with " +
						"the current ui stack if the backup is not undefined",
					() => {
						const action = Events.CorrectionMode.goToElement({
							item: {
								formModelPath: createModelPath("My", "Test", "Path"),
								locationStack: [],
								sectionsCollapse: []
							}
						});

						setupStore(true).dispatch(action);
						const expectedCommand = Commands.CorrectionMode.setCorrectionModeBackup({
							backup: {
								location: initialLocationStackInformation,
								sections: initialSectionCollapseInformation,
								backups: initialBackups
							}
						});
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, expectedCommand);
					}
				);
			}
		});
	});
});
