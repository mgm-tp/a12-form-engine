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

import * as Optic from "@fp-ts/optic";
import { act } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore, Models } from "../../../../../../back-end/store/index.js";
import { FormModel } from "../../../../../../models/index.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import { ModelHelpers } from "../../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	CONTROLS,
	createDocumentForControlsModels,
	locationStackForControlsModel
} from "../../../../../utils/test-model-helpers/controls.js";
import { DEP_INDEXED } from "../../../../../utils/test-model-helpers/dependencies-indexed.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";
import { createDocumentPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";
import { setupPicusTypeTest as setupPicusTypeTestRtl } from "../../../../../utils/test-model-helpers/picustypes.js";
import { IDS } from "../../../../../utils/test-model-helpers/readonly.js";

import { executeReadonlyPropTest } from "../executeReadonlyPropTest.js";

const { setupFormEngineRendererWithRtl, loadModels } = SetupHelpers;
const { createModelPath } = ModelHelpers;

export function executeTestForReadonly(): void {
	const controls = setupModelsFixture("controls");
	const dependentElementModels = setupModelsFixture("dependencies.element");
	const readonlyModel = setupModelsFixture("enablement.readonly");
	const dependenciesIndexedModels = setupModelsFixture("dependencies.indexed-controls");

	it("renders a component with prop 'readonly=true' if the input is set read-only in the model", () => {
		const picusTypesModels = loadModels("controls.picustypes");
		const { widgetMap } = setupPicusTypeTestRtl({ models: picusTypesModels });

		query(widgetMap.TextLineStateless)
			.withId("a12-Number01-id3939-2")
			.withProp("readonly", true)
			.assertRendered();
	});

	it("renders a component with prop 'readonly=true' if the related field is computed", () => {
		const computationModels = loadModels("computation-validation.computation");
		const CONTROL_ID = "control-f5093";

		const computedControlReadonlyLens = Optic.id<Models>()
			.at("formModel")
			.at("content")
			.at("screens")
			.compose(Optic.findFirst(s => s.name === CONTROLS.screenName))
			.at("screenElements")
			.compose(Optic.findFirst(se => se.name === "cg"))
			.filter(FormModel.ControlGrid.isInstance)
			.at("row")
			.nonNullable()
			.compose(Optic.findFirst(r => r.name === "r2"))
			.at("cell")
			.nonNullable()
			.compose(Optic.findFirst(c => c.id === CONTROL_ID))
			.filter(FormModel.Control.isInstance)
			.at("readonly");

		const models = Optic.modify(computedControlReadonlyLens)(() => false)(computationModels);

		const { widgetMap } = setupFormEngineRendererWithRtl({
			models
		});

		query(widgetMap.TextLineStateless)
			.withId("a12-FieldG-F18")
			.withProp("readonly", true)
			.assertRendered();
	});

	it("renders a component with prop 'readonly=true' if the parent control-grid is set read-only in the model", () => {
		const { widgetMap } = setupFormEngineRendererWithRtl({ models: readonlyModel });

		query(widgetMap.TextLineStateless)
			.withId(IDS.STRING_FIELD_IN_INPUT_CG)
			.withProp("readonly", true)
			.assertRendered();
	});

	it(
		"renders a component with prop 'readonly=true' if the control is " +
			"inside a detached repeat detail screen and the repeat is read-only",
		() => {
			const { widgetMap } = setupFormEngineRendererWithRtl({
				models: controls,
				data: {
					document: createDocumentForControlsModels({ L0_Number: 42, L1_Number: 44 })
				},
				ui: {
					screenLocation: locationStackForControlsModel({
						locationPath: CONTROLS.dr_readonly_locationPath
					})
				}
			});

			for (const id of [CONTROLS.ID_L0_NUMBER_IN_RO_DR, CONTROLS.ID_L1_NUMBER_IN_RO_DR]) {
				query(widgetMap.TextLineStateless).withId(id).withProp("readonly", true).assertRendered();
			}
		}
	);

	it(
		"renders a component with prop 'readonly=true' if the control is " +
			"inside an embedded repeat detail control-grid and the repeat is read-only",
		async () => {
			const doc = createDocumentForControlsModels({ L0_Number: 42, L1_Number: 44 });
			const { widgetMap } = await act(() =>
				setupFormEngineRendererWithRtl({
					models: controls,
					data: { document: doc },
					ui: {
						screenLocation: locationStackForControlsModel({
							repeatInstanceState: {
								[ModelPath.toString(CONTROLS.er_readonly_locationPath)]: {
									expandedRowPath: createDocumentPath(
										[CONTROLS.ROOT],
										[CONTROLS.repeatableGroup, 1]
									)
								}
							}
						}),
						backup: [{ document: doc, messages: {} }]
					},
					withWidgets: true
				})
			);

			for (const id of [CONTROLS.ID_L0_NUMBER_IN_RO_ER, CONTROLS.ID_L1_NUMBER_IN_RO_ER]) {
				query(widgetMap.TextLineStateless).withId(id).withProp("readonly", true).assertRendered();
			}
		}
	);

	describe("readonly presentation", () => {
		describe("Given a control which does not reference an attachment", () => {
			it("renders a TextOutput if the input is read-only and the readonly presentation of the input is 'TEXT'", () => {
				const { widgetMap } = setupFormEngineRendererWithRtl({
					models: readonlyModel,
					ui: { readonly: true }
				});

				query(widgetMap.TextOutput).withId(IDS.STRING_TO_RO_PRESENTATION).assertRendered();
			});

			it("renders a normal Input if the input is read-only and the readonly presentation is not defined", () => {
				const { widgetMap } = setupFormEngineRendererWithRtl({
					models: readonlyModel,
					ui: { readonly: true }
				});
				query(widgetMap.TextLineStateless)
					.withId(IDS.STRING_NO_RO_PRESENTATION)
					.withProp("readonly", true)
					.assertRendered();
			});

			it("renders a normal Input if the input is read-only and the readonly presentation is 'INPUT'", () => {
				const { widgetMap } = setupFormEngineRendererWithRtl({
					models: readonlyModel,
					ui: { readonly: true }
				});
				query(widgetMap.TextLineStateless)
					.withId(IDS.STRING_INPUT_RO_PRESENTATION)
					.withProp("readonly", true)
					.assertRendered();
			});
		});

		describe("Given a control which references an attachment", () => {
			it("renders a normal Input if the input is read-only and the readonly presentation of the parent is 'TEXT'", () => {
				const { widgetMap } = setupFormEngineRendererWithRtl({
					models: readonlyModel,
					ui: { readonly: true }
				});
				query(widgetMap.DefaultFileUpload).withId(IDS.ATTACHMENT).assertRendered();
			});
		});
	});

	describe("by dependencies", () => {
		describe("Control inside top level screen", () => {
			describe("MasterField: Enumeration", () => {
				it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", () => {
					executeReadonlyPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterEnumerationField,
						value: "DependentReadonly",
						shouldBeReadonly: true,
						componentId: DEP_ELEMENT.ENUMERATION.ID_DEP_READONLY
					});
				});

				it("renders a component with prop 'readonly=true' if a group dependencies with case readonly applies", () => {
					executeReadonlyPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterEnumerationGroup,
						value: "DependentGroupReadonly",
						shouldBeReadonly: true,
						componentId: DEP_ELEMENT.ENUMERATION.ID_DEP_FIELD_ONE
					});
				});
			});

			describe("MasterField: Boolean", () => {
				describe("boolean = true", () => {
					it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", () => {
						const uiState: Pick<EngineStore.UIState, "screenLocation"> &
							Partial<EngineStore.UIState> = {
							screenLocation: [
								{
									locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
									path: []
								}
							]
						};
						executeReadonlyPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToMasterBooleanField,
							value: true,
							shouldBeReadonly: true,
							componentId: DEP_ELEMENT.BOOLEAN.ID_DEP_READONLY_TRUE,
							uiState
						});
					});
				});

				describe("boolean = false", () => {
					it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", () => {
						const uiState: Pick<EngineStore.UIState, "screenLocation"> &
							Partial<EngineStore.UIState> = {
							screenLocation: [
								{
									locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
									path: []
								}
							]
						};

						executeReadonlyPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToMasterBooleanField,
							value: false,
							shouldBeReadonly: true,
							componentId: DEP_ELEMENT.BOOLEAN.ID_DEP_READONLY_FALSE,
							uiState
						});
					});

					it("renders a component with prop 'readonly=true' if a group dependencies with case readonly applies", () => {
						const uiState: Pick<EngineStore.UIState, "screenLocation"> &
							Partial<EngineStore.UIState> = {
							screenLocation: [
								{
									locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
									path: []
								}
							]
						};

						executeReadonlyPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToMasterBooleanField,
							value: false,
							shouldBeReadonly: true,
							componentId: DEP_ELEMENT.BOOLEAN.ID_RO_STRING_FIELD_FALSE,
							uiState
						});
					});

					it("does not render a component with prop 'readonly=true' if a group dependencies with case readonly applies", () => {
						const uiState: Pick<EngineStore.UIState, "screenLocation"> &
							Partial<EngineStore.UIState> = {
							screenLocation: [
								{
									locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
									path: []
								}
							]
						};

						executeReadonlyPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToMasterBooleanField,
							value: false,
							shouldBeReadonly: true,
							componentId: DEP_ELEMENT.BOOLEAN.ID_RO_STRING_FIELD_FALSE,
							uiState
						});
					});
				});

				describe("boolean = null", () => {
					it("renders a component with prop 'readonly=false' if a field dependencies with case readonly applies", () => {
						const uiState: Pick<EngineStore.UIState, "screenLocation"> &
							Partial<EngineStore.UIState> = {
							screenLocation: [
								{
									locationPath: createModelPath(DEP_ELEMENT.BOOLEAN.screenName),
									path: []
								}
							]
						};

						executeReadonlyPropTest({
							models: dependentElementModels,
							path: DEP_ELEMENT.pathToMasterBooleanField,
							value: null,
							shouldBeReadonly: false,
							componentId: DEP_ELEMENT.BOOLEAN.ID_DEP_READONLY_FALSE,
							uiState
						});
					});
				});
			});

			describe("MasterField: Confirm", () => {
				it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.CONFIRM.screenName),
								path: []
							}
						]
					};
					executeReadonlyPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterConfirmField,
						value: true,
						shouldBeReadonly: true,
						componentId: DEP_ELEMENT.CONFIRM.ID_DEP_READONLY,
						uiState
					});
				});

				it("renders a component with prop 'readonly=true' if a group dependencies with case readonly applies", () => {
					const uiState: Pick<EngineStore.UIState, "screenLocation"> &
						Partial<EngineStore.UIState> = {
						screenLocation: [
							{
								locationPath: createModelPath(DEP_ELEMENT.CONFIRM.screenName),
								path: []
							}
						]
					};
					executeReadonlyPropTest({
						models: dependentElementModels,
						path: DEP_ELEMENT.pathToMasterConfirmGroup,
						value: true,
						shouldBeReadonly: true,
						componentId: DEP_ELEMENT.CONFIRM.ID_RO_STRING_FIELD,
						uiState
					});
				});
			});
		});

		describe("Control inside detached repeat detail screen", () => {
			describe("MasterField: Enumeration", () => {
				function locationStack(): EngineStore.ScreenState[] {
					return [
						{
							locationPath: createModelPath(DEP_ELEMENT.ENUMERATION.screenName),
							path: []
						},
						{
							locationPath: DEP_ELEMENT.ENUMERATION.dr_locationPath,
							path: DEP_ELEMENT.getPathToDependentRepeatableGroup()
						}
					];
				}

				describe("which is outside of repeatable group", () => {
					it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", () => {
						executeReadonlyPropTest({
							models: dependentElementModels,
							document: DEP_ELEMENT.createDocument(),
							path: DEP_ELEMENT.pathToRepeatGroupMasterField,
							value: "1",
							shouldBeReadonly: true,
							componentId: DEP_ELEMENT.ENUMERATION.ID_DR_DEP_FIELD_MASTER_OUTSIDE,
							uiState: { screenLocation: locationStack() }
						});
					});
				});

				describe("which is inside of repeatable group", () => {
					it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", () => {
						executeReadonlyPropTest({
							models: dependentElementModels,
							document: DEP_ELEMENT.createDocument(),
							path: DEP_ELEMENT.pathToDepRepeatMasterField,
							value: "Readonly",
							shouldBeReadonly: true,
							componentId: DEP_ELEMENT.ENUMERATION.ID_DR_DEP_FIELD,
							uiState: { screenLocation: locationStack() }
						});
					});
				});
			});
		});

		// inside repeat -> need to render with real repeat components. the
		// input is mocked, because RTL's ariaReadonly failed (plus rendering
		// mocks is also faster)
		describe("Control inside embedded repeat detail control-grid", () => {
			describe("MasterField: Enumeration", () => {
				function insideEmbeddedRepeatLocation(): EngineStore.ScreenState[] {
					return [
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
				}

				async function render(document: GroupInstance) {
					return act(() =>
						setupFormEngineRendererWithRtl({
							models: dependentElementModels,
							ui: {
								screenLocation: insideEmbeddedRepeatLocation(),
								backup: [{ document: document, messages: {} }]
							},
							data: {
								document
							},
							withWidgets: true
						})
					);
				}

				describe("which is outside of repeatable group", () => {
					it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", async () => {
						const newDocument = DocumentUtils.setValue(
							DEP_ELEMENT.createDocument(),
							DEP_ELEMENT.pathToRepeatGroupMasterField,
							"1",
							dependentElementModels.documentModel
						);

						const { widgetMap } = await render(newDocument);

						query(widgetMap.TextLineStateless)
							.withId(DEP_ELEMENT.ENUMERATION.ID_ER_DEP_FIELD_MASTER_OUTSIDE)
							.withProp("readonly", true)
							.assertRendered();
					});
				});

				describe("which is inside of repeatable group", () => {
					it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", async () => {
						const newDocument = DocumentUtils.setValue(
							DEP_ELEMENT.createDocument(),
							DEP_ELEMENT.pathToDepRepeatMasterField,
							"Readonly",
							dependentElementModels.documentModel
						);

						const { widgetMap } = await render(newDocument);

						query(widgetMap.TextLineStateless)
							.withId(DEP_ELEMENT.ENUMERATION.ID_ER_DEP_FIELD)
							.withProp("readonly", true)
							.assertRendered();
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

				it("renders a component with readonly === true if a field dependency with case readonly applies", () => {
					executeReadonlyPropTest({
						models: dependenciesIndexedModels,
						document,
						path: masterFieldPath,
						value: "readonly",
						componentId: depFieldControl,
						shouldBeReadonly: true
					});
				});

				it("renders a component with readonly === false if no field dependencies with case readonly apply", () => {
					executeReadonlyPropTest({
						models: dependenciesIndexedModels,
						document,
						path: masterFieldPath,
						value: null,
						componentId: depFieldControl,
						shouldBeReadonly: false
					});
				});

				it("renders a component with readonly === true if a group dependency with case readonly applies", () => {
					executeReadonlyPropTest({
						models: dependenciesIndexedModels,
						document,
						path: masterFieldPath,
						value: "readonly",
						componentId: fieldFromDepGroupControl,
						shouldBeReadonly: true
					});
				});

				it("renders a component with readonly === false if no group dependencies with case readonly apply", () => {
					executeReadonlyPropTest({
						models: dependenciesIndexedModels,
						document,
						path: masterFieldPath,
						value: null,
						componentId: fieldFromDepGroupControl,
						shouldBeReadonly: false
					});
				});
			}
		});
	});
}
