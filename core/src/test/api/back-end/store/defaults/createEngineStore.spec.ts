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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import type { EngineState, EngineStore } from "../../../../../back-end/store/index.js";
import { createEngineStore } from "../../../../../back-end/store/index.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { setupFixtureObject, setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	createDocumentPath,
	createModelPath
} from "../../../../utils/test-model-helpers/dependent-enumeration.js";

describe("api.back-end.store.defaults", () => {
	const models = setupModelsFixture("controls.initial-values");

	describe("createEngineStore", () => {
		describe("data", () => {
			describe("given an empty data object", () => {
				const engineState: EngineState = setupFixtureObject(() =>
					createEngineStore({
						models,
						locale: US_LOCALE,
						data: {}
					})
				);

				it("returns an EngineState with dirty=false", () => {
					strictEqual(engineState.data.dirty, false);
				});

				it("returns an EngineState with an empty document in which initial values are set and a non existing value for boolean is set to false", () => {
					deepStrictEqual(engineState.data.document, {
						rootGroup: {
							withInitialValues: {
								StringField: "String value",
								NumberField: 42,
								BooleanFieldTrue: true,
								BooleanFieldFalse: false,
								ConfirmField: true,
								DateField: new Date("2020-03-09"),
								DateTimeField: new Date("2020-03-09T09:25:00.000Z"),
								TimeField: new Date("1970-01-01T10:25:00.000Z"),
								EnumerationField: "key_2"
							}
						}
					});
				});
			});

			describe("given an data object with a document and a dirty state", () => {
				it("returns an EngineState where the given parameters are set", () => {
					const customDocument = {
						myRootGroup: {
							group1: {
								field1: "Test"
							}
						}
					};
					const engineState = createEngineStore({
						models,
						locale: US_LOCALE,
						data: {
							dirty: true,
							document: customDocument
						}
					});

					strictEqual(engineState.data.dirty, true, "Wrong dirty state");
					deepStrictEqual(engineState.data.document, customDocument);
				});
			});
		});

		describe("models", () => {
			it("returns an EngineState with the given models", () => {
				const engineState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: {}
				});

				deepStrictEqual(engineState.models, models);
			});
		});

		describe("ui state", () => {
			describe("given an empty ui state object", () => {
				const engineState: EngineState = setupFixtureObject(() =>
					createEngineStore({
						models,
						locale: US_LOCALE,
						data: {}
					})
				);

				it("returns an EngineState with an ui state where dirty=false", () => {
					strictEqual(engineState.ui.dirty, false);
				});

				it("returns an EngineState with backup set to an empty array", () => {
					deepStrictEqual(engineState.ui.backup, []);
				});

				it("returns an EngineState with screenLocation set to the first top level screen of the form model", () => {
					const expectedScreenLocation: ReadonlyArray<EngineStore.ScreenState> = [
						{
							locationPath: createModelPath("Screen1"),
							path: [],
							focusedComponent: undefined
						}
					];

					deepStrictEqual(engineState.ui.screenLocation, expectedScreenLocation);
				});

				it("returns an EngineState with sectionState set to an empty object", () => {
					deepStrictEqual(engineState.ui.sectionState, {});
				});

				it("returns an EngineState with messages set to an empty object", () => {
					deepStrictEqual(engineState.ui.messages, {});
				});

				it("returns an EngineState with disabled=false", () => {
					strictEqual(engineState.ui.disabled, false);
				});

				it("returns an EngineState with readonly=false", () => {
					strictEqual(engineState.ui.readonly, false);
				});
				it("returns an EngineState with a correctionScreen object which contains visible=false and an empty showDetailsState", () => {
					deepStrictEqual(engineState.ui.correctionScreen, {
						visible: false,
						showDetailsState: {}
					});
				});
				it("returns an EngineState with a validationBar object which contains visible=false, expanded=false and currentMessageKey=undefined", () => {
					deepStrictEqual(engineState.ui.validationBar, {
						visible: false,
						expanded: false,
						currentMessageKey: undefined
					});
				});
			});

			describe("given an ui state", () => {
				it("returns an EngineState where the given parameters are set", () => {
					const entry: EngineStore.Validation.Entry = {
						validationMessages: []
					};

					const uiState: EngineStore.UIState = {
						backup: [
							{
								document: { group1: { field1: "test" } },
								messages: { key1: entry }
							}
						],
						correctionScreen: { visible: true, showDetailsState: { key2: true } },
						dirty: true,
						disabled: true,
						messages: { key2: entry },
						readonly: true,
						screenLocation: [
							{
								locationPath: createModelPath("MyScreen"),
								path: createDocumentPath(["Root"], ["Group"]),
								focusedComponent: {
									formModelPath: createModelPath("MyScreen", "Component1"),
									index: 4
								},
								focusedComponentRequestCount: 1
							}
						],
						repeatStaticState: {
							repeat1: { filterRowOpen: true }
						},
						sectionState: {
							section1: true
						},
						validationBar: { visible: true, currentMessageKey: "key_7", expanded: true },
						correctionModeBackup: {
							location: [
								{
									locationPath: createModelPath("MyScreenBackup"),
									path: createDocumentPath(["Root"], ["BackupGroup"])
								}
							],
							sections: { section2: true },
							backups: [
								{
									document: { group1: { field1: "test2" } },
									messages: { key2: entry }
								}
							]
						}
					};

					const engineState = createEngineStore({
						models,
						locale: US_LOCALE,
						data: {},
						ui: uiState
					});

					deepStrictEqual(engineState.ui, uiState);
				});
			});
		});
	});
});
