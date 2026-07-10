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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { DEP_INDEXED } from "../../../../../utils/test-model-helpers/dependencies-indexed.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";

import { executeHiddenPropTest } from "../executeHiddenPropTest.js";

export function executeTestForHidden(): void {
	const dependentElementModels = setupModelsFixture("dependencies.element");
	const dependenciesIndexedModels = setupModelsFixture("dependencies.indexed-controls");

	describe("by dependencies", () => {
		describe("Control inside top level screen", () => {
			describe("MasterField: Enumeration", () => {
				it("does not render a component if a field dependencies with case notRelevant applies", async () => {
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterEnumerationField,
						value: "DependentNotRelevant",
						componentId: DEP_ELEMENT.ENUMERATION.ID_NOT_RELEVANT_FIELD,
						shouldBeHidden: true
					});
				});

				it("does render a component if no dependencies with case notRelevant applies", async () => {
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterEnumerationField,
						value: "DependentReadonly",
						componentId: DEP_ELEMENT.ENUMERATION.ID_NOT_RELEVANT_FIELD,
						shouldBeHidden: false
					});
				});

				it("does not render a component if a group dependencies with case notRelevant applies", async () => {
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterEnumerationGroup,
						value: "DependentGroupNotRelevant",
						componentId: DEP_ELEMENT.ENUMERATION.ID_DEP_FIELD_ONE,
						shouldBeHidden: true
					});
				});
			});

			describe("MasterField: Boolean", () => {
				it("does not render a component if a field dependencies with case notRelevant applies", async () => {
					const uiState = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanField,
						value: true,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_TRUE,
						uiState,
						shouldBeHidden: true
					});

					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanField,
						value: false,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_FALSE,
						uiState,
						shouldBeHidden: true
					});

					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanField,
						value: null,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_FALSE,
						uiState,
						shouldBeHidden: true
					});
				});

				it("renders a component if a field dependencies with case notRelevant does not apply", async () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanField,
						value: false,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_TRUE,
						uiState,
						shouldBeHidden: false
					});

					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanField,
						value: true,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_FALSE,
						uiState,
						shouldBeHidden: false
					});
				});

				it("does not render a component if a group dependencies with case notRelevant applies", async () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanGroup,
						value: true,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_STRING_FIELD_TRUE,
						uiState,
						shouldBeHidden: true
					});

					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanGroup,
						value: false,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_STRING_FIELD_FALSE,
						uiState,
						shouldBeHidden: true
					});

					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanGroup,
						value: null,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_STRING_FIELD_FALSE,
						uiState,
						shouldBeHidden: true
					});
				});

				it("renders a component if a group dependency with case notRelevant does not apply", async () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanGroup,
						value: false,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_STRING_FIELD_TRUE,
						uiState,
						shouldBeHidden: false
					});

					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanGroup,
						value: true,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_STRING_FIELD_FALSE,
						uiState,
						shouldBeHidden: false
					});

					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterBooleanGroup,
						value: true,
						componentId: DEP_ELEMENT.BOOLEAN.ID_NOT_RELEVANT_STRING_FIELD_FALSE,
						uiState,
						shouldBeHidden: false
					});
				});
			});

			describe("MasterField: Confirm", () => {
				it("does not render a component if a field dependencies with case notRelevant applies", async () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.CONFIRM.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterConfirmField,
						value: true,
						componentId: DEP_ELEMENT.CONFIRM.ID_NOT_RELEVANT,
						uiState,
						shouldBeHidden: true
					});
				});

				it("renders a component if a field dependencies with case notRelevant does not apply", async () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.CONFIRM.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterConfirmField,
						value: false,
						componentId: DEP_ELEMENT.CONFIRM.ID_NOT_RELEVANT,
						uiState,
						shouldBeHidden: false
					});
				});

				it("does not render a component if a group dependencies with case notRelevant applies", async () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.CONFIRM.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterConfirmGroup,
						value: true,
						componentId: DEP_ELEMENT.CONFIRM.ID_NOT_RELEVANT_STRING_FIELD,
						uiState,
						shouldBeHidden: true
					});
				});

				it("renders a component if a group dependency with case notRelevant does not apply", async () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.CONFIRM.screenName),
								path: []
							}
						]
					};
					await executeHiddenPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterConfirmGroup,
						value: false,
						componentId: DEP_ELEMENT.CONFIRM.ID_NOT_RELEVANT_STRING_FIELD,
						uiState,
						shouldBeHidden: false
					});
				});
			});
		});

		describe("Control inside detached repeat detail screen", () => {
			describe("MasterField: Enumeration", () => {
				const locationStack: EngineStore.ScreenState[] = [
					{
						locationPath: createModelPath(DEP_ELEMENT.ENUMERATION.screenName),
						path: []
					},
					{
						locationPath: DEP_ELEMENT.ENUMERATION.dr_locationPath,
						path: DEP_ELEMENT.getPathToDependentRepeatableGroup()
					}
				];

				describe("which is outside of repeatable group", () => {
					it("hides the component if a field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToRepeatGroupMasterField,
							value: "2",
							componentId: DEP_ELEMENT.ENUMERATION.ID_DR_DEP_FIELD_MASTER_OUTSIDE,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: true
						});
					});

					it("shows the component if no field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToRepeatGroupMasterField,
							value: "1",
							componentId: DEP_ELEMENT.ENUMERATION.ID_DR_DEP_FIELD_MASTER_OUTSIDE,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: false
						});
					});
				});

				describe("which is inside of repeatable group", () => {
					it("hides the component if a field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToDepRepeatMasterField,
							value: "NotRelevant",
							componentId: DEP_ELEMENT.ENUMERATION.ID_DR_DEP_FIELD,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: true
						});
					});

					it("shows the component if no field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToDepRepeatMasterField,
							value: "SetValueTo123456789",
							componentId: DEP_ELEMENT.ENUMERATION.ID_DR_DEP_FIELD,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: false
						});
					});
				});
			});
		});

		describe("Control inside an embedded repeat detail control-grid", () => {
			describe("MasterField: Enumeration", () => {
				const locationStack: EngineStore.ScreenState[] = [
					{
						locationPath: createModelPath(DEP_ELEMENT.ENUMERATION.screenName),
						path: [],
						repeatInstanceState: {
							[ModelPath.toString(DEP_ELEMENT.ENUMERATION.er_locationPath)]: {
								expandedRowPath: DEP_ELEMENT.getPathToDependentRepeatableGroup()
							}
						}
					}
				];
				describe("which is outside of repeatable group", () => {
					it("hides the components if a field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToRepeatGroupMasterField,
							value: "2",
							componentId: DEP_ELEMENT.ENUMERATION.ID_ER_DEP_FIELD_MASTER_OUTSIDE,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: true
						});
					});

					it("shows the components if no field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToRepeatGroupMasterField,
							value: "1",
							componentId: DEP_ELEMENT.ENUMERATION.ID_ER_DEP_FIELD_MASTER_OUTSIDE,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: false
						});
					});
				});

				describe("which is inside of repeatable group", () => {
					it("hides the components if a field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToDepRepeatMasterField,
							value: "NotRelevant",
							componentId: DEP_ELEMENT.ENUMERATION.ID_ER_DEP_FIELD,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: true
						});
					});

					it("shows the components if no field dependencies with case notRelevant applies", async () => {
						await executeHiddenPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToDepRepeatMasterField,
							value: "SetValueTo123456789",
							componentId: DEP_ELEMENT.ENUMERATION.ID_ER_DEP_FIELD,
							uiState: { screenLocation: locationStack },
							document: DEP_ELEMENT.createDocument(),
							shouldBeHidden: false
						});
					});
				});
			});
		});

		describe("Indexed Control", () => {
			describe("with a numeric index", () => {
				describe("where the master field is outside of the repeatable group", () => {
					testIndexedControls({
						masterFieldPath: DEP_INDEXED.DOCUMENT_MODEL.MASTER_OUTSIDE_FOR_NUMERIC,
						depFieldControl: DEP_INDEXED.FORM_MODEL.NUMERIC_INDEX_FIELD_DEP_MASTER_OUTSIDE,
						fieldFromDepGroupControl: DEP_INDEXED.FORM_MODEL.NUMERIC_INDEX_GROUP_DEP_MASTER_OUTSIDE
					});
				});

				describe("where the master field is inside of the repeatable group", () => {
					testIndexedControls({
						masterFieldPath: DEP_INDEXED.DOCUMENT_MODEL.getNumericMasterPath(2),
						depFieldControl: DEP_INDEXED.FORM_MODEL.NUMERIC_INDEX_FIELD_DEP,
						fieldFromDepGroupControl: DEP_INDEXED.FORM_MODEL.NUMERIC_INDEX_GROUP_DEP
					});
				});
			});

			describe("with a semantic index", () => {
				describe("where the master field is outside of the repeatable group", () => {
					testIndexedControls({
						masterFieldPath: DEP_INDEXED.DOCUMENT_MODEL.MASTER_OUTSIDE_FOR_SEMANTIC,
						depFieldControl: DEP_INDEXED.FORM_MODEL.SEMANTIC_INDEX_FIELD_DEP_MASTER_OUTSIDE,
						fieldFromDepGroupControl: DEP_INDEXED.FORM_MODEL.SEMANTIC_INDEX_GROUP_DEP_MASTER_OUTSIDE
					});
				});

				describe("where the master field is inside of the repeatable group", () => {
					testIndexedControls({
						masterFieldPath: DEP_INDEXED.DOCUMENT_MODEL.getSemanticMasterPath(2),
						depFieldControl: DEP_INDEXED.FORM_MODEL.SEMANTIC_INDEX_FIELD_DEP,
						fieldFromDepGroupControl: DEP_INDEXED.FORM_MODEL.SEMANTIC_INDEX_GROUP_DEP
					});
				});
			});

			function testIndexedControls(options: {
				masterFieldPath: EntityInstancePath;
				depFieldControl: string;
				fieldFromDepGroupControl: string;
			}) {
				const { masterFieldPath, depFieldControl, fieldFromDepGroupControl } = options;

				const document = DEP_INDEXED.createDocument();

				it("hides the component if a field dependency with case notRelevant applies", async () => {
					await executeHiddenPropTest({
						models: dependenciesIndexedModels,
						path: masterFieldPath,
						document,
						value: "nonRelevant",
						componentId: depFieldControl,
						shouldBeHidden: true
					});
				});

				it("shows the component if no field dependencies with case notRelevant apply", async () => {
					await executeHiddenPropTest({
						models: dependenciesIndexedModels,
						path: masterFieldPath,
						document,
						value: null,
						componentId: depFieldControl,
						shouldBeHidden: false
					});
				});

				it("hides the component if a group dependency with case notRelevant applies", async () => {
					await executeHiddenPropTest({
						models: dependenciesIndexedModels,
						path: masterFieldPath,
						document,
						value: "nonRelevant",
						componentId: fieldFromDepGroupControl,
						shouldBeHidden: true
					});
				});

				it("shows the component if no group dependencies with case notRelevant apply", async () => {
					await executeHiddenPropTest({
						models: dependenciesIndexedModels,
						path: masterFieldPath,
						document,
						value: null,
						componentId: fieldFromDepGroupControl,
						shouldBeHidden: false
					});
				});
			}
		});
	});
}
